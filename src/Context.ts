import { createContext } from 'react';
import { ExtendedResizeObserverEntry } from './ExtendedResizeObserverEntry';

export const Context = createContext<ExtendedResizeObserverEntry | null>(null);
