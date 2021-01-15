/**
 * Find the breakpoint matching the given entry size.
 * @argument {Object} breakpoints - Map of sizes with their return values.
 * @argument {Number} entrySize - Size of entry to check breakpoints against.
 * @returns {*} Value of `breakpoints` at matching breakpoint.
 */
export const findBreakpoint = (breakpoints, entrySize) => {
  let breakpoint;
  const sizes = Object.keys(breakpoints);

  for (const next of sizes) {
    if (entrySize < Number(next)) break;
    breakpoint = next;
  }

  return breakpoints[breakpoint];
};
