# @digibear/middleware

This is a middleware engine written in typescript that I've used on a couple of projects now. I've decided to turn it into it's own module for future reuse.

## Installation

`yarn add @udigibear/middleware`

## Usage

When you call the pipline function and assign it to a variable, you are able to pass a coma seperated list of middleware functions to add to the middleware queue.

```JS
import { pipeline } from "@digibear/middleware";

interface Context {
    [key: string]: any
}

const engine = pipeline<Context>((ctx, next) => {
    ctx.foobar="baz";
    next();
})
```

Not all middleware has to be added when the factory function is first invoked. Instead, you can assign middldeware to the system later with the `use` method.

```js
engine.use((ctx, next) => {
  ctx.another = 123;
  next();
});
```

Then when we're ready to run the middleware engine, we'll create it's it's initial context, and then pass that context to the engine for processing.

```js
(async () => {
  const context: Context = {};
  await engine.exec(context);
  console.log(context);
})();

// => { foobar: "baz", another: 123 }
```

## Development

`yarn -Dev install`

## Testing

`yarn test`

## License

MIT
