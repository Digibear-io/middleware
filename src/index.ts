// First we declare our types.
export type Next = () => Promise<any> | any;
export type Middleware<T> = (
  context: T,
  next: Next
) => Promise<void | T> | void | T;
export type Pipe<T> = {
  use: (...middlewares: Middleware<T>[]) => void;
  execute: (context: T) => Promise<void | T>;
};

/**
 * Declare a new middleware pipeline.
 * @param middlewares A list of middlewares to add to the pipeline on
 * instantiation.
 */
export function pipeline<T>(...middlewares: Middleware<T>[]): Pipe<T> {
  const stack: Middleware<T>[] = middlewares;

  /**
   * Add middlewares to the pipeline.
   * @param middlewares A list of middlewares to add to the current
   * pipeline.
   */
  const use: Pipe<T>["use"] = (...middlewares) => {
    stack.push(...middlewares);
  };

  /**
   * Execute a pipeline, and move context through each middleware in turn.
   * @param context The contect object to be sent through the pipeline.
   */
  const execute: Pipe<T>["execute"] = async (context) => {
    let prevIndex = -1;

    /**
     * Programatically go through each middleware and apply it to context before
     * either moving on to the next middleware, or returning the final context
     * object.
     * @param index The current count of middleware executions.
     * @param context The context object to send through the
     * middleware pipeline.
     */
    const handler = async (index: number, context: T): Promise<void | T> => {
      if (index === prevIndex) {
        throw new Error("next() already called.");
      }

      if (index === stack.length) return context;

      prevIndex = index;

      const middleware = stack[index];

      if (middleware) {
        await middleware(context, () => handler(index + 1, context));
      }
    };
    const response = await handler(0, context);
    if (response) return response;
  };

  return { use, execute };
}
