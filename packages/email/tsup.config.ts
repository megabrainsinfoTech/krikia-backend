import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  ...options,
  splitting: false,
  sourcemap: true,
  clean: true,
}));
