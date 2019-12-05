import { useState, useEffect } from 'react';
import { useResizeObserverEntry } from './useResizeObserverEntry';

const boxOptions = {
  BORDER_BOX: 'border-box', // https://caniuse.com/#feat=mdn-api_resizeobserverentry_borderboxsize
  CONTENT_BOX: 'content-box', // https://caniuse.com/#feat=mdn-api_resizeobserverentry_contentboxsize
  DEVICE_PIXEL_CONTENT_BOX: 'device-pixel-content-box' // https://github.com/w3c/csswg-drafts/issues/3554
};

/**
 * Find the breakpoint matching the given entry size.
 * @param {Object} breakpoints - Map of sizes with their return values.
 * @param {Number} entrySize - Size of entry to check breakpoints against.
 * @returns {*} Value of `breakpoints` at matching breakpoint.
 */
const findBreakpoint = (breakpoints, entrySize) => {
  let breakpoint;
  const sizes = Object.keys(breakpoints);

  for (const next of sizes) {
    if (entrySize < Number(next)) break;
    breakpoint = next;
  }

  return breakpoints[breakpoint];
};

/**
 * Returns mapped value for width and height of nearest Context.
 * @param {Object} options
 * @param {Object} [options.widths] - Map of minWidths and their return values.
 * @param {Object} [options.heights] - Map of minHeights and their return values.
 * @param {String} [options.box] - Name of observed box you want to match your breakpoints against. One of ['border-box', 'content-box', 'device-pixel-content-box'].
 * @returns {Array} Array of matching width value, and matching height value.
 */
const useBreakpoints = ({
  widths = {},
  heights = {},
  box = undefined
}) => {
  const resizeObserverEntry = useResizeObserverEntry();

  /**
   * Short-circuit if element from Context has not been observed yet.
   * This is mostly the case when doing Server-Side Rendering.
   */
  if (!resizeObserverEntry) return [undefined, undefined];

  let entryWidth, entryHeight;

  switch (box) {
    case boxOptions.BORDER_BOX:
      entryWidth = resizeObserverEntry.borderBoxSize.inlineSize;
      entryHeight = resizeObserverEntry.borderBoxSize.blockSize;
      break;

    case boxOptions.CONTENT_BOX:
      entryWidth = resizeObserverEntry.contentBoxSize.inlineSize;
      entryHeight = resizeObserverEntry.contentBoxSize.blockSize;
      break;

    case boxOptions.DEVICE_PIXEL_CONTENT_BOX:
      entryWidth = resizeObserverEntry.devicePixelContentBoxSize.inlineSize;
      entryHeight = resizeObserverEntry.devicePixelContentBoxSize.blockSize;
      break;

    default:
      entryWidth = resizeObserverEntry.contentRect.width;
      entryHeight = resizeObserverEntry.contentRect.height;
  }

  const [width, setWidth] = useState(findBreakpoint(widths, entryWidth));
  const [height, setHeight] = useState(findBreakpoint(heights, entryHeight));

  useEffect(() => {
    setWidth(findBreakpoint(widths, entryWidth));
    setHeight(findBreakpoint(heights, entryHeight));
  }, [widths, entryWidth, heights, entryHeight]);

  return [width, height];
};

export { useBreakpoints };
