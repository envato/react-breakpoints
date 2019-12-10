# API

Common usage:

* [`<Provider>`](#provider)
* [`<Observe>`](#observe)
* [`useBreakpoints()`](#usebreakpoints)

Advanced usage:

* [`<Context>`](#context)
* [`useResizeObserver()`](#useresizeobserver)
* [`useResizeObserverEntry()`](#useresizeobserverentry)

# `<Provider>`

Your app must include a `<Provider>`. It creates a React context with a `ResizeObserver` instance as its value. This allows components nested under `<Provider>` to be observed for changes in size.

## Reference guide

```javascript
<Provider
  {/* (optional) ResizeObserver constructor to be used instead of window.ResizeObserver */}
  ponyfill={window.ResizeObserver}
>
  {/* observable children */}
</Provider>
```

⚠️ **Caution**: `Provider` instantiates a `window.ResizeObserver` by default. [`window.ResizeObserver` currently has weak browser support](https://caniuse.com/#feat=mdn-api_resizeobserver_resizeobserver). You may pass a `ResizeObserver` constructor to `Provider` to use instead of `window.ResizeObserver`. I recommend [ponyfilling](https://github.com/sindresorhus/ponyfill) using [`@juggle/resize-observer`](https://github.com/juggle/resize-observer). You can also [monkey patch](https://en.wikipedia.org/wiki/Monkey_patch) `window.ResizeObserver` and use `Provider` without the `ponyfill` prop.

## Usage

```javascript
import { Provider as ResizeObserverProvider } from '@envato/react-breakpoints';
import ResizeObserver from '@juggle/resize-observer'; // Ponyfill

const App = () => (
  <ResizeObserverProvider ponyfill={ResizeObserver}>
    ...
  </ResizeObserverProvider>
);
```

# `<Observe>`

You can observe size changes of an element by rendering it through `<Observe>`'s `render` prop. Your render function receives a `observedElementProps` argument that you spread onto the DOM element you wish to observe.

## Reference guide

```javascript
<Observe
  {/* pass a render function */}
  render={
    /**
     * @argument {Object} args
     * @argument {Object} args.observedElementProps - Object of props to spread onto the element you wish to observe.
     */
    ({ observedElementProps }) => (
      <>
        {/* parent with access to observations */}
        <ParentComponent>

          {/* observed element does not have to be a div, can be any DOM element! */}
          <div {...observedElementProps}>
            {/* children with access to observations */}
          </div>

          {/* sibling with access to observations */}
          <SiblingComponent />

        </ParentComponent>
      </>
    )
  }
/>
```

## Usage

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

# `useBreakpoints()`

Components inside an "`<Observe>` scope" have access to its observations. The observed element's sizes are available on a [context](#context) via the `useBreakpoints()` hook.

The hook takes an `options` object, which must include a `widths` or `heights` key (or both) with an object as its value. That object must have a shape of numbers as keys, and a value of any type. The value you set here is what will eventually be returned by `useBreakpoints()`.

Optionally, you can include a `box` property, which — depending on your implementation of `ResizeObserver` — can target different observable "boxes" of an element. By default, the legacy property `contentRect` will be used by `useBreakpoints()`.

## Reference guide

```javascript
const [widthValue, heightValue] = useBreakpoints({
  /* (optional) must be specified if `heights` is not specified */
  widths: {
    /* keys must be numbers and are treated like CSS's @media (min-width) */
    0: 'small', /* value can be of any type */
    769: 'medium',
    1025: 'large'
  },

  /* (optional) must be specified if `widths` is not specified */
  heights: {
    /* keys must be numbers and are treated like CSS's @media (min-height) */
    0: 'SD', /* value can be of any type */
    720: 'HD Ready',
    1080: 'Full HD',
    2160: '4K'
  },

  /* (optional) target an observed box to match widths and heights on */
  box: 'border-box'
});
```

### `widths`

> `Object` <sup>optional</sup>

`widths` must be an object with numbers as its keys. The numbers represent the minimum width the observed `box` must have for that key's value to be returned. The value of the highest matching width will be returned.

For example, when a width of `960` is observed, using the following `widths` object would return `'medium'`:

```javascript
widths: {
  0: 'small',
  769: 'medium',
  1025: 'large'
}
```

⚠️ **Caution**: If you do not provide `0` as a key for `widths`, you risk receiving `undefined` as a return value. This is intended behaviour, but makes it difficult to distinguish between receiving `undefined` because of a [Server-Side Rendering](server-side-rendering.md) scenario, or because the observed width is less than the next matching width.

For example, when a width of `360` is observed, using the following `widths` object would return `undefined`:

```javascript
widths: {
  769: 'medium',
  1025: 'large'
}
```

Values can be of _any_ type, you are not restricted to return `string` values.

```javascript
// Numbers
const [visibleCarouselItems] = useBreakpoints({
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

// Components
const [Component] = useBreakpoints({
  widths: {
    0: HamburgerMenu,
    1381: HorizontalMenu
  }
});
```

### `heights`

> `Object` <sup>optional</sup>

`heights` must be an object with numbers as its keys. The numbers represent the minimum height the observed `box` must have for that key's value to be returned. The value of the highest matching height will be returned.

For example, when a height of `1440` is observed, using the following `heights` object would return `'Full HD'`:

```javascript
heights: {
  480: 'SD', /* returns `undefined` for heights <= 479 */
  720: 'HD Ready',
  1080: 'Full HD',
  2160: '4K'
}
```

⚠️ **Caution**: If you do not provide `0` as a key for `heights`, you risk receiving `undefined` as a return value. This is intended behaviour, but makes it difficult to distinguish between receiving `undefined` because of a [Server-Side Rendering](server-side-rendering.md) scenario, or because the observed height is less than the next matching height.

Values can be of _any_ type, you are not restricted to return `string` values. See example in [`widths`](#widths) section above.

### `box`

> `String` <sup>optional</sup>

Depending on your implementation of `ResizeObserver`, the internal `ResizeObserverEntry` can contain size information about multiple "boxes" of the observed element.

This library supports the following `box` options (but your browser may not!):

* [`'border-box'`](https://caniuse.com/#feat=mdn-api_resizeobserverentry_borderboxsize)
* [`'content-box'`](https://caniuse.com/#feat=mdn-api_resizeobserverentry_contentboxsize)
* [`'device-pixel-content-box'`](https://github.com/w3c/csswg-drafts/issues/3554)

If `box` is left `undefined` or set to any value other than those listed above, `useBreakpoints()` will default to returning information from `ResizeObserverEntry.contentRect`.

## Usage

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
};
```

# `<Context>`

⚠️ **Advanced usage** — This React context is used internally by [`useBreakpoints()`](#usebreakpoints). You may use this context with `React.useContext()` to access the information stored in the context provider, which is typically a `ResizeObserverEntry` set internally by [`<Observe>`](#observe).

## Reference guide

```javascript
<Context.Provider value={ResizeObserverEntry}>
```

## Usage

`parent.js`
```javascript
import { Context } from '@envato/react-breakpoints';

<Context.Provider value={myResizeObserverEntry}>
  /* children with access to `myResizeObserverEntry` */
</Context.Provider>
```

`child.js`
```javascript
import { useContext } from 'react';
import { Context } from '@envato/react-breakpoints';

const MyChildComponent = () => {
  const myResizeObserverEntry = useContext(Context);
  /* ... */
};
```

⚠️ **Hint**: Instead of manually implementing the `child.js` portion as above, you may want to use [`useResizeObserverEntry()`](#useresizeobserverentry) instead.

# `useResizeObserver()`

This hook is used internally in [`<Observe>`](#observe) to retrieve the `ResizeObserver` instance set by [`<Provider>`](#provider). It allows you to call [its methods](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver), most notably `.observe()` and `.unobserve()`. This hook takes no arguments.

## Reference guide

```javascript
const resizeObserver = useResizeObserver();

resizeObserver.observe(node);
resizeObserver.unobserve(node);
resizeObserver.disconnect();
```

See [MDN reference guide](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) for further information.

## Usage

```javascript
import { useRef, useCallback } from 'react';
import { useResizeObserver } from '@envato/react-breakpoints';

const MyObserverComponent = () => {
  const resizeObserver = useResizeObserver();

  const handleResizeObservation = resizeObserverEntry => {
    /* do something with the size information */
  };

  const ref = useRef(null);

  const setRef = useCallback(node => {
    if (ref.current) {
      resizeObserver.unobserve(ref.current);
      delete ref.current.handleResizeObservation;
    }

    if (node) {
      node.handleResizeObservation = handleResizeObservation;
      resizeObserver.observe(node);
    }

    ref.current = node;
  }, [resizeObserver]);

  return (
    <div ref={setRef}>
      {/* this element is now observed */}
      {/* every time its size changes, the ResizeObserver will call `handleResizeObservation` on this element */}
    </div>
  )
}
```

⚠️ **Hint**: This is for when you really need advanced behaviour. This is completely abstracted away for your convenience by [`<Observe>`](#observe).

# `useResizeObserverEntry()`

This hook is used internally in [`useBreakpoints()`](#usebreakpoints) to retrieve the `ResizeObserverEntry` instance set by [`<Observe>`](#observe). It allows you to manually extract [its properties](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry), most notably `.borderBoxSize`, `.contentBoxSize`, and `.devicePixelContentBoxSize`. This hook takes no arguments.

## Reference guide

```javascript
const resizeObserverEntry = useResizeObserverEntry();

/* retrieve with and height from legacy `contentRect` property */
const {
  contentRectWidth: width,
  contentRectHeight: height
} = resizeObserverEntry.contentRect;

/* retrieve with and height from `borderBoxSize` property */
const {
  borderBoxSizeWidth: inlineSize,
  borderBoxSizeHeight: blockSize
} = resizeObserverEntry.borderBoxSize;

/* retrieve with and height from `contentBoxSize` property */
const {
  contentBoxSizeWidth: inlineSize,
  contentBoxSizeHeight: blockSize
} = resizeObserverEntry.contentBoxSize;

/* retrieve with and height from `devicePixelContentBoxSize` property */
const {
  devicePixelContentBoxSizeWidth: inlineSize,
  devicePixelContentBoxSizeHeight: blockSize
} = resizeObserverEntry.devicePixelContentBoxSize;
```

## Usage

```javascript
import { useResizeObserverEntry } from '@envato/react-breakpoints';

const MyResponsiveComponent = () => {
  const resizeObserverEntry = useResizeObserverEntry();

  const { inlineSize: width, blockSize: height } = resizeObserverEntry.borderBoxSize;

  let className;

  if (width >= 0) {
    className = 'small';
  } else if (width >= 769) {
    className = 'medium';
  } else if (width >= 1025 ) {
    className = 'large';
  }

  return (
    <div className={className}>
      {/* this element's className changes based on the observed width */}
    </div>
  )
}
```

⚠️ **Hint**: You probably don't need this hook, because [`useBreakpoints()`](#usebreakpoints) abstracts the above implementation away for your convenience. You'll likely only need this hook if you need a property from `ResizeObserverEntry` which is not `contentRect` or [one of `box`'s options](#box).
