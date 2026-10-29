declare global {
  interface Window {
    __cookieProof: {
      value: string | null; readRefused: boolean; writeRefused: boolean;
      loads: number; removes: number; pages: unknown[][]; scrolls: unknown[][];
    };
  }
}
export function loadGTM() { window.__cookieProof.loads++; }
export function removeGTM() { window.__cookieProof.removes++; }
export const Analytics = {
  pageView: (...args: unknown[]) => window.__cookieProof.pages.push(args),
  scrollDepth: (...args: unknown[]) => window.__cookieProof.scrolls.push(args),
};
