import { useContext } from 'react';
import { Context } from './Context';
import { ExtendedResizeObserverEntry } from './ExtendedResizeObserverEntry';

/**
 * See API Docs: {@linkcode https://github.com/envato/react-breakpoints/blob/master/docs/api.md#useresizeobserverentry|useResizeObserverEntry}
 *
 * Returns the `ResizeObserverEntry` from the nearest Context.
 *
 * You can also pass in a `ResizeObserverEntry`, which will be returned verbatim.
 * You will almost certainly never need to do this, but because you may not
 * conditionally call hooks, it can be useful to pass in the `ResizeObserverEntry`
 * you receive from
 * {@linkcode https://github.com/envato/react-breakpoints/blob/master/docs/api.md#useresizeobserver|useResizeObserver}
 * in the same component instead of relying on the value from the nearest Context.
 *
 * This is how
 * {@linkcode https://github.com/envato/react-breakpoints/blob/master/docs/api.md#observe|Observe}
 * component combines the
 * {@linkcode https://github.com/envato/react-breakpoints/blob/master/docs/api.md#useresizeobserver|useResizeObserver}
 * hook and the
 * {@linkcode https://github.com/envato/react-breakpoints/blob/master/docs/api.md#useresizeobserverentry|useResizeObserverEntry}
 * hook.
 */
export const useResizeObserverEntry = (
  injectResizeObserverEntry?: ExtendedResizeObserverEntry
): ExtendedResizeObserverEntry | null => {
  const resizeObserverEntry = useContext<ExtendedResizeObserverEntry | null>(Context);

  return injectResizeObserverEntry || resizeObserverEntry;
};
