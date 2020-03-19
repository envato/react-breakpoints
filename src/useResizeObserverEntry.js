import { useContext } from 'react';
import { Context } from './Context';

/**
 * Returns the ResizeObserverEntry from nearest Context.
 * @argument {ResizeObserverEntry} [injectResizeObserverEntry] - Explicitly set the ResizeObserverEntry to use instead of fetching it from Context.
 * @returns {(ResizeObserverEntry|null)}
 */
const useResizeObserverEntry = injectResizeObserverEntry => {
  const resizeObserverEntry = useContext(Context);

  return injectResizeObserverEntry || resizeObserverEntry;
};

export { useResizeObserverEntry };
