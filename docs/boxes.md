# Observing vs. Consuming boxes

There is an important distinction between the `box` you observe and the `box` you consume for triggering breakpoints.

> You can observe a box on an element, and then respond to changes in **another** box of that element.

There might be cases where observing the same box you're matching breakpoints against is not desirable. **This package supports observing and consuming different boxes on the same element.**

<details>
<summary><big>What's happening under the hood?</big></summary>


Consider this example code and chain of events:

```javascript
import { Observe, useBreakpoints } from '@envato/react-breakpoints';

const MyObservedElementComponent = () => (
  <Observe
    render={({ observedElementProps }) => (
      <div {...observedElementProps}>
        <ChildComponent />
      </div>
    )}

    /* changes to this box's size will update Observe's context */
    box='content-box'
  />
);

const ChildComponent = () => {
  const [label] = useBreakpoints({
    widths: {
      0: 'foo',
      1000: 'bar'
    },

    /* above widths are matches against this box */
    box: 'device-pixel-content-box'
  });

  return (
    <div className={label}>
      This element is currently within the {label} range.
    </div>
  );
};
```

1. You start observing an element's `content-box` size. `<Observe>` puts a `ResizeObserverEntry` on its context. **This object contains all box sizes of the observed element.**
1. `<ChildComponent>` is aware of **all of the element's box sizes** via `<Observe>`'s context. You decide you want to apply your breakpoints using the `device-pixel-content-box` information.
1. A moment later, the element's `content-box` size changes.
1. `<Observe>` updates the `ResizeObserverEntry` on its context, and `<ChildComponent>` responds accordingly.
1. Then, the element's `border-box` size changes, but **not** its `content-box`.
1. Because `border-box` is not observed, `<Observe>`'s context does not get updated, and therefore `<ChildComponent>` does not update.
1. Finally, after a while longer, the element's `device-pixel-content-box` size changes.
1. Even though `<ChildComponent>` uses this box's size, `<Observe>` is not observing changes on this box, and does not update its context to inform `<ChildComponent>`.
</details>

# ⚠️ Important

A change in the size of one given `box` does not always mean that the element's other `box`es have also changed size.

Consider the [CSS box model](https://en.wikipedia.org/wiki/CSS_box_model#/media/File:Boxmodell-detail.png):

![CSS Box Model](css-box-model.png)

When padding or border increase in thickness, the content's size will remain unaffected. If you are observing changes in `content-box`'s size, those padding and border changes **will not trigger any updates**.

Similarly, let's say you have the following element:

```html
<div style="box-sizing: border-box; width: 100px; padding: 10px;">
  ...
</div>
```

Then you change that element's `padding` to `0`. If you are observing changes in this element's `border-box` size, this padding change **will not trigger any updates** because the `border-box` did not change size.
