import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  "aria-hidden": true,
  focusable: false,
} as const;

export function TelegramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        fill="currentColor"
        d="M21.94 4.3a1.2 1.2 0 0 0-1.62-1.1L2.9 9.97c-1.06.42-1.04 1.93.03 2.32l4.38 1.6 1.7 5.36c.24.77 1.2 1.03 1.8.48l2.45-2.26 4.43 3.27c.7.52 1.7.13 1.88-.72L21.94 4.3Zm-4.07 3.06-7.6 6.88-.3 3.07-1.2-3.82 9.1-6.13Z"
      />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        d="M5 3h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 7.1 7.1l1.4-2.3L21 15.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"
      />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" stroke="currentColor" strokeWidth="2" />
      <path stroke="currentColor" strokeWidth="2" strokeLinejoin="round" d="m3.5 6 8.5 7 8.5-7" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        stroke="currentColor"
        strokeWidth="2"
        d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z"
      />
      <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function ArrowIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path stroke="currentColor" strokeWidth="2.2" d="M5 12h13m-5-6 6 6-6 6" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path stroke="currentColor" strokeWidth="2.4" d="M12 4v16M4 12h16" />
    </svg>
  );
}
