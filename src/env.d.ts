/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly R2_ACCOUNT_ID: string;
  readonly R2_ACCESS_KEY_ID: string;
  readonly R2_SECRET_ACCESS_KEY: string;
  readonly R2_BUCKET_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
