import React from 'react';
import { useResizeObserver } from '@envato/react-resize-observer-hook';
import { Context } from './Context';

const Observe = ({ render, box = undefined }) => {
  const options = box ? { box } : {};

  const [ref, observedEntry] = useResizeObserver(options);

  return (
    <Context.Provider value={observedEntry}>
      {render({ observedElementProps: { ref } })}
    </Context.Provider>
  );
};

export { Observe };
