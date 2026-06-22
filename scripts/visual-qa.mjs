import { mkdir, readFile, writeFile } from "node:fs/promises"
import pixelmatch from "pixelmatch"
import { chromium } from "playwright"
import { PNG } from "pngjs"

const evidenceRoot = ".omo/ulw-loop/vite-cloudflare-20260622/evidence"
const screenshotRoot = `${evidenceRoot}/screenshots`
const desktop = { width: 1903, height: 924 }
const mobile = { width: 375, height: 812 }
const tablet = { width: 768, height: 1024 }

const readPng = async (path) => PNG.sync.read(await readFile(path))

const comparePng = async ({ actualPath, diffPath, expectedPath }) => {
  const actual = await readPng(actualPath)
  const expected = await readPng(expectedPath)
  const width = Math.min(actual.width, expected.width)
  const height = Math.min(actual.height, expected.height)
  const actualCrop = new PNG({ width, height })
  const expectedCrop = new PNG({ width, height })

  PNG.bitblt(actual, actualCrop, 0, 0, width, height, 0, 0)
  PNG.bitblt(expected, expectedCrop, 0, 0, width, height, 0, 0)

  const diff = new PNG({ width, height })
  const diffPixels = pixelmatch(actualCrop.data, expectedCrop.data, diff.data, width, height, {
    threshold: 0.1,
  })

  await writeFile(diffPath, PNG.sync.write(diff))

  const totalPixels = width * height
  return {
    diffPixels,
    diffRatio: diffPixels / totalPixels,
    height,
    similarityScore: (1 - diffPixels / totalPixels) * 100,
    totalPixels,
    width,
  }
}

const capturePage = async ({ browser, path, url, viewport }) => {
  const context = await browser.newContext({ deviceScaleFactor: 1, viewport })
  const page = await context.newPage()
  const consoleErrors = []
  const pageErrors = []

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text())
    }
  })
  page.on("pageerror", (error) => {
    pageErrors.push(error.message)
  })

  const response = await page.goto(url, { waitUntil: "domcontentloaded" })
  await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => undefined)
  await page.screenshot({ path, fullPage: true })

  const layout = await page.evaluate(() => {
    const visibleTextRects = Array.from(
      document.querySelectorAll("h1,h2,p,a,strong,li"),
      (element) => {
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
      },
    ).filter((rect) => rect.width > 0 && rect.height > 0 && rect.text.length > 0)

    return {
      bodyText: document.body.innerText,
      documentHeight: document.documentElement.scrollHeight,
      footerColors: Array.from(
        document.querySelectorAll("footer a, footer span[aria-hidden='true']"),
        (element) => ({
          color: getComputedStyle(element).color,
          text: element.textContent?.trim() ?? "",
        }),
      ),
      hrefs: Array.from(document.querySelectorAll("a"), (anchor) => anchor.getAttribute("href")),
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      lang: document.documentElement.lang,
      title: document.title,
      visibleTextOutsideViewport: visibleTextRects.filter(
        (rect) => rect.left < -1 || rect.right > window.innerWidth + 1,
      ),
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
    }
  })

  await context.close()

  return {
    consoleErrors,
    layout,
    status: response?.status() ?? null,
    url,
    pageErrors,
  }
}

const checkHttp = async (url) => {
  const response = await fetch(url, { redirect: "manual" })
  return {
    contentType: response.headers.get("content-type"),
    location: response.headers.get("location"),
    status: response.status,
    url,
  }
}

const getFooterLinks = (layout) => layout.hrefs.slice(-4).map((href) => href ?? null)
const getFooterColors = (layout) => layout.footerColors

