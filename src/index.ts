// First we declare our types.

export type Next = () => void | Promise<void>;
export type Middleware<T> = (context: T, next: Next) => Promise<void> | void;

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
  const execute: Pipe<T>["execute"] = async (ctx: T) => {
    const _handle = async <T>(
      ctx: T,
      middleware: Middleware<T>[]
    ): Promise<void> => {
      if (!middleware.length) return;

      const slice = middleware[0];
      return slice(ctx, async () => await _handle(ctx, middleware.slice(1)));
    };

    return _handle(ctx, middlewares);
  };

  return { use, execute };
}
