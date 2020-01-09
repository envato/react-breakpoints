import React from 'react';
import { useResizeObserver } from '@envato/react-resize-observer-hook';
import { Context } from './Context';
import { useBreakpoints } from './useBreakpoints';

const Observe = ({
  render,
  box = undefined,
  breakpoints = undefined
}) => {
  const observeOptions = box ? { box } : {};

  const [ref, observedEntry] = useResizeObserver(observeOptions);

  const renderOptions = {
    observedElementProps: { ref },
    widthMatch: undefined,
    heightMatch: undefined
  };

  if (breakpoints) {
    const [widthMatch, heightMatch] = useBreakpoints(breakpoints, observedEntry);

    renderOptions.widthMatch = widthMatch;
    renderOptions.heightMatch = heightMatch;
  }

  return (
    <Context.Provider value={observedEntry}>
      {render(renderOptions)}
    </Context.Provider>
  );
};

export { Observe };
