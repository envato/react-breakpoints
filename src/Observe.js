import React from 'react';
import { useResizeObserver } from '@envato/react-resize-observer-hook';
import { Context } from './Context';

const Observe = ({ render }) => {
  const [ref, observedEntry] = useResizeObserver();

  return (
    <Context.Provider value={observedEntry}>
      {render({ observedElementProps: { ref } })}
    </Context.Provider>
  );
};

export default Observe;
