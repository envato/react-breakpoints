import { useState, useEffect } from 'react';
import { ExtendedResizeObserverEntry } from '@envato/react-resize-observer-hook';
import { Breakpoints } from './Breakpoints';
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

export type UseBreakpointsResult = [any, any] & { widthMatch: any; heightMatch: any };

const boxOptions = {
  BORDER_BOX: 'border-box', // https://caniuse.com/mdn-api_resizeobserverentry_borderboxsize
  CONTENT_BOX: 'content-box', // https://caniuse.com/mdn-api_resizeobserverentry_contentboxsize
  DEVICE_PIXEL_CONTENT_BOX: 'device-pixel-content-box' // https://github.com/w3c/csswg-drafts/pull/4476
};

/**
 * See API Docs: {@linkcode https://github.com/envato/react-breakpoints/blob/master/docs/api.md#usebreakpoints|useBreakpoints}
 *
 * Pass in an options object with at least one of the following properties:
 * - `widths`: objects with width breakpoints as keys and anything as their values;
 * - `heights`: objects with height breakpoints as keys and anything as their values.
 *
 * You may also pass the following additional optional properties:
 * - `box`: the box to measure on the observed element, one of `'border-box' | 'content-box' | 'device-pixel-content-box'`;
 * - `fragment`: index of {@link https://github.com/w3c/csswg-drafts/pull/4529|fragment} of the observed element to measure (default `0`).
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

 * const { widthMatch: label } = useBreakpoints(options);

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
  }: UseBreakpointsOptions,
  injectResizeObserverEntry?: ExtendedResizeObserverEntry | null
): UseBreakpointsResult => {
  const resizeObserverEntry = useResizeObserverEntry(injectResizeObserverEntry);

  const [widthMatch, setWidthMatch] = useState<number | undefined>(undefined);
  const [heightMatch, setHeightMatch] = useState<number | undefined>(undefined);

  let boxSize: ResizeObserverSize,
    inlineSize: number = 0,
    blockSize: number = 0;

  if (resizeObserverEntry) {
    switch (box) {
      case boxOptions.BORDER_BOX:
        boxSize = resizeObserverEntry.borderBoxSize[fragment] || resizeObserverEntry.borderBoxSize;
        inlineSize = boxSize.inlineSize;
        blockSize = boxSize.blockSize;
        break;

      case boxOptions.CONTENT_BOX:
        boxSize = resizeObserverEntry.contentBoxSize[fragment] || resizeObserverEntry.contentBoxSize;
        inlineSize = boxSize.inlineSize;
        blockSize = boxSize.blockSize;
        break;

      case boxOptions.DEVICE_PIXEL_CONTENT_BOX:
        if (typeof resizeObserverEntry.devicePixelContentBoxSize !== 'undefined') {
          boxSize =
            resizeObserverEntry.devicePixelContentBoxSize[fragment] || resizeObserverEntry.devicePixelContentBoxSize;
          inlineSize = boxSize.inlineSize;
          blockSize = boxSize.blockSize;
        } else {
          throw Error('resizeObserverEntry does not contain devicePixelContentBoxSize.');
        }
        break;

      default:
        inlineSize = resizeObserverEntry.contentRect.width;
        blockSize = resizeObserverEntry.contentRect.height;
    }
  }

  useEffect(() => {
    setWidthMatch(findBreakpoint(widths, inlineSize));
    setHeightMatch(findBreakpoint(heights, blockSize));
  }, [widths, inlineSize, heights, blockSize]);

  /* Support both array and object destructuring. */
  const result = [widthMatch, heightMatch] as UseBreakpointsResult;
  result.widthMatch = widthMatch;
  result.heightMatch = heightMatch;

  return result;
};
