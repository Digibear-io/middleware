import { pipeline } from "../src/index";

interface TestContext {
  [key: string]: any;
}

test("Creates a new middleware pipeline.", async () => {
  const engine = pipeline<TestContext>((ctx, next) => {
    ctx.foobar = "baz";
    next();
  });

  const ctx = {};
  await engine.execute(ctx);
  expect(ctx).toHaveProperty("foobar");
});

test("Context is correct when using async middleware", async () => {
  const engine = pipeline<TestContext>(async (ctx, next) => {
    ctx.foobar = "baz";
    await next();
  });

  engine.use(async (ctx, next) => {
    ctx.another = 123;
    await new Promise((res) => setTimeout(res, 2000));
    next();
  });

  engine.use(async (ctx, next) => {
    ctx.three = 123;
    await new Promise((res) => setTimeout(res, 2000));
    next();
  });

  const context: TestContext = {};
  await engine.execute(context);
  expect(context.three).toEqual(123);
});

test("Context is correct when using async middleware", async () => {
  type TestContext = { [key: string]: any };

  const engine = pipeline<TestContext>(async (ctx, next) => {
    ctx.foobar = "baz";
    await new Promise((res) => setTimeout(res, 2000)); // Mock a real-world async function
    next();
  });

  engine.use(async (ctx, next) => {
    ctx.another = 123;
    await new Promise((res) => setTimeout(res, 2000)); // Mock a real-world async function
    next();
  });

  const context: TestContext = {};
  await engine.execute(context);
  console.log(context);
  expect(context.another).toEqual(123);
});
