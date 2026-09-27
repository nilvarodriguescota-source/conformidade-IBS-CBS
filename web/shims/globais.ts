import { Buffer } from "buffer";

export const process = {
  cwd: () => "/app",
  env: { NODE_ENV: "production" } as Record<string, string | undefined>,
  argv: [] as string[],
  platform: "browser",
  versions: {} as Record<string, string>,
  nextTick: (f: (...a: unknown[]) => void, ...a: unknown[]) => queueMicrotask(() => f(...a)),
};

export { Buffer };
