import type { ExtendedResizeObserverEntry } from '@envato/react-resize-observer-hook';
import { useContext } from 'react';
import { Context } from './Context';

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
 * This is allowed to facilitate the abstraction in
 * {@linkcode https://github.com/envato/react-breakpoints/blob/master/docs/api.md#usebreakpoints|useBreakpoints}
 * which is used in the
 * {@linkcode https://github.com/envato/react-breakpoints/blob/master/docs/api.md#observe|Observe}
 * component.
 *
 * @example
 * // MyObservingComponent
 * return (
 *   <Context.Provider value={someResizeObserverEntry}>
 *     <MyConsumingComponent />
 *   </Context.Provider>
 * );
 *
 * // MyConsumingComponent
 * const someResizeObserverEntry = useResizeObserverEntry();
 */
export const useResizeObserverEntry = (
  injectResizeObserverEntry?: ExtendedResizeObserverEntry | null
): ExtendedResizeObserverEntry | null => {
  const resizeObserverEntry = useContext<ExtendedResizeObserverEntry | null>(Context);

  return injectResizeObserverEntry || resizeObserverEntry;
};
