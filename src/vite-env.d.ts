/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_STREAM_API_KEY: string;
	readonly VITE_STREAM_USER_TOKEN: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}