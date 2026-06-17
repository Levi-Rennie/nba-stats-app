/// <reference types="vite/client" />

// Tell TypeScript about our custom env var. Vite's built-in ImportMetaEnv only
// declares standard keys (MODE, DEV, PROD, ...) with no index signature, so
// without this augmentation `import.meta.env.VITE_BDL_API_KEY` is a type error.
// This merges into Vite's interface (declaration merging) rather than replacing it.
interface ImportMetaEnv {
  readonly VITE_BDL_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
