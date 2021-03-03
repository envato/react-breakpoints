# Server-Side Rendering

The `widthMatch` and `heightMatch` values returned from [`<Observe>`](api.md#observe) and [`useBreakpoints()`](api.md#usebreakpoints) default to `undefined`. This is the case when:

- the observed min-size isn't specified in your [`options`](api.md#usebreakpoints);
- rendering a component server-side.

You can use this `undefined` value to display your component differently for SSR purposes. How you do it is up to you (loading spinner component, default CSS styles, placeholder content, `null`, etc).

# ⚠️ Beware of [Cumulative Layout Shift](https://web.dev/cls/)

Remember, this is a JavaScript solution to a CSS problem. If you use React Breakpoints to apply different styles to your component based on their size, and you are rendering some HTML server-side, you may end up applying styles to your components that do not match their computed styles once JavaScript loads on the client. This means you could introduce a flash of incorrectly styled content (FOISC?).

Unfortunately, there is no easy way around it: this is the nature of the beast. If you care deeply about [CLS](https://web.dev/cls/) (and for public pages you probably should!), you need to keep this side-effect in mind.

However, React Breakpoints truly shines when you're building highly-responsive dashboards with graphs and tables, each individually responsive and aware of their own sizes. Dashboards for signed-in users generally don't suffer from SEO penalties like CLS, because they are not indexed by search engines.
