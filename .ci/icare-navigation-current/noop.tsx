import type { ReactNode } from 'react';
export default function Noop(){return null;}
export const Footer=Noop, CookieBanner=Noop, SeoHead=Noop, HeroSlideshow=Noop, TestimonialsSlider=Noop, FadeImage=Noop, CarteCabinetsSection=Noop, LinkedInLink=Noop, Toaster=Noop;
export function TooltipProvider({children}:{children:ReactNode}){return <>{children}</>;}
export const AdminGuard=TooltipProvider;

