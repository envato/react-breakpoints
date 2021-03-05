import { createContext } from 'react';
import { ExtendedResizeObserverEntry } from '@envato/react-resize-observer-hook';

export const Context = createContext<ExtendedResizeObserverEntry | null>(null);
