import React from 'react';

interface ResizeObserverBoxSize {
  readonly inlineSize: number
  readonly blockSize: number
}

interface ResizeObserverEntry {
  readonly target: Element
  readonly contentRect: DOMRectReadOnly
  readonly borderBoxSize: ResizeObserverBoxSize
  readonly contentBoxSize: ResizeObserverBoxSize
  readonly devicePixelContentBoxSize: ResizeObserverBoxSize
}

interface IObservedElementProps<T> {
  ref: React.RefObject<T>
}

interface IObserveRenderProps<T> {
  observedElementProps: IObservedElementProps<T>
}

interface IObserveProps<T> {
  render: (props: IObserveRenderProps<T>) => React.ReactNode
}

interface IProvider {
  ponyfill?: ResizeObserver
}

interface IBreakpoints<T> {
  [key: number]: T
}

interface IOptions<W, H> {
  widths?: IBreakpoints<W>
  heights?: IBreakpoints<H>
  box?: 'border-box' | 'content-box' | 'device-pixel-content-box'
}

export const Context: React.Context<ResizeObserverEntry | null>

export const Observe: <T>(props: IObserveProps<T>) => React.ReactNode

export const Provider: React.Context.Provider<IProvider>

export const useBreakpoints: <W extends any, H extends any>(options: IOptions<W, H>) => [W, H]

export const useResizeObserver: () => ResizeObserver | null

export const useResizeObserverEntry: () => ResizeObserverEntry | null
