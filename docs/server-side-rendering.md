# Server-Side Rendering

The `widthMatch` and `heightMatch` values returned from [`<Observe>`](api.md#observe) and [`useBreakpoints()`](api.md#usebreakpoints) default to `undefined`. This is the case when:

* the observed min-size isn't specified in your [`options`](api.md#usebreakpoints);
* rendering a component server-side.

You can use this `undefined` value to display your component differently for SSR purposes. How you do it is up to you (loading component, default CSS styles, placeholder content, `null`, etc).
