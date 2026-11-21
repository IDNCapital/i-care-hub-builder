import type { ButtonHTMLAttributes, ReactNode } from 'react';
export function Layout({ children }: { children: ReactNode }) { return <>{children}</>; }
export function SeoHead(_props: { title?: string; description?: string; path?: string }) { return null; }
export function CarteCabinetsSection(_props: { background?: string; title?: string; subtitle?: string }) { return null; }
export function Button({ children, asChild, variant: _variant, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; asChild?: boolean; size?: string }) { return asChild ? <span>{children}</span> : <button {...props}>{children}</button>; }
