# Minshot Static Clone Design

## Objective

Recreate the static Minshot landing page with real HTML and CSS. The page should match the live page's sparse product layout at a 1903x924 viewport while remaining responsive on small screens.

## Tokens

- Page background: `#fcfcfd`
- Primary text: `#1c2024`
- Secondary text: `#60646c`
- Muted border/text: `#d7dbdf`, `#8b8d98`
- Soft panel: `rgba(0, 0, 0, 0.024)`
- Soft control: `rgba(0, 0, 51, 0.06)`
- Primary blue: `#0090ff`
- Primary blue hover: `#0588f0`
- Body font: `Inter`, 15px, 24px line-height
- Heading font: `New Spirit`, Georgia, serif
- H1: 23.55px, 30px line-height, 400 weight, 0 letter spacing
- H2: 17.75px, 24px line-height, 400 weight, 0 letter spacing
- Container: 880px max-width, centered, 20px side padding on small viewports
- Radius: 8px for media/panels, full radius for buttons

## Layout Contract

At 1903x924:

- Content column starts at x 511.5 and is 880px wide.
- Navigation is 96px tall, y 0.
- Logo image is 28x28 at x 511.5, y 50.
- Hero H1 starts at x 511.5, y 144 and is about 355px wide, 30px tall.
- Subtitle starts at y 190, line-height 24px.
- Primary CTA starts at y 234, 40px tall, about 191px wide.
- Hero image starts at y 314, 880px wide, 495px tall, with 16:9 aspect ratio.
- Feature heading starts near y 873.

## Components

- Header: left logo icon plus `Minshot`; right `Pricing` anchor and soft pill `Follow for updates`.
- Hero: serif H1, muted subtitle, blue pill download CTA with inline SVG download icon.
- Hero media: real `<img>` element using local `assets/hero.webp`, 16:9, 8px radius.
- Features: six rows with blue line icons, bold feature names, muted descriptions.
- Pricing: two muted panels for Free and Pro, with check icons and live-page copy.
- Footer: inline links `Download · Contact · 中文`, followed by creator/copyright line.

## Responsive Behavior

- Below 640px, the header wraps gracefully without horizontal overflow.
- The hero image scales to available width and keeps 16:9.
- Pricing panels and feature rows remain readable with natural text wrapping.
