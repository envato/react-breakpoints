# API

Common usage:

* [`<Provider>`](#provider)
* [`<Observe>`](#observe)
* [`useBreakpoints()`](#usebreakpoints)

Advanced usage:

* [`<Context>`](#context)
* [`useResizeObserver()`](#useresizeobserver)
* [`useResizeObserverEntry()`](#useresizeobserverentry)

---

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

⚠️ **Caution** — `Provider` instantiates a `window.ResizeObserver` by default. [`window.ResizeObserver` currently has weak browser support](https://caniuse.com/#feat=mdn-api_resizeobserver_resizeobserver). You may pass a `ResizeObserver` constructor to `Provider` to use instead of `window.ResizeObserver`. I recommend [ponyfilling](https://ponyfill.com) using [`@juggle/resize-observer`](https://github.com/juggle/resize-observer). You can also [monkey patch](https://en.wikipedia.org/wiki/Monkey_patch) `window.ResizeObserver` and use `Provider` without the `ponyfill` prop.

## Usage

```javascript
import { Provider as ResizeObserverProvider } from '@envato/react-breakpoints';
import { ResizeObserver } from '@juggle/resize-observer'; // Ponyfill

const App = () => (
  <ResizeObserverProvider ponyfill={ResizeObserver}>
    ...
  </ResizeObserverProvider>
);
```

---

# `<Observe>`

You can observe size changes of an element's `box` by rendering it through `<Observe>`'s `render` prop. Your render function receives a `observedElementProps` argument that you spread onto the DOM element you wish to observe. It also receives `widthMatch` and `heightMatch` arguments which match the values you assigned via `<Observe>`'s `breakpoints` prop.

⚠️ **Important** — There is an important distinction between the `box` you're observing and `box`es triggering breakpoints. See [Observing boxes vs. Matching boxes](boxes.md) for more information.

## Reference guide

```javascript
<Observe
  {/* (optional) set which box to observe to on the observed element */}
  box='content-box'

  {/* (optional) set breakpoint options */}
  breakpoints={{
    /* see `options` object of `useBreakpoints()` - this object has the exact same shape */
  }}

  {/* pass a render function */}
  render={
    ({
      /* object of props to spread onto the element you wish to observe */
      observedElementProps,

      /* (optional) observed matching value from the `widths` option provided in the `breakpoints` prop */
      widthMatch,

      /* (optional) observed matching value from the `heights` option provided in the `breakpoints` prop */
      heightMatch
    }) => (
      <>
        {/* parent with access to observations via useBreakpoints() */}
        <ParentComponent>

          {/* observed element does not have to be a div, can be any DOM element! */}
          <div {...observedElementProps}>

            {/* children with access to observations via useBreakpoints() */}
            <ChildComponent />

          </div>

          {/* sibling with access to observations via useBreakpoints() */}
          <SiblingComponent />

        </ParentComponent>

        {/* component without useBreakpoints() can still be told about breakpoints */}
        <DumbComponent
          horizontalBreakpoint={widthMatch}
          verticalBreakpoint={heightMatch}
        />
      </>
    )
  }
/>
```

## Usage

```javascript
import { Observe } from '@envato/react-breakpoints';

const MyObservingComponent = () => (
  <Observe
    box='border-box'
    breakpoints={{
      box: 'content-box',
      widths: {
        0: 'mobile',
        769: 'tablet',
        1025: 'desktop'
      },
      heights: {
        0: 'SD',
        720: 'HD-Ready',
        1080: 'Full HD',
        2160: '4K'
      }
    }}
    render={({ observedElementProps, widthMatch, heightMatch }) => (
      <>
        {/* this element is given a class based on a child sidebar's width */}
        <article className={widthMatch}>

          {/* this sidebar is observed */}
          <aside {...observedElementProps}>

            {/* this component uses `useBreakpoints()` to adapt to the sidebar's size */}
            <MyResponsiveComponent />

          </aside>

          {/* this component receives one of the `heights` strings defined above based on the sidebar's height */}
          <MyVideoComponent quality={heightMatch} />
        </article>

        {/* this component also uses `useBreakpoints()` to adapt to the sidebar's size, but from outside the sidebar */}
        <MyResponsiveComponent />
      </>
    )}
  />
);
```

---

# `useBreakpoints()`

Components inside an "[`<Observe>`](#observe) scope" have access to its observations. The observed element's sizes are available on a [context](#context) via the `useBreakpoints()` hook.

The hook takes an `options` object as its first argument, which must include a `widths` or `heights` key (or both) with an object as its value. That object must have a shape of numbers as keys, and a value of any type. The value you set here is what will eventually be returned by `useBreakpoints()`.

Optionally, you can include a `box` property, which — depending on your implementation of `ResizeObserver` — can target different observable "boxes" of an element. By default, the legacy `contentRect` property will be used by `useBreakpoints()`.

The hook takes a optional `ResizeObserverEntry` as its second argument. **If you pass one, `useBreakpoints()` will not fetch it from the [context](#context), so use caution!**

## Reference guide

```javascript
const [widthValue, heightValue] = useBreakpoints({
  /* (optional) target a box size of the observed element to match widths and heights on */
  box: 'border-box',

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

  /* (optional) the box size fragment index to match widths and heights on (default 0) */
  fragment: 0
},

/* (optional) a ResizeObserverEntry to use instead of the one provided on context */
myResizeObserverEntry);
```

### `box`

> `String` <sup>optional</sup>

Depending on your implementation of `ResizeObserver`, the [internal `ResizeObserverEntry`](#useResizeObserverEntry) can contain size information about multiple "boxes" of the observed element.

This library supports the following `box` options (but your browser may not!):

* [`'border-box'`](https://caniuse.com/#feat=mdn-api_resizeobserverentry_borderboxsize)
* [`'content-box'`](https://caniuse.com/#feat=mdn-api_resizeobserverentry_contentboxsize)
* [`'device-pixel-content-box'`](https://github.com/w3c/csswg-drafts/issues/3554)

If `box` is left `undefined` or set to any value other than those listed above, `useBreakpoints()` will default to using information from `ResizeObserverEntry.contentRect`.

⚠️ **Important** — There is an important distinction between the `box` you're observing and `box`es triggering breakpoints. See [Observing boxes vs. Matching boxes](boxes.md) for more information.

### `widths`

> `Object` <sup>optional</sup>

`widths` must be an object with numbers as its keys. The numbers represent the minimum width the `box` must have for that key's value to be returned. The value of the highest matching width will be returned.

For example, when a width of `960` is observed, using the following `widths` object would return `'medium'`:

```javascript
widths: {
  0: 'small',
  769: 'medium',
  1025: 'large'
}
```

⚠️ **Caution** — If you do not provide `0` as a key for `widths`, you risk receiving `undefined` as a return value. This is intended behaviour, but makes it difficult to distinguish between receiving `undefined` because of a [Server-Side Rendering](server-side-rendering.md) scenario, or because the observed width is less than the next matching width.

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

`heights` must be an object with numbers as its keys. The numbers represent the minimum height the `box` must have for that key's value to be returned. The value of the highest matching height will be returned.

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

### `fragment`

> `Number` <sup>optional</sup>

The box sizes are exposed as sequences in order to support elements that have multiple fragments, which occur in multi-column scenarios. You can specify which fragment's size information to use for matching `widths` and `heights` by setting this prop. Defaults to the first fragment.

See [W3C Editor's Draft](https://drafts.csswg.org/resize-observer-1/#resize-observer-entry-interface) for more information about fragments.

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

---

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

⚠️ **Hint** — Instead of manually implementing the `child.js` portion as above, you may want to use [`useResizeObserverEntry()`](#useresizeobserverentry) instead.

---

# `useResizeObserver()`

⚠️ **Advanced usage** — This hook is used internally in [`<Observe>`](#observe) to:
* start and stop observing an element by passing a `ref` to a DOM element;
* bind a standardised callback to all observations, and set the `ObservedEntry` on a [`<Context>`](#context).

This hook takes an optional `options` object argument, which currently only supports a `box` option.

### `box`

> `String` <sup>optional</sup>

Depending on your implementation of `ResizeObserver`, you may observe one of multiple "boxes" of an element to trigger an update of `observedEntry`. By default this option is not set, and the size information of the observed element comes from the legacy `contentRect` property.

This library supports the following `box` options (but your browser may not!):

* [`'border-box'`](https://caniuse.com/#feat=mdn-api_resizeobserverentry_borderboxsize)
* [`'content-box'`](https://caniuse.com/#feat=mdn-api_resizeobserverentry_contentboxsize)
* [`'device-pixel-content-box'`](https://github.com/w3c/csswg-drafts/issues/3554)

⚠️ **Important** — There is an important distinction between the `box` you're observing and `box`es triggering breakpoints. See [Observing boxes vs. Matching boxes](boxes.md) for more information.

## Reference guide

```javascript
const [
  /* ref to set on the element you want to observe */
  ref,

  /* all of the observed element's box sizes */
  observedEntry
] = useResizeObserver(
  /* (optional) options object */
  {
    /* (optional) box of the element to observe size changes on, which trigger updates to `observedEntry` */
    box: 'border-box'
  }
);
```

## Usage

```javascript
import { useEffect } from 'react';
import { useResizeObserver, Context } from '@envato/react-breakpoints';

const MyObservedComponent = () => {
  const options = {
    box: 'border-box'
  };

  const [ref, observedEntry] = useResizeObserver(options);

  /* for example, you can use the observedEntry information internally... */

  useEffect(() => {
    const firstBorderBoxFragment = observedEntry.borderBoxSize[0];

    console.log(`width: ${firstBorderBoxFragment.inlineSize}`);
    console.log(`height: ${firstBorderBoxFragment.blockSize}`);
  }, [observedEntry]);

  /* ...or put it on a Context */

  return (
    <Context.Provider value={observedEntry}>
      <div ref={ref}>This is an observed element</div>
    </Context.Provider>
  );
}
```

⚠️ **Hint** — This is for when you really need advanced behaviour. This is completely abstracted away for your convenience by [`<Observe>`](#observe).

---

# `useResizeObserverEntry()`

⚠️ **Advanced usage** — This hook is used internally in [`useBreakpoints()`](#usebreakpoints) to retrieve the `ResizeObserverEntry` instance set by [`<Observe>`](#observe). It allows you to manually extract [its properties](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry), most notably `.borderBoxSize`, `.contentBoxSize`, and `.devicePixelContentBoxSize`. This hook takes no arguments.

## Reference guide

```javascript
const resizeObserverEntry = useResizeObserverEntry();
const fragmentIndex = 0;

/* retrieve width and height from legacy `contentRect` property */
const {
  contentRectWidth: width,
  contentRectHeight: height
} = resizeObserverEntry.contentRect;

/* retrieve width and height from `borderBoxSize` property of first fragment */
const {
  borderBoxSizeWidth: inlineSize,
  borderBoxSizeHeight: blockSize
} = resizeObserverEntry.borderBoxSize[fragmentIndex];

/* retrieve width and height from `contentBoxSize` property of first fragment */
const {
  contentBoxSizeWidth: inlineSize,
  contentBoxSizeHeight: blockSize
} = resizeObserverEntry.contentBoxSize[fragmentIndex];

/* retrieve width and height from `devicePixelContentBoxSize` property of first fragment */
const {
  devicePixelContentBoxSizeWidth: inlineSize,
  devicePixelContentBoxSizeHeight: blockSize
} = resizeObserverEntry.devicePixelContentBoxSize[fragmentIndex];
```

## Usage

```javascript
import { useResizeObserverEntry } from '@envato/react-breakpoints';

const MyResponsiveComponent = () => {
  const resizeObserverEntry = useResizeObserverEntry();

  /**
   * Falsey if element from Context has not been observed yet.
   * This is mostly the case when doing Server-Side Rendering.
   */
  if (!resizeObserverEntry) { /* ... */ };

  const { inlineSize: width, blockSize: height } = resizeObserverEntry.borderBoxSize[0];

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
      {/* this element's className changes based on its observed border-box width */}
    </div>
  )
}
```

⚠️ **Hint** — You probably don't need this hook, because [`useBreakpoints()`](#usebreakpoints) abstracts the above implementation away for your convenience. You'll likely only need this hook if you need a property from `ResizeObserverEntry` which is not `contentRect` or [one of `box`'s options](#box).
