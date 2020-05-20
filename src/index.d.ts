import React from 'react';

type BoxOptions = 'border-box' | 'content-box' | 'device-pixel-content-box';

interface ResizeObserverBoxSize {
  readonly inlineSize: number;
  readonly blockSize: number;
}

interface ResizeObserverEntry {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly;
  readonly borderBoxSize: Array<ResizeObserverBoxSize> | ResizeObserverBoxSize;
  readonly contentBoxSize: Array<ResizeObserverBoxSize> | ResizeObserverBoxSize;
  readonly devicePixelContentBoxSize: Array<ResizeObserverBoxSize> | ResizeObserverBoxSize;
}

interface Breakpoints {
  [key: number]: any;
}

interface BreakpointsOptions {
  box?: BoxOptions;
  widths?: Breakpoints;
  heights?: Breakpoints;
  fragment?: number;
}

interface ObservedElementProps {
  ref: () => React.RefObject<HTMLElement>;
}

interface ObserveRenderArgs {
  observedElementProps: ObservedElementProps;
  widthMatch: any;
  heightMatch: any;
}

interface ObserveProps {
  box?: BoxOptions;
  breakpoints?: BreakpointsOptions;
  render: ({
    observedElementProps,
    widthMatch,
    heightMatch
  }: ObserveRenderArgs) => React.ReactNode;
}

export const Observe: (props: ObserveProps) => React.ReactNode;

export const useBreakpoints: (options: BreakpointsOptions, injectResizeObserverEntry?: ResizeObserverEntry) => [any, any];

export const useResizeObserverEntry: (injectResizeObserverEntry?: ResizeObserverEntry) => ResizeObserverEntry | null;

export const Context: React.Context<ResizeObserverEntry | null>;
