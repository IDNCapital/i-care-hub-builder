import { afterEach, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { close,exact,calls } from "./baseline.mjs";
close(globalThis,navigator,HTMLAnchorElement.prototype);
Object.defineProperty(globalThis,"ResizeObserver",{configurable:true,value:class {observe(){} unobserve(){} disconnect(){}}});
afterEach(()=>{expect(exact(globalThis,navigator,HTMLAnchorElement.prototype)).toBe(true);expect(calls).toEqual([]);});

Object.defineProperty(globalThis,"IS_REACT_ACT_ENVIRONMENT",{configurable:true,writable:true,value:true});
