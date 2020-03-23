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
  readonly contentBoxSize: Arrray<ResizeObserverBoxSize> | ResizeObserverBoxSize;
  readonly devicePixelContentBoxSize: Arrray<ResizeObserverBoxSize> | ResizeObserverBoxSize;
}

interface Breakpoints<T> {
  [key: number]: T;
}

interface BreakpointsOptions<W, H> {
  box?: BoxOptions;
  widths?: Breakpoints<W>;
  heights?: Breakpoints<H>;
  fragment?: number;
}

interface ObservedElementProps<T> {
  ref: React.RefObject<T>;
}

interface ObserveRenderArgs<E, W, H> {
  observedElementProps: ObservedElementProps<E>;
  widthMatch: W;
  heightMatch: H;
}

interface ObserveProps<E, W, H> {
  box?: BoxOptions;
  breakpoints?: BreakpointsOptions<W, H>;
  render: ({
    observedElementProps,
    widthMatch,
    heightMatch
  }: ObserveRenderArgs<E, W, H>) => JSX.Element;
}

export const Observe: <E, W, H>(props: ObserveProps<E, W, H>) => JSX.Element;

export const useBreakpoints: <W extends any, H extends any>(options: BreakpointsOptions<W, H>) => [W, H];

export const useResizeObserverEntry: (injectResizeObserverEntry?: ResizeObserverEntry) => ResizeObserverEntry | null;

export const Context: React.Context<ResizeObserverEntry | null>;
