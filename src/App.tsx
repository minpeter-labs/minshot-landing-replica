import { useEffect } from "react"
import type { Language, PageContent, PricingPlan } from "./content"
import { getPageContent } from "./content"
import { CheckIcon, DownloadIcon, FeatureIcon } from "./icons"

const detectLanguage = (): Language => {
  const path = window.location.pathname.replace(/\/+$/, "")
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
      <a className="brand" href="/" aria-label={page.header.homeLabel}>
        <img className="brand-icon" src="/assets/icon.png" width="28" height="28" alt="Minshot" />
        <span>Minshot</span>
      </a>
      <nav className="nav-links" aria-label={page.header.navigationLabel}>
        <a className="text-link high-contrast" href="#pricing">
          {page.header.pricing}
        </a>
        <a
          className="soft-button"
          href="https://x.com/ZaynHao"
          target="_blank"
          rel="noopener noreferrer"
        >
          {page.header.follow}
        </a>
      </nav>
    </header>
  )
}

function Hero({ page }: { readonly page: PageContent }) {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title">{page.hero.title}</h1>
        <p>{page.hero.subtitle}</p>
        <DownloadButton label={page.downloadLabel} />
      </div>
      <div className="hero-media">
        <picture>
          <source media="(min-width: 921px)" srcSet="/assets/hero-880.png" />
          <img
            src="/assets/hero.webp"
            width="1920"
            height="1080"
            alt={page.hero.imageAlt}
            data-nimg="1"
            decoding="async"
            style={{
              boxShadow: "var(--hero-shadow)",
              color: "transparent",
              display: "block",
              height: "auto",
              width: "100%",
            }}
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
    <section className="feature-section" aria-labelledby="features-title">
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
    <section id="pricing" className="pricing-section" aria-labelledby="pricing-title" tabIndex={-1}>
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
          className="text-link"
          href={page.footer.language.href}
          hrefLang={page.footer.language.hreflang}
          aria-label={page.footer.language.label}
        >
          <span lang={page.footer.language.lang}>{page.footer.language.text}</span>
        </a>
      </div>
      <p>
        {page.footer.madeByPrefix}
        <a
          className="text-link accent-link"
          href="https://x.com/ZaynHao"
          target="_blank"
          rel="noopener noreferrer"
        >
          Zayn Hao
        </a>
        {page.footer.madeBySuffix}
      </p>
    </footer>
  )
}
