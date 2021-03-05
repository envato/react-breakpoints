import { ReactNode } from 'react';
import { ObservedElement, useResizeObserver } from '@envato/react-resize-observer-hook';
import { Context } from './Context';
import { UseBreakpointsOptions, useBreakpoints } from './useBreakpoints';

interface ObservedElementProps {
  ref: React.RefCallback<ObservedElement | null>;
}

interface RenderOptions {
  observedElementProps: ObservedElementProps;
  widthMatch: any;
  heightMatch: any;
}

interface BaseObserveProps {
  box?: ResizeObserverBoxOptions;
  breakpoints?: UseBreakpointsOptions;
}

interface ObserveViaRenderProp extends BaseObserveProps {
  children?: never;
  render: (args: RenderOptions) => ReactNode;
}

interface ObserveViaChildrenProp extends BaseObserveProps {
  children: (args: RenderOptions) => ReactNode;
  render?: never;
}

/* Allow use of `render` or `children` props, but not both. */
type ObserveProps = ObserveViaRenderProp | ObserveViaChildrenProp;

export const Observe = ({ box = undefined, breakpoints, children, render }: ObserveProps): JSX.Element => {
  const observeOptions = box ? { box } : {};

  const [ref, observedEntry] = useResizeObserver(observeOptions);
  const { widthMatch, heightMatch } = useBreakpoints(breakpoints, observedEntry);

  const renderOptions: RenderOptions = {
    observedElementProps: { ref },
    widthMatch,
    heightMatch
  };

  return (
    <Context.Provider value={observedEntry}>
      {children ? children(renderOptions) : render ? render(renderOptions) : null}
    </Context.Provider>
  );
};
