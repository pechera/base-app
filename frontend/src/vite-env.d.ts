/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly SERVE_URL: string;
    readonly GOOGLE_CLIENT_ID: string;
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
