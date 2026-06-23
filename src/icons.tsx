import type { FeatureIconName } from "./content"

const pathProps = {
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const

const miterPathProps = {
  ...pathProps,
  strokeMiterlimit: "1.5",
} as const

const assertNever = (value: never): never => {
  throw new Error(`Unhandled icon: ${value}`)
}

export function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="16"
    >
      <path d="M6 20L18 20" {...pathProps} />
      <path d="M12 4V16M12 16L15.5 12.5M12 16L8.5 12.5" {...pathProps} />
    </svg>
  )
}

export function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="check-icon"
      fill="none"
      height="16"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="16"
    >
      <path d="M5 13L9 17L19 7" {...pathProps} />
    </svg>
  )
}

export function FeatureIcon({ name }: { readonly name: FeatureIconName }) {
  switch (name) {
    case "capture":
      return (
        <svg
          aria-hidden="true"
          fill="none"
          height="20"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="20"
        >
          <path d="M21 18H6V3" {...pathProps} />
          <path d="M3 6H18V21" {...pathProps} />
        </svg>
      )
    case "annotate":
      return (
        <svg
          aria-hidden="true"
          fill="none"
          height="20"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="20"
        >
          <path
            d="M14.3632 5.65156L15.8431 4.17157C16.6242 3.39052 17.8905 3.39052 18.6716 4.17157L20.0858 5.58579C20.8668 6.36683 20.8668 7.63316 20.0858 8.41421L18.6058 9.8942M14.3632 5.65156L4.74749 15.2672C4.41542 15.5993 4.21079 16.0376 4.16947 16.5054L3.92738 19.2459C3.87261 19.8659 4.39148 20.3848 5.0115 20.33L7.75191 20.0879C8.21972 20.0466 8.65806 19.8419 8.99013 19.5099L18.6058 9.8942M14.3632 5.65156L18.6058 9.8942"
            {...pathProps}
          />
        </svg>
      )
    case "arrow":
      return (
        <svg
          aria-hidden="true"
          fill="none"
          height="20"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="20"
        >
          <path d="M6.00005 19L19 5.99996M19 5.99996V18.48M19 5.99996H6.52005" {...pathProps} />
        </svg>
      )
    case "backdrop":
      return (
        <svg
          aria-hidden="true"
          fill="none"
          height="20"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="20"
        >
          <path d="M4.9984 2.00098H2V4.99938H4.9984V2.00098Z" {...miterPathProps} />
          <path d="M4.9984 10.502H2V13.5004H4.9984V10.502Z" {...miterPathProps} />
          <path d="M20.4978 5.00049V10.503" {...miterPathProps} />
          <path d="M3.5 5.00049V10.503" {...miterPathProps} />
          <path d="M20.4978 13.5015V19.004" {...miterPathProps} />
          <path d="M3.5 13.5015V19.004" {...miterPathProps} />
          <path d="M4.99902 20.5015H10.4999" {...miterPathProps} />
          <path d="M4.99902 3.50342H10.4999" {...miterPathProps} />
          <path d="M13.498 20.499H18.9989" {...miterPathProps} />
          <path d="M13.498 3.50098H18.9989" {...miterPathProps} />
          <path d="M4.9984 19.001H2V21.9994H4.9984V19.001Z" {...miterPathProps} />
          <path d="M21.9974 2.00195H18.999V5.00035H21.9974V2.00195Z" {...miterPathProps} />
          <path d="M13.4974 2H10.499V4.9984H13.4974V2Z" {...miterPathProps} />
          <path d="M21.9974 10.5029H18.999V13.5013H21.9974V10.5029Z" {...miterPathProps} />
          <path d="M21.9974 19.002H18.999V22.0004H21.9974V19.002Z" {...miterPathProps} />
          <path d="M13.4974 19H10.499V21.9984H13.4974V19Z" {...miterPathProps} />
        </svg>
      )
    case "multiCapture":
      return (
        <svg
          aria-hidden="true"
          fill="none"
          height="20"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="20"
        >
          <path
            d="M7 19V11C7 9.89543 7.89543 9 9 9H20C21.1046 9 22 9.89543 22 11V19C22 20.1046 21.1046 21 20 21H9C7.89543 21 7 20.1046 7 19Z"
            stroke="currentColor"
          />
          <path
            d="M6.5 16H4C2.89543 16 2 15.1046 2 14V6C2 4.89543 2.89543 4 4 4H15C16.1046 4 17 4.89543 17 6V9"
            stroke="currentColor"
          />
          <path d="M10 12H11M5 7H6" {...pathProps} />
        </svg>
      )
    case "recent":
      return (
        <svg
          aria-hidden="true"
          fill="none"
          height="20"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="20"
        >
          <path d="M12 6L12 12L18 12" {...pathProps} />
          <path
            d="M21.8883 10.5C21.1645 5.68874 17.013 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C16.1006 22 19.6248 19.5318 21.1679 16"
            {...pathProps}
          />
          <path d="M17 16H21.4C21.7314 16 22 16.2686 22 16.6V21" {...pathProps} />
        </svg>
      )
    default:
      return assertNever(name)
  }
}
