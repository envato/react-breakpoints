import { useResizeObserverEntry } from './useResizeObserverEntry';

const boxOptions = {
  BORDER_BOX: 'border-box', // https://caniuse.com/#feat=mdn-api_resizeobserverentry_borderboxsize
  CONTENT_BOX: 'content-box', // https://caniuse.com/#feat=mdn-api_resizeobserverentry_contentboxsize
  DEVICE_PIXEL_CONTENT_BOX: 'device-pixel-content-box' // https://github.com/w3c/csswg-drafts/issues/3554
};

/**
 * Find the breakpoint matching the given entry size.
 * @argument {Object} breakpoints - Map of sizes with their return values.
 * @argument {Number} entrySize - Size of entry to check breakpoints against.
 * @returns {*} Value of `breakpoints` at matching breakpoint.
 */
const findBreakpoint = (breakpoints, entrySize) => {
  if (typeof entrySize === 'undefined') return undefined;

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
 * @argument {Object} options
 * @argument {Object} [options.widths] - Map of minWidths and their return values.
 * @argument {Object} [options.heights] - Map of minHeights and their return values.
 * @argument {String} [options.box] - Name of element's box you want to match your breakpoints against. One of ['border-box', 'content-box', 'device-pixel-content-box'].
 * @argument {Number} [options.fragment] - Index of fragment to return from array of observed box fragments.
 * @argument {ResizeObserverEntry} [injectResizeObserverEntry] - Explicitly set the ResizeObserverEntry to use instead of fetching it from Context.
 * @returns {Array} Array of matching width value, and matching height value.
 */
const useBreakpoints = ({
  widths = {},
  heights = {},
  box = undefined,
  fragment = 0 // https://github.com/w3c/csswg-drafts/pull/4529
}, injectResizeObserverEntry = undefined) => {
  const resizeObserverEntry = useResizeObserverEntry(injectResizeObserverEntry);

  let entryBox, entryWidth, entryHeight;

  if (resizeObserverEntry) {
    switch (box) {
      case boxOptions.BORDER_BOX:
        entryBox = resizeObserverEntry.borderBoxSize[fragment] || resizeObserverEntry.borderBoxSize;
        entryWidth = entryBox.inlineSize;
        entryHeight = entryBox.blockSize;
        break;

      case boxOptions.CONTENT_BOX:
        entryBox = resizeObserverEntry.contentBoxSize[fragment] || resizeObserverEntry.contentBoxSize;
        entryWidth = entryBox.inlineSize;
        entryHeight = entryBox.blockSize;
        break;

      case boxOptions.DEVICE_PIXEL_CONTENT_BOX:
        entryBox = resizeObserverEntry.devicePixelContentBoxSize[fragment] || resizeObserverEntry.devicePixelContentBoxSize;
        entryWidth = entryBox.inlineSize;
        entryHeight = entryBox.blockSize;
        break;

      default:
        entryWidth = resizeObserverEntry.contentRect.width;
        entryHeight = resizeObserverEntry.contentRect.height;
    }
  }

  const widthMatch = findBreakpoint(widths, entryWidth);
  const heightMatch = findBreakpoint(heights, entryHeight);

  return [widthMatch, heightMatch];
};

export { useBreakpoints };
