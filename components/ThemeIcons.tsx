const svgProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

export function ThemeIcon({ id }: { id: string }) {
  switch (id) {
    case "crypto":
      return (
        <svg {...svgProps}>
          <path d="M12 3.4 19.3 7.6v8.8L12 20.6 4.7 16.4V7.6L12 3.4z" />
        </svg>
      );
    case "applied-ai":
      return (
        <svg {...svgProps}>
          <path d="M12 3.2 13.7 10.3 20.8 12 13.7 13.7 12 20.8 10.3 13.7 3.2 12 10.3 10.3 12 3.2z" />
        </svg>
      );
    case "physical-ai":
      return (
        <svg {...svgProps}>
          <rect x="5" y="5.5" width="14" height="13.5" rx="3" />
          <circle cx="9.4" cy="11.2" r="1.05" />
          <circle cx="14.6" cy="11.2" r="1.05" />
          <path d="M9.2 16h5.6" />
        </svg>
      );
    case "energy":
      return (
        <svg {...svgProps}>
          <path d="M13.2 3.2 6.4 13.4h5.3L10.4 20.8l7.4-10.8h-5.2L13.2 3.2z" />
        </svg>
      );
    case "materials":
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="1.55" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" />
          <ellipse
            cx="12"
            cy="12"
            rx="9"
            ry="3.5"
            transform="rotate(60 12 12)"
          />
        </svg>
      );
    case "hospitality":
      return (
        <svg {...svgProps}>
          <path d="M8 3.4h8l-1.15 7.1a3.9 3.9 0 1 1-5.7 0L8 3.4z" />
          <path d="M12 14.4V20M8.4 20.6h7.2" />
        </svg>
      );
    case "analog":
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="4.6" />
          <circle cx="12" cy="12" r="1.35" />
          <path d="M16.6 5.1a8.2 8.2 0 0 1 3.3 8.4" />
          <path d="M18.6 13.2 20 14.8 21.7 13.1" />
          <path d="M7.4 18.9A8.2 8.2 0 0 1 4.1 10.5" />
          <path d="M5.4 10.8 4 9.2 2.3 10.9" />
        </svg>
      );
    case "delightful":
      return (
        <svg {...svgProps}>
          <path d="M12 18.6S5.6 14.4 5.6 10.2A3.5 3.5 0 0 1 12 8.4a3.5 3.5 0 0 1 6.4 1.8c0 4.2-6.4 8.4-6.4 8.4z" />
          <path d="M18.6 3.6 19.2 5.1 20.8 5.7 19.2 6.3 18.6 7.8 18 6.3 16.4 5.7 18 5.1 18.6 3.6z" />
        </svg>
      );
    default:
      return null;
  }
}
