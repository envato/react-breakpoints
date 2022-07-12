import type { ExtendedResizeObserverEntry } from '@envato/react-resize-observer-hook';
import { createContext } from 'react';

export const Context = createContext<ExtendedResizeObserverEntry | null>(null);
