import { useContext, useState, useEffect } from 'react';
import { CellContext } from './cellContext';

/**
 * Find the breakpoint matching the given cell size.
 * @param {Object} breakpoints - Map of sizes with their return values.
 * @param {Number} cellSize - Size of cell to check breakpoints against.
 * @returns {*} Value of `breakpoints` at matching breakpoint.
 */
const findBreakpoint = (breakpoints, cellSize) => {
  let breakpoint;
  const sizes = Object.keys(breakpoints);

  for (const next of sizes) {
    if (cellSize < Number(next)) break;
    breakpoint = next;
  }

  return breakpoints[breakpoint];
};

/**
 * Returns mapped value for width and height of nearest CellContext.
 * @param {Object} widthMap - Map of widths and their return values.
 * @param {Object} heightMap - Map of heights and their return values.
 * @returns {Array} Array of matching width breakpoint, and matching height breakpoint.
 */
const useBreakpoints = (widthMap = {}, heightMap = {}) => {
  const [cellWidth, cellHeight] = useContext(CellContext);

  const [width, setWidth] = useState(findBreakpoint(widthMap, cellWidth));
  const [height, setHeight] = useState(findBreakpoint(heightMap, cellHeight));

  useEffect(() => {
    setWidth(findBreakpoint(widthMap, cellWidth));
    setHeight(findBreakpoint(heightMap, cellHeight));
  }, [widthMap, cellWidth, heightMap, cellHeight]);

  return [width, height];
};

export { useBreakpoints };
