import { ObservedElement } from './ObservedElement';

export interface ExtendedResizeObserverEntry extends ResizeObserverEntry {
  target: ObservedElement;
}
