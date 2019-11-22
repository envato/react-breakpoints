# React Breakpoints Hook &middot; [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](CODE-OF-CONDUCT.md)

> Respond to changes in width and height of the nearest React context.

This package provides you with:

* a React Hook (`useBreakpoints`) to change a components behaviour based on the width and height of its nearest `CellContext`;
* a React Context (`CellContext`) on which you can assign a `[width, height]` value to trigger any nested components with `useBreakpoints`.

This allows you to change the evaluated logic and rendered output of a component. For example, you can change a dropdown menu to a horizontal list menu based on its parent container's width without using CSS media queries.

# Developer status

While this package has seen little action "in the wild", it has first been developed and groomed elsewhere. As such, I don't expect a lot of changes conceptually. However, the API of this hook is not finalised and may change at any given time.

# Usage

```shell
npm install --save @envato/react-breakpoints-hook
```

## Set up a CellContext.Provider

```javascript
import { CellContext } from '@envato/react-breakpoints-hook';

const MyCellComponent = ({ cellWidth, cellHeight, children }) => (
  <CellContext.Provider value={[cellWidth, cellHeight]}>
    {children}
  </CellContext.Provider>
)
```

## Set breakpoints on a component

```javascript
import { useBreakpoints } from '@envato/react-breakpoints-hook';

const MyChangingComponent = () => {
  const [label] = useBreakpoints({
    0: 'mobile',
    769: 'tablet',
    1025: 'desktop'
  });

  return (
    <div className={label}>
      This element is currently within the {label} breakpoint.
    </div>
  );
}
```

## You can return anything

```javascript
// Numbers
const [visibleItems] = useBreakpoints({
  0: 1,
  769: 3,
  1025: 4
});

// Booleans
const [showDropdown] = useBreakpoints({
  0: true,
  800: false
});

// Even functions
const [echo] = useBreakpoints({
  0: () => console.log('First breakpoint'),
  1381: () => console.log('Second breakpoint')
});
echo();
```

## And you can break on height too

```javascript
const [widthValue, heightValue] = useBreakpoints({
  769: 'tablet-width',
  1025: 'desktop-width'
}, {
  720: 'HD Ready',
  1080: 'Full HD',
  2160: '4K'
});

// [widthValue, heightValue] for CellContext size 1024x768
// => 'tablet-width', 'HD Ready'

// [widthValue, heightValue] for CellContext size 1920x1080
// => 'desktop-width', 'Full HD'

// [widthValue, heightValue] for CellContent size 640x480
// => undefined, undefined
// To avoid returning undefined you must provide a key 0 breakpoint value.
```

# Maintainers

* [Marc Dingena](https://github.com/mdingena) (owner)

# Contributing

For bug fixes, documentation changes, and small features:

1. Fork this repository.
1. Create your feature branch (git checkout -b my-new-feature).
1. Commit your changes (git commit -am 'Add some feature').
1. Push to the branch (git push origin my-new-feature).
1. Create a new Pull Request.

**For larger new features**: Do everything as above, but first also make contact with the project maintainers to be sure your change fits with the project direction and you won't be wasting effort going in the wrong direction.
