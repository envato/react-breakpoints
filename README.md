# React Breakpoints &middot; [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](CODE-OF-CONDUCT.md)

> Respond to changes in a parent DOM element's size.

This package provides you with:

* a `Provider` to instantiate the ResizeObserver;
* an `<Observe />` component to detect changes in an observed DOM element;
* a `useBreakpoints` hook to change a child component's behaviour based on the width and height of the nearest parent `<Observe />`.

For power users it also provides:
* a `useResizeObserver` hook, which is documented at [@envato/react-resize-observer-hook](https://github.com/envato/react-resize-observer-hook);
* a `Context` on which you can assign a `ResizeObserverEntry` value to trigger any nested components that are using `useBreakpoints`;
* a `useResizeObserverEntry` hook to retrieve the `ResizeObserverEntry` put on the nearest `Context`. This is what `useBreakpoints` uses under the hood.

This allows you to change the evaluated logic and rendered output of a component. For example, you can change a dropdown menu to a horizontal list menu based on its parent container's width without using CSS media queries.

# Developer status

While this package has seen little action "in the wild", it has first been developed and groomed elsewhere. As such, I don't expect a lot of changes conceptually. However, the API of this hook is not finalised and may change at any given time.

# Usage

```shell
npm install @envato/react-breakpoints
```

## Set up the Provider

```javascript
import { Provider as ResizeObserverProvider } from '@envato/react-breakpoints';

const App = () => (
  <ResizeObserverProvider>
    ...
  </ResizeObserverProvider>
)
```

**Caution**: By default, `Provider` instantiates a `window.ResizeObserver`. [`window.ResizeObserver` currently has weak browser support](https://caniuse.com/#feat=mdn-api_resizeobserver_resizeobserver). See [@envato/react-resize-observer-hook](https://github.com/envato/react-resize-observer-hook) for more information.

## Observe an element

```javascript
import { Observe } from '@envato/react-breakpoints';

<Observe
  render={({ observedElementProps }) => (
    <aside {...observedElementProps}>
      <MyResponsiveComponent />
    </aside>
  )}
/>
```

## Set breakpoints on a child component

```javascript
import { useBreakpoints } from '@envato/react-breakpoints';

const MyResponsiveComponent = () => {
  const options = {
    widths: {
      0: 'mobile',
      769: 'tablet',
      1025: 'desktop'
    }
  };

  const [label] = useBreakpoints(options);

  return (
    <div className={label}>
      This element is currently within the {label} range.
    </div>
  );
}
```

## You can return anything

```javascript
// Numbers
const [visibleItems] = useBreakpoints({
  widths: {
    0: 1,
    769: 3,
    1025: 4
  }
});

// Booleans
const [showDropdown] = useBreakpoints({
  widths: {
    0: true,
    961: false
  }
});

// Even functions
const [echo] = useBreakpoints({
  widths: {
    0: () => console.log('First breakpoint'),
    1381: () => console.log('Second breakpoint')
  }
});
echo();
```

## And you can break on height too

You can pass the following `options` object to `useBreakpoints`:

```javascript
const [widthValue, heightValue] = useBreakpoints({
  widths: {
    769: 'tablet-width',
    1025: 'desktop-width'
  },
  heights: {
    720: 'HD Ready',
    1080: 'Full HD',
    2160: '4K'
  }
});

// [widthValue, heightValue] for <Observe> size 1024x768
// => 'tablet-width', 'HD Ready'

// [widthValue, heightValue] for <Observe> size 1920x1080
// => 'desktop-width', 'Full HD'

// [widthValue, heightValue] for <Observe> size 640x480
// => undefined, undefined
// To avoid returning undefined you must provide a key 0 breakpoint value.
```

# Options

You can pass the following `options` object to `useBreakpoints`:

```javascript
const options = {
  widths: {}, // optional object with numbers as keys, and any value you want to return when that minWidth is matched
  heights: {}, // optional object with numbers as keys, and any value you want to return when that minHeight is matched
  box: '' // the observed box you're interested in
};

const [widthValue, heightValue] = useBreakpoints(options);
```

The **optional** `box` option depends on your targeted browser's support for `ResizeObserverEntry`. This library supports the following `box` options (but your browser may not!):

* [`border-box`](https://caniuse.com/#feat=mdn-api_resizeobserverentry_borderboxsize)
* [`content-box`](https://caniuse.com/#feat=mdn-api_resizeobserverentry_contentboxsize)
* [`device-pixel-content-box`](https://github.com/w3c/csswg-drafts/issues/3554)

If `box` is left `undefined` or set to any value other than those listed above, `useBreakpoints` will default to returning information from `ResizeObserverEntry.contentRect`.

# Server-Side Rendering

The values returned from `useBreakpoints` default to `undefined`, which is the case when:

* When the observed min-size isn't specified in your `options`;
* Rendering a component server-side.

You can use this `undefined` value to display your component differently for SSR purposes. How you do it is up to you (loading component, default CSS styles, placeholder content, `null`, etc).

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
