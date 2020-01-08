# Observing boxes vs. Matching boxes

There is an important distinction between the `box` you're observing and `box`es triggering breakpoints.

> You can observe a box on an element, and then respond to changes in **another** box of that element.

There might be cases where observing the same box you're matching breakpoints against is not desirable. **This package supports observing and matching on different boxes.**

## Example

In this example, the `border-box` of an element is observed. Any changes to this box's size will update the return values from [`useBreakpoints()`](api.md#usebreakpoints). However, that same `useBreakpoints()` is matching against `device-pixel-content-box` to orchestrate the component's logic.

```javascript
import { Observe, useBreakpoints } from '@envato/react-breakpoints';

const MyObservedElementComponent = () => (
  <Observe
    render={({ observedElementProps }) => (
      <div {...observedElementProps}>
        <MyResponsiveComponent />
      </div>
    )}
    box='border-box' // changes to this box's size will be propagated
  />
);

const MyResponsiveComponent = () => {
  const options = {
    widths: {
      0: 'small',
      1000: 'large'
    },
    box: 'device-pixel-content-box' // above widths are matches against this box
  };

  const [label] = useBreakpoints(options);

  return (
    <div className={label}>
      This element is currently within the {label} range.
    </div>
  );
};
```

# ⚠️ Important

A change in the size of one given `box` does not always mean that the element's other `box`es have also changed size.

Consider the [CSS box model](https://en.wikipedia.org/wiki/CSS_box_model#/media/File:Boxmodell-detail.png):

![CSS Box Model](css-box-model.png)

When padding or border increase in thickness, the content's size will remain unaffected. If you are observing changes in `content-box`'s size, those padding and border changes will not trigger any updates.

Similarly, let's say you have the following element:

```html
<div style="box-sizing: border-box; width: 100px; padding: 10px;">
  ...
</div>
```

Then you change that element's `padding` to `0`. If you are observing changes in this element's `border-box` size, this padding change will not trigger any updates because the `border-box` did not change size.