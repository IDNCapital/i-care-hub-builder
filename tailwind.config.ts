import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Lato", "system-ui", "sans-serif"],
        heading: ["Playfair Display", "Georgia", "serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        sage: "hsl(var(--sage))",
        cream: "hsl(var(--cream))",
        anthracite: "hsl(var(--anthracite))",
        gold: "hsl(var(--gold))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      keyframes: {
        // Repli par la ligne de grille : indépendant de la hauteur mesurée par
        // Radix, qui vaut zéro dès que l'état fermé est réellement replié.
        // Consommé par src/components/ui/accordion.tsx, seul usage.
        "accordion-down": {
          from: { gridTemplateRows: "0fr" },
          to: { gridTemplateRows: "1fr" },
        },
        "accordion-up": {
          from: { gridTemplateRows: "1fr" },
          to: { gridTemplateRows: "0fr" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.8s ease-out forwards",
        "fade-in": "fade-in 0.7s ease-out forwards",
      },
      boxShadow: {
        soft: "0 2px 12px -2px hsl(0 0% 17% / 0.05)",
        card: "0 4px 20px -4px hsl(0 0% 17% / 0.07)",
        elevated: "0 8px 30px -8px hsl(0 0% 17% / 0.1)",
      },
      typography: () => ({
        icare: {
          css: {
            "--tw-prose-body": "#2B2B2B",
            "--tw-prose-headings": "#2B2B2B",
            "--tw-prose-links": "#9EB8A5",
            "--tw-prose-bold": "#2B2B2B",
            "--tw-prose-counters": "#2B2B2B",
            "--tw-prose-bullets": "#2B2B2B",
            color: "#2B2B2B",
            fontFamily: '"Lato", system-ui, sans-serif',
            lineHeight: "1.7",
            "h1, h2, h3, h4": {
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: "400",
              color: "#2B2B2B",
            },
            "p + p": { marginTop: "1.25em" },
            a: {
              color: "#9EB8A5",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              "&:hover": { color: "#D9C7A1" },
            },
            "ul > li::marker": { color: "#2B2B2B" },
            "ol > li::marker": { color: "#2B2B2B" },
            code: {
              fontWeight: "400",
              backgroundColor: "#F6F5F0",
              padding: "0.1em 0.35em",
              borderRadius: "3px",
            },
            "code::before": { content: '""' },
            "code::after": { content: '""' },
          },
        },
      }),
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
