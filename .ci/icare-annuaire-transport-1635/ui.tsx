import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';
export function Layout({ children }: { children: ReactNode }) { return <>{children}</>; }
export function SeoHead(_props: { title?: string; description?: string; path?: string; noIndex?: boolean }) { return null; }
export function CarteCabinetsSection(_props: { background?: string; title?: string; subtitle?: string }) { return null; }
export function Button({ children, asChild, variant: _variant, size: _size, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean; variant?: string; size?: string }) { return asChild ? <span>{children}</span> : <button {...props}>{children}</button>; }
export function Input(props: InputHTMLAttributes<HTMLInputElement>) { return <input {...props} />; }
export function Sheet({ children }: { children: ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }) { return <>{children}</>; }
export function SheetTrigger({ children }: { children: ReactNode; asChild?: boolean }) { return <>{children}</>; }
export function SheetContent(_props: { children: ReactNode; side?: string; className?: string }) { return null; }