const run = async () => {
  const localUrl = process.env.LOCAL_URL ?? "http://127.0.0.1:4173"
  const liveUrl = process.env.LIVE_URL ?? "https://minshot.fehey.com"
  const deployedUrl = process.env.DEPLOYED_URL

  await mkdir(screenshotRoot, { recursive: true })

  const browser = await chromium.launch({ channel: "chrome", headless: true })
  const liveDesktopPath = `${screenshotRoot}/reference-live-1903x924.png`
  const localDesktopPath = `${screenshotRoot}/local-desktop-1903x924.png`
  const localMobilePath = `${screenshotRoot}/local-mobile-375x812.png`
  const localTabletPath = `${screenshotRoot}/local-tablet-768x1024.png`
  const localZhMobilePath = `${screenshotRoot}/local-zh-375x812.png`

  const liveDesktop = await capturePage({
    browser,
    path: liveDesktopPath,
    url: liveUrl,
    viewport: desktop,
  })
  const localDesktop = await capturePage({
    browser,
    path: localDesktopPath,
    url: localUrl,
    viewport: desktop,
  })
  const localMobile = await capturePage({
    browser,
    path: localMobilePath,
    url: localUrl,
    viewport: mobile,
  })
  const localTablet = await capturePage({
    browser,
    path: localTabletPath,
    url: localUrl,
    viewport: tablet,
  })
  const localZhMobile = await capturePage({
    browser,
    path: localZhMobilePath,
    url: `${localUrl}/zh/`,
    viewport: mobile,
  })

  const localVsLive = await comparePng({
    actualPath: localDesktopPath,
    diffPath: `${screenshotRoot}/local-vs-live-diff.png`,
    expectedPath: liveDesktopPath,
  })

  const localRoutes = {
    root: await checkHttp(localUrl),
    zhNoSlash: await checkHttp(`${localUrl}/zh`),
    zhSlash: await checkHttp(`${localUrl}/zh/`),
  }

  let deployed = null
  if (deployedUrl) {
    const deployedDesktopPath = `${screenshotRoot}/deployed-desktop-1903x924.png`
    const deployedZhMobilePath = `${screenshotRoot}/deployed-zh-375x812.png`
    const deployedDesktop = await capturePage({
      browser,
      path: deployedDesktopPath,
      url: deployedUrl,
      viewport: desktop,
    })
    const deployedZhMobile = await capturePage({
      browser,
      path: deployedZhMobilePath,
      url: `${deployedUrl}/zh/`,
      viewport: mobile,
    })
    deployed = {
      desktop: deployedDesktop,
      deployedVsLocal: await comparePng({
        actualPath: deployedDesktopPath,
        diffPath: `${screenshotRoot}/deployed-vs-local-diff.png`,
        expectedPath: localDesktopPath,
      }),
      routes: {
        root: await checkHttp(deployedUrl),
        zhNoSlash: await checkHttp(`${deployedUrl}/zh`),
        zhSlash: await checkHttp(`${deployedUrl}/zh/`),
      },
      zhMobile: deployedZhMobile,
    }
  }

  await browser.close()

  const result = {
    deployed,
    liveDesktop,
    localDesktop,
    localMobile,
    localRoutes,
    localTablet,
    localVsLive,
    localZhMobile,
    pass: {
      footerColorsMatchLive:
        JSON.stringify(getFooterColors(localDesktop.layout)) ===
        JSON.stringify(getFooterColors(liveDesktop.layout)),
      footerLinksMatchLive:
        JSON.stringify(getFooterLinks(localDesktop.layout)) ===
        JSON.stringify(getFooterLinks(liveDesktop.layout)),
      localDesktopSimilarity: localVsLive.similarityScore >= 99.5,
      localNoConsoleErrors:
        localDesktop.consoleErrors.length === 0 && localDesktop.pageErrors.length === 0,
      localNoResponsiveOverflow:
        !localMobile.layout.horizontalOverflow &&
        !localTablet.layout.horizontalOverflow &&
        !localZhMobile.layout.horizontalOverflow,
      localZhIsChinese: localZhMobile.layout.bodyText.includes("原生 macOS 截图工具"),
      routesReachable:
        localRoutes.root.status === 200 &&
        [200, 301, 302, 308].includes(localRoutes.zhNoSlash.status) &&
        localRoutes.zhSlash.status === 200,
    },
  }

  await writeFile(`${evidenceRoot}/visual-qa.json`, `${JSON.stringify(result, null, 2)}\n`)
  console.log(JSON.stringify(result.pass, null, 2))
}

await run()
