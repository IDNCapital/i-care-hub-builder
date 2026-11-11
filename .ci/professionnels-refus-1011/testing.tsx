import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { fireEvent as events } from '@testing-library/dom';
export { screen, waitFor } from '@testing-library/dom';

let current: { root: Root; element: HTMLDivElement } | undefined;
export function render(node: ReactNode) {
  if (current) throw new Error('Previous root still mounted');
  const element = document.createElement('div');
  document.body.append(element);
  const root = createRoot(element);
  current = { root, element };
  act(() => root.render(node));
  return { container: element };
}
export function cleanup() {
  if (!current) return;
  act(() => current?.root.unmount());
  current.element.remove();
  current = undefined;
}
function event(name: 'click' | 'change' | 'submit' | 'keyDown', element: Element, options?: Record<string, unknown>) {
  let result = false;
  act(() => { result = events[name](element, options); });
  return result;
}
export const fireEvent = {
  click: (element: Element, options?: Record<string, unknown>) => event('click', element, options),
  change: (element: Element, options?: Record<string, unknown>) => event('change', element, options),
  submit: (element: Element, options?: Record<string, unknown>) => event('submit', element, options),
  keyDown: (element: Element, options?: Record<string, unknown>) => event('keyDown', element, options),
};
