import pipeline from "../src/index";

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
