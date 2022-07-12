import type { Breakpoints } from './Breakpoints';

/**
 * From a `breakpoints` object, find the first key that is equal to or greater than
 * `observedSize` and return the corresponding value.
 *
 * @example
 * const widths = {
 *   0: 'mobile',
 *   769: 'laptop',
 *   1025: 'desktop',
 *   1441: 'widescreen'
 * };
 *
 * const matchedValue = findBreakpoint(widths, 1280);
 * // matchedValue => 'desktop'
 *
 */
export const findBreakpoint = (breakpoints: Breakpoints, observedSize?: number): any => {
  if (typeof observedSize === 'undefined') return undefined;

  let breakpoint: number | undefined;
  const sizes = Object.keys(breakpoints).map(key => Number(key));

  for (const next of sizes) {
    if (observedSize < next) break;
    breakpoint = next;
  }

  return typeof breakpoint === 'undefined' ? undefined : breakpoints[breakpoint];
};
