# API

Common usage:

- [`<Provider>`](#provider)
- [`<Observe>`](#observe)

Advanced usage:

- [`useBreakpoints()`](#usebreakpoints)
- [`useResizeObserver()`](#useresizeobserver)
- [`useResizeObserverEntry()`](#useresizeobserverentry)
- [`<Context>`](#context)

---

# `<Provider>`

Your app must include a `<Provider>`. It creates a React context provider with a `ResizeObserver` instance as its value. This allows components nested under `<Provider>` to be observed for size changes.

## Reference guide

```jsx
<Provider
  {/* (optional) ResizeObserver constructor to be used instead of window.ResizeObserver */}
  ponyfill={window.ResizeObserver}
>
  {/* observable children */}
</Provider>
```

<details>
<summary><big><code>ponyfill</code></big> — <small>optional <code>typeof ResizeObserver</code></small></summary>

⚠️ **Caution** — `Provider` instantiates a `window.ResizeObserver` by default. [`window.ResizeObserver` currently has fair browser support](https://caniuse.com/mdn-api_resizeobserver_resizeobserver). You may pass a `ResizeObserver` constructor to `Provider` to use instead of `window.ResizeObserver`. I recommend [ponyfilling](https://ponyfill.com) using [`@juggle/resize-observer`](https://github.com/juggle/resize-observer). You can also [monkey patch](https://en.wikipedia.org/wiki/Monkey_patch) `window.ResizeObserver` and use `Provider` without the `ponyfill` prop.

</details>

## Usage

```jsx
import { Provider as ResizeObserverProvider } from '@envato/react-breakpoints';
import { ResizeObserver } from '@juggle/resize-observer'; // optional ponyfill

const App = () => <ResizeObserverProvider ponyfill={ResizeObserver}>...</ResizeObserverProvider>;
```

---

# `<Observe>`

You can observe changes of an element's `boxSize` by rendering it through `<Observe>`'s `children`. Your child function receives a `observedElementProps` argument that you spread onto the DOM element you wish to observe. If you passed the `breakpoints` prop, the child function also receives `widthMatch` and `heightMatch` arguments which match the values you assigned to this prop.

⚠️ **Important** — There is an important distinction between the `boxSize` you observe and the `boxSize` you pass to your breakpoints. See [Observing vs. Consuming `ResizeObserverSize`](boxSizes.md) for more information.

## Reference guide

```jsx
<Observe
  {/* (optional) set which box to observe to on the observed element */}
  box='content-box'

  {/* (optional) set breakpoint options */}
  {/* only needed if you wish to access `widthMatch` or `heightMatch` in the child function */}
  breakpoints={{
    /* see `options` object of `useBreakpoints()` - this object has the exact same shape */
  }}
>
  {/* pass a child function */}
  {
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

        {/* component without useBreakpoints() can still be told about breakpoint values */}
        <DumbComponent
          horizontalBreakpoint={widthMatch}
          verticalBreakpoint={heightMatch}
        />
      </>
    )
  }
</Observe>
```

<details>
<summary><big><code>box</code></big> — <small>optional <code>ResizeObserverBoxOptions</code></small></summary>

Depending on your implementation of `ResizeObserver`, the [internal `ResizeObserverEntry`](#useresizeobserverentry) can contain size information about multiple "boxes" of the observed element.

This library supports observing the following `box` options (but your browser may not!):

- [`'border-box'`](https://caniuse.com/#feat=mdn-api_resizeobserverentry_borderboxsize)
- [`'content-box'`](https://caniuse.com/#feat=mdn-api_resizeobserverentry_contentboxsize)
- [`'device-pixel-content-box'`](https://github.com/w3c/csswg-drafts/pull/4476)

If `box` is left `undefined` or set to any value other than those listed above, `<Observe>` will default to using information from `ResizeObserverEntry.contentRect`.

⚠️ **Important** — There is an important distinction between the `boxSize` you observe and the `boxSize` you pass to your breakpoints. See [Observing vs. Consuming `ResizeObserverSize`](boxSizes.md) for more information.

</details>

<details>
<summary><big><code>breakpoints</code></big> — <small>optional <code>object</code></small></summary>

This prop accepts an object with a shape identical to the `options` object of [`useBreakpoints()`](#usebreakpoints).

</details>

<details>
<summary><big><code>children</code></big> — <small><code>(args: RenderOptions) => ReactNode</code></small></summary>

```javascript
interface RenderOptions {
  observedElementProps: {
    ref: React.RefCallback<ObservedElement | null>
  };
  widthMatch: any;
  heightMatch: any;
}
```

The children prop takes a function with three arguments.

- `observedElementProps` — <small><code>object</code></small>  
  Using the `...` spread operator, you apply this object to the DOM element you want to observe.
- `widthMatch` — <small><code>any</code></small>  
  If you passed an object with a `widths` property to the `breakpoints` prop, this argument contains the currently matching width breakpoint value.
- `heightMatch` — <small><code>any</code></small>  
  If you passed an object with a `heights` property to the `breakpoints` prop, this argument contains the currently matching height breakpoint value.

Your function should at least return some JSX with `{...observedElementProps}` applied to a DOM element.

</details>

<details>
<summary><big><code>render</code></big> — <small><code>(args: RenderOptions) => ReactNode</code></small></summary>

If you prefer a render prop over `children`, you may use `render`. Note that if both provided, `<Observe>` will use `children`.

```javascript
interface RenderOptions {
  observedElementProps: {
    ref: React.RefCallback<ObservedElement | null>
  };
  widthMatch: any;
  heightMatch: any;
}
```

A render prop that takes a function with three arguments.

- `observedElementProps` — <small><code>Object</code></small>  
  Using the `...` spread operator, you apply this object to the DOM element you want to observe.
- `widthMatch` — <small><code>any</code></small>  
  If you passed an object with a `widths` property to the `breakpoints` prop, this argument contains the currently matching width breakpoint value.
- `heightMatch` — <small><code>any</code></small>  
  If you passed an object with a `heights` property to the `breakpoints` prop, this argument contains the currently matching height breakpoint value.

Your function should at least return some JSX with `{...observedElementProps}` applied to a DOM element.

</details>

## Usage

```jsx
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
  >
    {({ observedElementProps, widthMatch, heightMatch }) => (
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

        {/* this component also uses useBreakpoints() to adapt to the sidebar's size, but from outside the sidebar */}
        <MyResponsiveComponent />
      </>
    )}
  </Observe>
);
```

---

# `useBreakpoints()`

⚠️ **Advanced usage** — This hook is used internally in [`<Observe>`](#observe) to enable the use of its optional `breakpoints` prop.

Components inside an "[`<Observe>`](#observe) scope" have access to its observations. The observed element's sizes are available on a [context](#context) via the `useBreakpoints()` hook.

The hook takes an `options` object as its first argument, which must include a `widths` or `heights` key (or both) with an object as its value. That object must have a shape of numbers as keys, and a value of any type. The value you set here is what will eventually be returned by `useBreakpoints()`.

Optionally, you can include a `box` property, which — depending on your implementation of `ResizeObserver` — can target different observable "boxes" of an element. By default, the legacy `contentRect` property will be used by `useBreakpoints()`, but I recommend you use one of the spec's new `ResizeObserverSize` box sizes.

The hook takes an optional `ResizeObserverEntry` as its second argument. **You probably don't need this, but know that if you pass one, `useBreakpoints()` will not fetch the entry from the [context](#context), so use caution!**

## Reference guide

```javascript
/* returns an array of matched breakpoint values */
const {
  /* matched value from `options.widths` */
  widthMatch,

  /* matched value from `options.heights` */
  heightMatch
} = useBreakpoints(
  {
    /* (optional) the boxSize of the observed element to pass to the breakpoint matching logic */
    box: 'border-box',

    /* (optional) must be specified if `heights` is not specified */
    widths: {
      /* keys must be numbers and are treated like CSS's @media (min-width) */
      0: 'small' /* value can be of any type */,
      769: 'medium' /* keys are evaluated in order */,
      1025: 'large'
    },

    /* (optional) must be specified if `widths` is not specified */
    heights: {
      /* keys must be numbers and are treated like CSS's @media (min-height) */
      0: 'SD' /* value can be of any type */,
      720: 'HD Ready' /* keys are evaluated in order */,
      1080: 'Full HD',
      2160: '4K'
    },

    /* (optional) the boxSize fragment index to match widths and heights on (default 0) */
    fragment: 0
  },

  /* (optional) a ResizeObserverEntry to use instead of the one provided on context */
  injectResizeObserverEntry
);
```

<details>
<summary><big><code>options.box</code></big> — <small>optional <code>ResizeObserverBoxOptions</code></small></summary>

Depending on your implementation of `ResizeObserver`, the [internal `ResizeObserverEntry`](#useresizeobserverentry) can contain size information about multiple "boxes" of the observed element.

This library supports the following `box` options (but your browser may not!):

- [`'border-box'`](https://caniuse.com/#feat=mdn-api_resizeobserverentry_borderboxsize)
- [`'content-box'`](https://caniuse.com/#feat=mdn-api_resizeobserverentry_contentboxsize)
- [`'device-pixel-content-box'`](https://github.com/w3c/csswg-drafts/pull/4476)

If `box` is left `undefined` or set to any value other than those listed above, `useBreakpoints()` will default to using information from `ResizeObserverEntry.contentRect`.

⚠️ **Important** — There is an important distinction between the `boxSize` you observe and the `boxSize` you pass to your breakpoints. See [Observing vs. Consuming `ResizeObserverSize`](boxSizes.md) for more information.

</details>

<details>
<summary><big><code>options.widths</code></big> — <small>optional <code>object</code></small></summary>

`widths` must be an object with numbers as its keys. The numbers represent the minimum width the observed `boxSize.inlineSize` must be for that key's value to be returned. The value of the highest matching width will be returned, as if using multiple CSS `@media (min-width)` queries.

For example, when a width of `960` is observed, using the following `widths` object would return `'medium'`:

```javascript
widths: {
  0: 'small',
  769: 'medium',
  1025: 'large'
}
```

⚠️ **Caution** — If you do not provide `0` as a key for `widths`, you risk receiving `undefined` as a return value. This is intended behaviour, but makes it difficult to distinguish between receiving `undefined` because of a [Server-Side Rendering](server-side-rendering.md) scenario, or because the observed width is less than the lowest defined width.

For example, when a width of `360` is observed, using the following `widths` object would return `undefined`:

```javascript
widths: {
  769: 'medium',
  1025: 'large'
}
```

Values can be of _any_ type, you are not restricted to return `string` values, and value types can be mixed for different keys.

</details>

<details>
<summary><big><code>options.heights</code></big> — <small>optional <code>object</code></small></summary>

`heights` must be an object with numbers as its keys. The numbers represent the minimum height the observed `boxSize.blockSize` must be for that key's value to be returned. The value of the highest matching height will be returned, as if using multiple CSS `@media (min-height)` queries.

For example, when a height of `1440` is observed, using the following `heights` object would return `'Full HD'`:

```javascript
heights: {
  480: 'SD', /* returns `undefined` for heights <= 479 */
  720: 'HD Ready',
  1080: 'Full HD',
  2160: '4K'
}
```

⚠️ **Caution**: If you do not provide `0` as a key for `heights`, you risk receiving `undefined` as a return value. This is intended behaviour, but makes it difficult to distinguish between receiving `undefined` because of a [Server-Side Rendering](server-side-rendering.md) scenario, or because the observed height is less than the lowest defined height.

Values can be of _any_ type, you are not restricted to return `string` values, and value types can be mixed for different keys.

</details>

<details>
<summary><big><code>options.fragment</code></big> — <small>optional <code>number</code></small></summary>

The box sizes are exposed as sequences in order to support elements that have multiple fragments, which occur in multi-column scenarios. You can specify which fragment's size information to use for matching `widths` and `heights` by setting this prop. Defaults to the first fragment.

See the [W3C Editor's Draft](https://drafts.csswg.org/resize-observer-1/#resize-observer-entry-interface) for more information about fragments.

</details>

<details>
<summary><big><code>injectResizeObserverEntry</code></big> — <small>optional <code>ResizeObserverEntry</code></small></summary>

Allows you to force `useBreakpoints()` to use the `ResizeObserverEntry` you pass here in its calculations rather than retrieving the entry that's on the closest [`<Context>`](#context). Because of the Rules of Hooks, `React.useContext()` will still be called but its returned value is ignored.

</details>

## Usage

```jsx
import { useBreakpoints } from '@envato/react-breakpoints';

const MyResponsiveComponent = () => {
  const options = {
    box: 'border-box',
    widths: {
      0: 'mobile',
      769: 'tablet',
      1025: 'desktop'
    }
  };

  const { widthMatch: label } = useBreakpoints(options);

  return <div className={label}>This element is currently within the {label} range.</div>;
};
```

---

# `useResizeObserver()`

⚠️ **Advanced usage** — This hook is used internally in [`<Observe>`](#observe) to:

- start and stop observing an element by passing a `ref` to a DOM element;
- bind a standardised callback to all observations, and set the `observedEntry` on a [`<Context>`](#context).

This hook takes an optional `options` object argument, which currently only supports a `box` option.

## Reference guide

```javascript
const [
  /* ref callback to set on the element you want to observe */
  ref,

  /* all of the observed element's boxSizes */
  observedEntry
] = useResizeObserver(
  /* (optional) options object */
  {
    /* (optional) box of the element to observe size changes on, which trigger updates to `observedEntry` */
    box: 'border-box'
  }
);
```

<details>
<summary><big><code>options.box</code></big> — <small>optional <code>ResizeObserverBoxOptions</code></small></summary>

Depending on your implementation of `ResizeObserver`, you may observe one of multiple "boxes" of an element to trigger an update of `observedEntry`. By default this option is not set, and the size information of the observed element comes from the legacy `contentRect` property.

This library supports the following `box` options (but your browser may not!):

- [`'border-box'`](https://caniuse.com/#feat=mdn-api_resizeobserverentry_borderboxsize)
- [`'content-box'`](https://caniuse.com/#feat=mdn-api_resizeobserverentry_contentboxsize)
- [`'device-pixel-content-box'`](https://github.com/w3c/csswg-drafts/pull/4476)

⚠️ **Important** — There is an important distinction between the `boxSize` you observe and the `boxSize` you pass to your breakpoints. See [Observing vs. Consuming `ResizeObserverSize`](boxSizes.md) for more information.

</details>

## Usage

```jsx
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
};
```

⚠️ **Hint** — This is for when you really need advanced behaviour, such as calculating logic based on the absolute width and height values rather than a few breakpoint values. The latter is completely abstracted away for your convenience by [`<Observe>`](#observe).

---

# `useResizeObserverEntry()`

⚠️ **Advanced usage** — This hook is used internally in [`useBreakpoints()`](#usebreakpoints) to retrieve the `ResizeObserverEntry` instance set by [`<Observe>`](#observe). It allows you to manually extract [its properties](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry), most notably `.borderBoxSize`, `.contentBoxSize`, and `.devicePixelContentBoxSize`.

The hook takes an optional `ResizeObserverEntry` as its second argument. **If you pass one, `useResizeObserverEntry()` will not fetch it from the [context](#context), so use caution!**

## Reference guide

```javascript
const resizeObserverEntry = useResizeObserverEntry(
  /* (optional) a ResizeObserverEntry to use instead of the one provided on context */
  injectResizeObserverEntry
);

/* retrieve width and height from legacy `contentRect` property */
const { width: contentRectWidth, height: contentRectHeight } = resizeObserverEntry.contentRect;

/* retrieve width and height from `borderBoxSize` property of first fragment */
const { inlineSize: borderBoxSizeWidth, blockSize: borderBoxSizeHeight } = resizeObserverEntry.borderBoxSize[0];

/* retrieve width and height from `contentBoxSize` property of first fragment */
const { inlineSize: contentBoxSizeWidth, blockSize: contentBoxSizeHeight } = resizeObserverEntry.contentBoxSize[0];

/* retrieve width and height from `devicePixelContentBoxSize` property of first fragment */
const {
  inlineSize: devicePixelContentBoxSizeWidth,
  blockSize: devicePixelContentBoxSizeHeight
} = resizeObserverEntry.devicePixelContentBoxSize[0];
```

## Usage

```jsx
import { useResizeObserverEntry } from '@envato/react-breakpoints';

const MyResponsiveComponent = () => {
  const resizeObserverEntry = useResizeObserverEntry();

  /**
   * `null` if element from Context has not been observed yet.
   * This is mostly the case when doing Server-Side Rendering.
   */
  if (!resizeObserverEntry) {
    /* ... */
  }

  const { inlineSize: width, blockSize: height } = resizeObserverEntry.borderBoxSize[0];

  let className;

  if (width >= 1025) {
    className = 'large';
  } else if (width >= 769) {
    className = 'medium';
  } else if (width >= 0) {
    className = 'small';
  }

  return (
    <>
      {/* this element's className changes based on its observed border-box width */}
      {/* CAUTION - beware of creating a circular dependency by changing the observed sizes within your classnames! */}
      <div className={className}>I'm being observed!</div>
    </>
  );
};
```

⚠️ **Hint** — You probably don't need this hook, because [`useBreakpoints()`](#usebreakpoints) abstracts the above implementation away for your convenience. You'll likely only need this hook if you need a property from `ResizeObserverEntry` which is not `contentRect` or one of the `ResizeObserverBoxOptions`.

---

# `<Context>`

⚠️ **Internal usage, you probably don't need this!** — This React context is used internally by [`useBreakpoints()`](#usebreakpoints). You may use this context with `React.useContext()` to access the information stored in the context provider, which is typically a `ResizeObserverEntry` set internally by [`<Observe>`](#observe).

## Reference guide

```jsx
<Context.Provider value={ResizeObserverEntry}>
```

## Usage

`parent.js`

```jsx
import { Context } from '@envato/react-breakpoints';

<Context.Provider value={myResizeObserverEntry}>
  {/* children with access to `myResizeObserverEntry` */}
</Context.Provider>;
```

`child.js`

```jsx
import { useContext } from 'react';
import { Context } from '@envato/react-breakpoints';

const MyChildComponent = () => {
  const myResizeObserverEntry = useContext(Context);
  /* ... */
};
```

⚠️ **Hint** — Instead of manually implementing the `child.js` portion as above, you may want to use [`useResizeObserverEntry()`](#useresizeobserverentry) instead.
