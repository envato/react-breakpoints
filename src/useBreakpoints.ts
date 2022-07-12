import type { ExtendedResizeObserverEntry } from '@envato/react-resize-observer-hook';
import type { Breakpoints } from './Breakpoints';
import { useRef, useState, useEffect, useMemo } from 'react';
import { useResizeObserverEntry } from './useResizeObserverEntry';
import { findBreakpoint } from './findBreakpoint';

interface BaseOptions {
  box?: ResizeObserverBoxOptions;
  fragment?: number;
}

interface HeightsOptions extends BaseOptions {
  widths?: Breakpoints;
  heights: Breakpoints;
}

interface WidthsOptions extends BaseOptions {
  widths: Breakpoints;
  heights?: Breakpoints;
}

export type UseBreakpointsOptions = HeightsOptions | WidthsOptions;

type Matches = { widthMatch: any; heightMatch: any };

export type UseBreakpointsResult = [any, any] & Matches;

const boxOptions = {
  BORDER_BOX: 'border-box', // https://caniuse.com/mdn-api_resizeobserverentry_borderboxsize
  CONTENT_BOX: 'content-box', // https://caniuse.com/mdn-api_resizeobserverentry_contentboxsize
  DEVICE_PIXEL_CONTENT_BOX: 'device-pixel-content-box' // https://caniuse.com/mdn-api_resizeobserverentry_devicepixelcontentboxsize
};

/**
 * See API Docs: {@linkcode https://github.com/envato/react-breakpoints/blob/main/docs/api.md#usebreakpoints useBreakpoints}
 *
 * Pass in an options object with at least one of the following properties:
 * - `widths`: objects with width breakpoints as keys and anything as their values;
 * - `heights`: objects with height breakpoints as keys and anything as their values.
 *
 * You may also pass the following additional optional properties:
 * - `box`: the box to measure on the observed element, one of `'border-box' | 'content-box' | 'device-pixel-content-box'`;
 * - `fragment`: index of {@link https://github.com/w3c/csswg-drafts/pull/4529 fragment} of the observed element to measure (default `0`).
 *
 * Optionally pass in a `ResizeObserverEntry` as the second argument to override fetching one from context.
 *
 * @example
 * const options = {
 *   widths: {
 *     0: 'mobile',
 *     769: 'tablet',
 *     1025: 'desktop'
 *   }
 * };
 *
 * const { widthMatch: label } = useBreakpoints(options);
 *
 * return (
 *   <div className={label}>
 *     This element is currently within the {label} range.
 *   </div>
 * );
 */
export const useBreakpoints = (
  {
    widths = {},
    heights = {},
    box = undefined,
    fragment = 0 // https://github.com/w3c/csswg-drafts/pull/4529
  }: UseBreakpointsOptions = { widths: {}, heights: {} },
  injectResizeObserverEntry?: ExtendedResizeObserverEntry | null
) => {
  const isMounted = useRef<Boolean>(true);
  const matches = useRef<Matches>({ widthMatch: undefined, heightMatch: undefined });
  const [changedMatches, changeMatches] = useState<Matches>({ widthMatch: undefined, heightMatch: undefined });

  /* Prevent further observation state changes if component is no longer mounted. */
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const result = useMemo(() => {
    /* Support both array and object destructuring. */
    const result = [changedMatches.widthMatch, changedMatches.heightMatch] as UseBreakpointsResult;
    result.widthMatch = changedMatches.widthMatch;
    result.heightMatch = changedMatches.heightMatch;

    return result;
  }, [changedMatches.widthMatch, changedMatches.heightMatch]);

  const resizeObserverEntry = useResizeObserverEntry(injectResizeObserverEntry);

  if (!resizeObserverEntry) return result;

  let observedBoxSize: ResizeObserverSize;

  switch (box) {
    case boxOptions.BORDER_BOX:
      observedBoxSize = resizeObserverEntry.borderBoxSize[fragment];
      break;

    case boxOptions.CONTENT_BOX:
      observedBoxSize = resizeObserverEntry.contentBoxSize[fragment];
      break;

    case boxOptions.DEVICE_PIXEL_CONTENT_BOX:
      observedBoxSize = resizeObserverEntry.devicePixelContentBoxSize[fragment];
      break;

    default:
      observedBoxSize = {
        inlineSize: resizeObserverEntry.contentRect.width,
        blockSize: resizeObserverEntry.contentRect.height
      };
  }

  const widthMatch = findBreakpoint(widths, observedBoxSize.inlineSize);
  const heightMatch = findBreakpoint(heights, observedBoxSize.blockSize);

  if (widthMatch !== matches.current.widthMatch || heightMatch !== matches.current.heightMatch) {
    matches.current = { widthMatch, heightMatch };

    if (isMounted.current) {
      changeMatches({ widthMatch, heightMatch });
    }
  }

  return result;
};
