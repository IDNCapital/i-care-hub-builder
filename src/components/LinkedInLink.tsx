import { cn } from "@/lib/utils";

interface LinkedInLinkProps {
  /** Show the "LinkedIn" textual label next to the icon */
  showLabel?: boolean;
  /** Override label color (defaults to anthracite). Use "light" on dark backgrounds. */
  labelTone?: "anthracite" | "light";
  className?: string;
}

/**
 * LinkedIn company link with strict I-CA.RE chromatic rules:
 * - Icon default: ecosystem green #90A997
 * - Icon hover:   anthracite #2C2C2C (200ms ease-out)
 * - Optional label: Playfair Display 400, 0.9rem, anthracite (unchanged on hover)
 * - 40x40 min hit area, focus-visible outline #90A997 2px
 */
export function LinkedInLink({
  showLabel = false,
  labelTone = "anthracite",
  className,
}: LinkedInLinkProps) {
  return (
    <a
      href="https://www.linkedin.com/company/i-ca-re/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Page LinkedIn de I-CA.RE"
      className={cn(
        "group inline-flex items-center gap-2 min-w-[40px] min-h-[40px] justify-center",
        "rounded-sm focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        className,
      )}
      style={{ outlineColor: "#90A997" }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        className="transition-colors duration-200 ease-out"
        style={{ color: "#90A997" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#2C2C2C")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#90A997")}
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
      {showLabel && (
        <span
          className="font-heading font-normal"
          style={{
            fontSize: "0.9rem",
            color: labelTone === "light" ? "#F5F5F2" : "#2C2C2C",
          }}
        >
          LinkedIn
        </span>
      )}
    </a>
  );
}