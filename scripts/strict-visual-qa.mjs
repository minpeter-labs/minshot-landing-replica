import { mkdir, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { chromium } from "playwright"
import { capturePage, checkHttp, comparePng, pageUrl, surfaces, viewports } from "./visual-qa.mjs"

const strictSimilarity = Number(process.env.STRICT_SIMILARITY ?? "99.999")
const pixelmatchThreshold = Number(process.env.PIXELMATCH_THRESHOLD ?? "0.01")
const evidencePath = process.env.EVIDENCE_PATH

if (!evidencePath) {
  throw new Error(
    "EVIDENCE_PATH is required, for example EVIDENCE_PATH=.omo/evidence/visual-qa.json",
  )
}

const evidenceFile = resolve(evidencePath)
const evidenceRoot = dirname(evidenceFile)
const screenshotRoot = `${evidenceRoot}/screenshots`

const checkRoutes = async (target) => ({
  root: await checkHttp(pageUrl(target.baseUrl, "/")),
  zhNoSlash: await checkHttp(pageUrl(target.baseUrl, "/zh")),
  zhSlash: await checkHttp(pageUrl(target.baseUrl, "/zh/")),
})

const captureTarget = async (browser, target) => {
  const entries = await Promise.all(
    surfaces.map(async (surface) => {
      const path = `${screenshotRoot}/${target.id}-${surface.id}-${surface.viewport.width}x${surface.viewport.height}.png`
      return [surface.id, await capturePage({ browser, path, surface, target })]
    }),
  )
  return Object.fromEntries(entries)
}

const compareTargets = async ({ actual, actualId, expected, expectedId }) => {
  const entries = await Promise.all(
    surfaces.map(async (surface) => [
      surface.id,
      await comparePng({
        actualPath: actual[surface.id].screenshotPath,
        diffPath: `${screenshotRoot}/${actualId}-vs-${expectedId}-${surface.id}-diff.png`,
        expectedPath: expected[surface.id].screenshotPath,
        pixelmatchThreshold,
        strictSimilarity,
      }),
    ]),
  )
  return Object.fromEntries(entries)
}

const passBySurface = (comparison) =>
  Object.fromEntries(Object.entries(comparison).map(([surface, result]) => [surface, result.pass]))

const footerSignature = (capture) => JSON.stringify(capture.layout.footerLinks)

const footerMatchesLive = (captures, liveCaptures) =>
  Object.fromEntries(
    surfaces.map((surface) => [
      surface.id,
      footerSignature(captures[surface.id]) === footerSignature(liveCaptures[surface.id]),
    ]),
  )

const routeIsReachable = (receipt) => [200, 301, 302, 307, 308].includes(receipt.status)

const targetPass = (captures, routes) => ({
  noBrowserErrors: Object.fromEntries(
    surfaces.map((surface) => [
      surface.id,
      captures[surface.id].consoleErrors.length === 0 &&
        captures[surface.id].pageErrors.length === 0 &&
        captures[surface.id].requestFailures.length === 0,
    ]),
  ),
  noHorizontalOverflow: Object.fromEntries(
    surfaces.map((surface) => [surface.id, !captures[surface.id].layout.overflow.horizontal]),
  ),
  routesReachable:
    routes.root.status === 200 &&
    routeIsReachable(routes.zhNoSlash) &&
    routeIsReachable(routes.zhSlash),
  zhMobileIsChinese: captures.zhMobile.layout.bodyTextSample.includes("原生 macOS 截图工具"),
})

const buildComparisons = async (captures) => ({
  localVsLive: await compareTargets({
    actual: captures.local,
    actualId: "local",
    expected: captures.live,
    expectedId: "live",
  }),
  ...(captures.deployed
    ? {
        deployedVsLive: await compareTargets({
          actual: captures.deployed,
          actualId: "deployed",
          expected: captures.live,
          expectedId: "live",
        }),
        deployedVsLocal: await compareTargets({
          actual: captures.deployed,
          actualId: "deployed",
          expected: captures.local,
          expectedId: "local",
        }),
      }
    : {}),
})

const buildPass = ({ captures, comparisons, routes, targets }) => {
  const strictPass = Object.fromEntries(
    Object.entries(comparisons).map(([id, comparison]) => [id, passBySurface(comparison)]),
  )
  const targetPasses = Object.fromEntries(
    targets.map((target) => [target.id, targetPass(captures[target.id], routes[target.id])]),
  )
  const footerPass = {
    local: footerMatchesLive(captures.local, captures.live),
    ...(captures.deployed ? { deployed: footerMatchesLive(captures.deployed, captures.live) } : {}),
  }

  return {
    allStrictSimilarities: Object.values(strictPass).every((bySurface) =>
      Object.values(bySurface).every(Boolean),
    ),
    footerMatchesLive: footerPass,
    ok:
      Object.values(strictPass).every((bySurface) => Object.values(bySurface).every(Boolean)) &&
      Object.values(footerPass).every((bySurface) => Object.values(bySurface).every(Boolean)) &&
      Object.values(targetPasses).every(
        (target) =>
          target.routesReachable &&
          target.zhMobileIsChinese &&
          Object.values(target.noBrowserErrors).every(Boolean) &&
          Object.values(target.noHorizontalOverflow).every(Boolean),
      ),
    strictSimilarity: strictPass,
    targets: targetPasses,
  }
}

const run = async () => {
  await mkdir(screenshotRoot, { recursive: true })

  const targets = [
    { baseUrl: process.env.LIVE_URL ?? "https://minshot.fehey.com", id: "live" },
    { baseUrl: process.env.LOCAL_URL ?? "http://127.0.0.1:4173", id: "local" },
    ...(process.env.DEPLOYED_URL ? [{ baseUrl: process.env.DEPLOYED_URL, id: "deployed" }] : []),
  ]
  const browser = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL ?? "chrome",
    headless: true,
  })

  try {
    const captures = Object.fromEntries(
      await Promise.all(
        targets.map(async (target) => [target.id, await captureTarget(browser, target)]),
      ),
    )
    const routes = Object.fromEntries(
      await Promise.all(targets.map(async (target) => [target.id, await checkRoutes(target)])),
    )
    const comparisons = await buildComparisons(captures)
    const pass = buildPass({ captures, comparisons, routes, targets })
    const result = {
      captures,
      comparisons,
      config: {
        evidencePath: evidenceFile,
        pixelmatchThreshold,
        strictSimilarity,
        targets,
        viewports,
      },
      createdAt: new Date().toISOString(),
      pass,
      routes,
      surfaces,
    }

    await writeFile(evidenceFile, `${JSON.stringify(result, null, 2)}\n`)
    console.log(JSON.stringify(result.pass, null, 2))
  } finally {
    await browser.close()
  }
}

await run()
