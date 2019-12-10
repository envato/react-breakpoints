# React Breakpoints &middot; [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](CODE-OF-CONDUCT.md)

> Respond to changes in a DOM element's size.

This package provides you with:

* a [`<Provider>`](/docs/api.md#provider) to instantiate the ResizeObserver;
* an [`<Observe>`](/docs/api.md#observe) component to detect changes in an observed DOM element;
* a [`useBreakpoints()`](/docs/api.md#usebreakpoints) hook to change a child component's behaviour based on the width and height of the nearest parent `<Observe>`.

For power users it also provides:
* a [`<Context>`](/docs/api.md#context) on which you can assign a `ResizeObserverEntry` value to trigger any nested components that are using `useBreakpoints()`;
* a [`useResizeObserver()`](/docs/api.md#useresizeobserver) hook to access the instantiated `ResizeObserver` on `<Provider>`;
* a [`useResizeObserverEntry()`](/docs/api.md#useresizeobserverentry) hook to retrieve the `ResizeObserverEntry` put on the nearest `<Context>`. This is what `useBreakpoints()` uses under the hood.

This allows you to change the evaluated logic and rendered output of a component. For example, you can change a dropdown menu to a horizontal list menu based on its parent container's width without using CSS media queries.

# Developer status

While this package has seen little action "in the wild", it has first been developed and groomed elsewhere. As such, I don't expect a lot of changes conceptually. However, the API of this hook is not finalised and may change at any given time.

# Quick start

Follow these steps to get started with `react-breakpoints`. This is the **minimum required setup** and is just the tip of the iceberg, though. Check out the [API Docs](/docs/api.md) for all options.

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

⚠️ **Caution**: You may need to provide some props to `<Provider>` to increase browser support. Please refer to the [API Docs](/docs/api.md).

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

## Consume the observation

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

See the [API Docs](/docs/api.md) for reference guides and usage examples.

# Server-Side Rendering

See [`Server-Side Rendering`](/docs/server-side-rendering.md) for more information.

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
