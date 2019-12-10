# Server-Side Rendering

The values returned from [`useBreakpoints()`](api.md#usebreakpoints) default to `undefined`, which is the case when:

* When the observed min-size isn't specified in your [`options`](api.md#widths);
* Rendering a component server-side.

You can use this `undefined` value to display your component differently for SSR purposes. How you do it is up to you (loading component, default CSS styles, placeholder content, `null`, etc).
