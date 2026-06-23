import { useEffect } from "react"
import type { Language, PageContent, PricingPlan } from "./content"
import { getPageContent } from "./content"
import { CheckIcon, DownloadIcon, FeatureIcon } from "./icons"

const trailingSlashRegex = /\/+$/

const detectLanguage = (): Language => {
  const path = window.location.pathname.replace(trailingSlashRegex, "")
  return path === "/zh" ? "zh" : "en"
}

const updateMetadata = (page: PageContent): void => {
  document.documentElement.lang = page.meta.lang
  document.title = page.meta.title

  document
    .querySelector<HTMLMetaElement>('meta[name="description"]')
    ?.setAttribute("content", page.meta.description)
  document
    .querySelector<HTMLLinkElement>('link[rel="canonical"]')
    ?.setAttribute("href", page.meta.canonical)
  document
    .querySelector<HTMLMetaElement>('meta[property="og:title"]')
    ?.setAttribute("content", page.meta.title)
  document
    .querySelector<HTMLMetaElement>('meta[property="og:description"]')
    ?.setAttribute("content", page.meta.description)
}

export function App() {
  const page = getPageContent(detectLanguage())

  useEffect(() => {
    updateMetadata(page)
  }, [page])

  return (
    <div className="page-shell">
      <Header page={page} />
      <div className="content-stack">
        <main className="main-stack">
          <Hero page={page} />
          <Features page={page} />
          <Pricing page={page} />
        </main>
        <Footer page={page} />
      </div>
    </div>
  )
}

function Header({ page }: { readonly page: PageContent }) {
  return (
    <header className="site-header">
      <a aria-label={page.header.homeLabel} className="brand" href="/">
        <img alt="Minshot" className="brand-icon" height="28" src="/assets/icon.png" width="28" />
        <span>Minshot</span>
      </a>
      <nav aria-label={page.header.navigationLabel} className="nav-links">
        <a className="high-contrast text-link" href="#pricing">
          {page.header.pricing}
        </a>
        <a
          className="soft-button"
          href="https://x.com/ZaynHao"
          rel="noopener noreferrer"
          target="_blank"
        >
          {page.header.follow}
        </a>
      </nav>
    </header>
  )
}

function Hero({ page }: { readonly page: PageContent }) {
  return (
    <section aria-labelledby="hero-title" className="hero-section">
      <div className="hero-copy">
        <h1 id="hero-title">{page.hero.title}</h1>
        <p>{page.hero.subtitle}</p>
        <DownloadButton label={page.downloadLabel} />
      </div>
      <div className="hero-media">
        <picture>
          <source media="(min-width: 921px)" srcSet="/assets/hero-880.png" />
          <img
            alt={page.hero.imageAlt}
            data-nimg="1"
            decoding="async"
            height="1080"
            src="/assets/hero.webp"
            style={{
              boxShadow: "var(--hero-shadow)",
              color: "transparent",
              display: "block",
              height: "auto",
              width: "100%",
            }}
            width="1920"
          />
        </picture>
      </div>
    </section>
  )
}

function DownloadButton({ label }: { readonly label: string }) {
  return (
    <a className="primary-button" href="https://dl.minshot.fehey.com/Minshot-0.4.0.dmg">
      <DownloadIcon />
      <span>{label}</span>
    </a>
  )
}

function Features({ page }: { readonly page: PageContent }) {
  return (
    <section aria-labelledby="features-title" className="feature-section">
      <h2 id="features-title">{page.featuresTitle}</h2>
      <div className="feature-list">
        {page.features.map((feature) => (
          <article className="feature-row" key={feature.name}>
            <FeatureIcon name={feature.icon} />
            <p>
              <strong>{feature.name}</strong>
              <span>{feature.description}</span>
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Pricing({ page }: { readonly page: PageContent }) {
  return (
    <section aria-labelledby="pricing-title" className="pricing-section" id="pricing" tabIndex={-1}>
      <h2 id="pricing-title">{page.pricing.title}</h2>
      <p className="section-copy">{page.pricing.copy}</p>
      <div className="pricing-stack">
        {page.pricing.plans.map((plan) => (
          <PricingCard key={plan.name} page={page} plan={plan} />
        ))}
      </div>
    </section>
  )
}

function PricingCard({ page, plan }: { readonly page: PageContent; readonly plan: PricingPlan }) {
  return (
    <article className="pricing-card">
      <div className="price-title">
        <strong>{plan.name}</strong>
        <span>{plan.price}</span>
      </div>
      <p>{plan.copy}</p>
      <ul>
        {plan.features.map((feature) => (
          <li key={feature}>
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {plan.action.kind === "download" ? (
        <DownloadButton label={page.downloadLabel} />
      ) : (
        <a className="soft-button license-button" href={plan.action.href}>
          {plan.action.label}
        </a>
      )}
    </article>
  )
}

function Footer({ page }: { readonly page: PageContent }) {
  return (
    <footer className="site-footer">
      <div className="footer-links">
        <a className="text-link" href="https://dl.minshot.fehey.com/Minshot-0.4.0.dmg">
          {page.footer.download}
        </a>
        <span aria-hidden="true">·</span>
        <a className="text-link" href="mailto:eryouhao@gmail.com">
          {page.footer.contact}
        </a>
        <span aria-hidden="true">·</span>
        <a
          aria-label={page.footer.language.label}
          className="text-link"
          href={page.footer.language.href}
          hrefLang={page.footer.language.hreflang}
        >
          <span lang={page.footer.language.lang}>{page.footer.language.text}</span>
        </a>
      </div>
      <p>
        {page.footer.madeByPrefix}
        <a
          className="text-link accent-link"
          href="https://x.com/ZaynHao"
          rel="noopener noreferrer"
          target="_blank"
        >
          Zayn Hao
        </a>
        {page.footer.madeBySuffix}
      </p>
    </footer>
  )
}
