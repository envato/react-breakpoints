# Observing vs. Consuming `ResizeObserverSize`

There is an important distinction between the `boxSize` you observe and the `boxSize` you consume for triggering breakpoints.

> You can observe a `boxSize` on an element, and then respond to changes in **another** `boxSize` of that same element.

There might be cases where observing the same box you're matching breakpoints against is not desirable. **This package supports observing and consuming different boxes on the same element.**

<details>
<summary><big>What's happening under the hood?</big></summary>

Consider this example code and chain of events:

```jsx
import { Observe, useBreakpoints } from '@envato/react-breakpoints';

const MyObservedElementComponent = () => (
  /* observed changes to `contentBoxSize` will update Observe's context */
  <Observe box='content-box'>
    {({ observedElementProps }) => (
      <div {...observedElementProps}>
        <ChildComponent />
      </div>
    )}
  </Observe>
);

const ChildComponent = () => {
  const options = {
    widths: {
      0: 'foo',
      1000: 'bar'
    },

    /* above widths are matched against `devicePixelContentBoxSize` */
    box: 'device-pixel-content-box'
  };

  const { widthMatch: label } = useBreakpoints(options);

  return <div className={label}>This element is currently within the {label} range.</div>;
};
```

1. You start observing an element's `contentBoxSize`. `<Observe>` puts a `ResizeObserverEntry` on its context. **This object contains all box sizes of the observed element.**
1. `<ChildComponent>` is aware of **all of the element's box sizes** via `<Observe>`'s context. You decide you want to apply your breakpoints using the `devicePixelContentBoxSize` information.
1. A moment later, the element's `contentBoxSize` changes.
1. `<Observe>` updates the `ResizeObserverEntry` on its context, and `<ChildComponent>` responds accordingly.
1. Then, the element's `borderBoxSize` changes, but **not** its `contentBoxSize` (for example, when a CSS animation adds additional padding to an element).
1. Because `borderBoxSize` is not observed, `<Observe>`'s context does not get updated, and therefore `<ChildComponent>` does not update.
1. Finally, after a while longer, the element's `devicePixelContentBoxSize` changes.
1. Even though `<ChildComponent>` uses this box's size, `<Observe>` is not observing changes on this box, and does not update its context to inform `<ChildComponent>`.
</details>

# ⚠️ Important

A change in one given `boxSize` does not always mean that the element's other `boxSize`s have also changed.

Consider the [CSS box model](https://en.wikipedia.org/wiki/CSS_box_model#/media/File:Boxmodell-detail.png):

![CSS Box Model](css-box-model.png)

When padding or border increase in thickness, the content's size will remain unaffected. If you are observing changes in `contentBoxSize`, those padding and border changes **will not trigger any updates**.

Similarly, let's say you have the following element:

```html
<div style="box-sizing: border-box; width: 100px; padding: 10px;">...</div>
```

Then you change that element's `padding` to `0`. If you are observing changes in this element's `borderBoxSize`, this padding change **will not trigger any updates** because the `borderBoxSize` did not change.
