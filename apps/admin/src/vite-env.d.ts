/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_JODKIT_SUBJECT: string;
  readonly VITE_API_BASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
