import React from 'react';
import { useResizeObserver } from '@envato/react-resize-observer-hook';
import { Context } from './Context';
import { useBreakpoints } from './useBreakpoints';

const Observe = ({
  render,
  box = undefined,
  breakpoints = {}
}) => {
  const observeOptions = box ? { box } : {};

  const [ref, observedEntry] = useResizeObserver(observeOptions);
  const [widthMatch, heightMatch] = useBreakpoints(breakpoints, observedEntry);

  const renderOptions = {
    observedElementProps: { ref },
    widthMatch,
    heightMatch
  };

  return (
    <Context.Provider value={observedEntry}>
      {render(renderOptions)}
    </Context.Provider>
  );
};

export { Observe };
