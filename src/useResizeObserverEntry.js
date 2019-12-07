import { useContext } from 'react';
import { Context } from './Context';

/**
 * Returns the ResizeObserverEntry from nearest Context.
 * @returns {(ResizeObserverEntry|null)}
 */
const useResizeObserverEntry = () => {
  const resizeObserverEntry = useContext(Context);

  return resizeObserverEntry;
};

export { useResizeObserverEntry };
