import { readFile, writeFile } from "node:fs/promises"
import pixelmatch from "pixelmatch"
import { PNG } from "pngjs"

export const viewports = {
  desktop: { width: 1903, height: 924 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 },
  zhMobile: { width: 375, height: 812 },
}

export const surfaces = [
  { id: "desktop", route: "/", viewport: viewports.desktop },
  { id: "tablet", route: "/", viewport: viewports.tablet },
  { id: "mobile", route: "/", viewport: viewports.mobile },
  { id: "zhMobile", route: "/zh/", viewport: viewports.zhMobile },
]

export const pageUrl = (baseUrl, route) =>
  new URL(route, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`).toString()

const readPng = async (path) => PNG.sync.read(await readFile(path))

const normalizePng = (source, width, height) => {
  const normalized = new PNG({ width, height })
  PNG.bitblt(source, normalized, 0, 0, source.width, source.height, 0, 0)
  return normalized
}

const summarizeDiff = (diff, width, height) => {
  const columns = 8
  const rows = 8
  const regionWidth = Math.ceil(width / columns)
  const regionHeight = Math.ceil(height / rows)
  const regions = new Map()
  let changedPixels = 0
  const bounds = { bottom: 0, left: width, right: 0, top: height }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = diff.data[(y * width + x) * 4 + 3]
      if (alpha === 0) {
        continue
      }
      changedPixels += 1
      bounds.left = Math.min(bounds.left, x)
      bounds.right = Math.max(bounds.right, x + 1)
      bounds.top = Math.min(bounds.top, y)
      bounds.bottom = Math.max(bounds.bottom, y + 1)
      const column = Math.floor(x / regionWidth)
      const row = Math.floor(y / regionHeight)
      const key = `${column}:${row}`
      regions.set(key, (regions.get(key) ?? 0) + 1)
    }
  }

  const topRegions = Array.from(regions.entries())
    .map(([key, diffPixels]) => {
      const [column, row] = key.split(":").map(Number)
      const x = column * regionWidth
      const y = row * regionHeight
      const widthInRegion = Math.min(regionWidth, width - x)
      const heightInRegion = Math.min(regionHeight, height - y)
      return {
        diffPixels,
        height: heightInRegion,
        ratio: diffPixels / (widthInRegion * heightInRegion),
        width: widthInRegion,
        x,
        y,
      }
    })
    .sort((a, b) => b.diffPixels - a.diffPixels)
    .slice(0, 8)

  return {
    bounds: changedPixels === 0 ? null : bounds,
    changedPixels,
    topRegions,
  }
}

export const comparePng = async (options) => {
  const actual = await readPng(options.actualPath)
  const expected = await readPng(options.expectedPath)
  const width = Math.max(actual.width, expected.width)
  const height = Math.max(actual.height, expected.height)
  const normalizedActual = normalizePng(actual, width, height)
  const normalizedExpected = normalizePng(expected, width, height)
  const diff = new PNG({ width, height })
  const diffPixels = pixelmatch(
    normalizedActual.data,
    normalizedExpected.data,
    diff.data,
    width,
    height,
    { diffMask: true, includeAA: true, threshold: options.pixelmatchThreshold }
  )

  await writeFile(options.diffPath, PNG.sync.write(diff))

  const totalPixels = width * height
  const similarityScore = (1 - diffPixels / totalPixels) * 100
  return {
    actualHeight: actual.height,
    actualPath: options.actualPath,
    actualWidth: actual.width,
    diffPath: options.diffPath,
    diffPixels,
    diffRatio: diffPixels / totalPixels,
    expectedHeight: expected.height,
    expectedPath: options.expectedPath,
    expectedWidth: expected.width,
    height,
    hotspots: summarizeDiff(diff, width, height),
    pass: similarityScore >= options.strictSimilarity,
    similarityScore,
    totalPixels,
    width,
  }
}

export const capturePage = async ({ browser, path, target, surface }) => {
  const context = await browser.newContext({ deviceScaleFactor: 1, viewport: surface.viewport })
  const page = await context.newPage()
  const consoleErrors = []
  const pageErrors = []
  const requestFailures = []

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text())
    }
  })
  page.on("pageerror", (error) => pageErrors.push(error.message))
  page.on("requestfailed", (request) => {
    requestFailures.push({ failure: request.failure()?.errorText ?? null, url: request.url() })
  })

  const url = pageUrl(target.baseUrl, surface.route)
  const response = await page.goto(url, { waitUntil: "domcontentloaded" })
  await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => undefined)
  await page.screenshot({ fullPage: true, path })

  const layout = await page.evaluate(() => {
    const rectFor = (selector) => {
      const element = document.querySelector(selector)
      if (!element) {
        return null
      }
      const rect = element.getBoundingClientRect()
      return {
        bottom: rect.bottom,
        height: rect.height,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        width: rect.width,
      }
    }
    const textRects = Array.from(document.querySelectorAll("h1,h2,p,a,strong,li"), (element) => {
      const rect = element.getBoundingClientRect()
      return {
        bottom: rect.bottom,
        height: rect.height,
        left: rect.left,
        right: rect.right,
        tag: element.tagName.toLowerCase(),
        text: element.textContent?.trim() ?? "",
        top: rect.top,
        width: rect.width,
      }
    }).filter((rect) => rect.width > 0 && rect.height > 0 && rect.text.length > 0)
    const overflowingTextRects = textRects.filter(
      (rect) => rect.left < -1 || rect.right > window.innerWidth + 1
    )

    return {
      bodyTextSample: document.body.innerText.slice(0, 4000),
      documentHeight: document.documentElement.scrollHeight,
      documentWidth: document.documentElement.scrollWidth,
      footerLinks: Array.from(document.querySelectorAll("footer a"), (anchor) => ({
        color: getComputedStyle(anchor).color,
        href: anchor.getAttribute("href"),
        text: anchor.textContent?.trim() ?? "",
      })),
      lang: document.documentElement.lang,
      layoutRects: {
        body: rectFor("body"),
        footer: rectFor("footer"),
        h1: rectFor("h1"),
        header: rectFor("header"),
        main: rectFor("main"),
      },
      overflow: {
        horizontal: document.documentElement.scrollWidth > window.innerWidth,
        overflowingTextRects,
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      },
      textRects: textRects.slice(0, 120),
      title: document.title,
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
    }
  })

  await context.close()

  return {
    consoleErrors,
    finalUrl: page.url(),
    layout,
    pageErrors,
    requestFailures,
    screenshotPath: path,
    status: response?.status() ?? null,
    url,
  }
}

export const checkHttp = async (url) => {
  const startedAt = Date.now()
  const response = await fetch(url, { redirect: "manual" })
  return {
    contentType: response.headers.get("content-type"),
    durationMs: Date.now() - startedAt,
    location: response.headers.get("location"),
    ok: response.ok,
    status: response.status,
    url,
  }
}
