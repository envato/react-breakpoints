<p align="center">
  <img src="./React-Breakpoints.svg" alt="React Breakpoints logo" />
</p>

<h1 align="center">React Breakpoints</h1>

<p align="center">
  <img alt="npm version" src="https://img.shields.io/npm/v/@envato/react-breakpoints?style=for-the-badge" />
  <img alt="react version" src="https://img.shields.io/npm/dependency-version/@envato/react-breakpoints/dev/react?style=for-the-badge">
  <img alt="license" src="https://img.shields.io/npm/l/@envato/react-breakpoints?style=for-the-badge" />
  <a href="CODE-OF-CONDUCT.md"><img alt="contributor covenant v2.0 adopted" src="https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg?style=for-the-badge" /></a>
</p>

---

`react-breakpoints` allows you to respond to changes in a DOM element's size. You can change the evaluated logic and rendered output of components based on observed size changes in DOM elements. For example, you can change a dropdown menu to a horizontal list menu based on its parent container's width without using CSS media queries.

## 📦 What's in the box?
> No polling. No event listening. No sentinel elements. **Just a [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)!**

This package provides you with:

* a [`<Provider>`](/docs/api.md#provider) to instantiate the ResizeObserver;
* an [`<Observe>`](/docs/api.md#observe) component to observe changes in a DOM element;
* a [`useBreakpoints()`](/docs/api.md#usebreakpoints) hook to change a component's behaviour based on the observed size information in the nearest parent `<Observe>`.

For power users this package also provides:

* a [`<Context>`](/docs/api.md#context) on which you can assign a `ResizeObserverEntry` value to update any nested components that are using `useBreakpoints()`;
* a [`useResizeObserver()`](/docs/api.md#useresizeobserver) hook to connect a DOM element in your component to the instantiated `ResizeObserver` on `<Provider>`;
* a [`useResizeObserverEntry()`](/docs/api.md#useresizeobserverentry) hook to retrieve the `ResizeObserverEntry` put on the nearest `<Context>`. This is what `useBreakpoints()` uses under the hood.

# 🚧 Developer status

Several projects within Envato are currently using this package, giving me confidence that the API is clear and the code adds value. The package is still in an early stage, but exposure to "the wild" will help reveal more edge-cases and hopefully make the package more robust overall.

# ⚡️ Quick start

Follow these **minimum required steps** to get started with `react-breakpoints`. This is just the tip of the iceberg, though. Check the [API Docs](/docs/api.md) for all options.

```shell
npm install @envato/react-breakpoints
```

## Set up the provider

```javascript
import { Provider as ResizeObserverProvider } from '@envato/react-breakpoints';

const App = () => (
  <ResizeObserverProvider>
    ...
  </ResizeObserverProvider>
)
```

⚠️ **Caution** — You may need to pass some props to `<Provider>` to increase browser support. Please refer to the [API Docs](/docs/api.md#provider).

## Observe an element

Everything you render through `<Observe>` becomes aware of the size of the element that is given `{...observedElementProps}`. This is called an "Observe Scope".

```javascript
import { Observe } from '@envato/react-breakpoints';

const MyObservingComponent = () => (
  <Observe
    render={({ observedElementProps }) => (
      <aside {...observedElementProps}>
        <MyResponsiveComponent />
      </aside>
    )}
  />
);
```

## Consume the observation

Components that are rendered within the "Observe Scope" can consume observation results via `useBreakpoints()`:

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

However, `<Observe>` supports additional props allowing you to observe **and** consume observations — no `useBreakpoints()` required!

See the [API Docs](/docs/api.md) for reference guides and usage examples.

# Observing vs. Consuming boxes

There is an important distinction between the `box` you observe and the `box` you consume for triggering breakpoints. See [Observing vs. Consuming Boxes](boxes.md) for more information.

# Server-Side Rendering

See [Server-Side Rendering](/docs/server-side-rendering.md) for more information.

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
