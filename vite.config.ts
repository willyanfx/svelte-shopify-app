import { defineConfig } from 'vitest/config';

import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';

if (
	process.env.HOST &&
	(!process.env.SHOPIFY_APP_URL || process.env.SHOPIFY_APP_URL === process.env.HOST)
) {
	process.env.SHOPIFY_APP_URL = process.env.HOST;
	delete process.env.HOST;
}

const host = new URL(process.env.SHOPIFY_APP_URL || 'http://localhost').hostname;

let hmrConfig;
if (host === 'localhost') {
	hmrConfig = {
		protocol: 'ws',
		host: 'localhost',
		port: 64999,
		clientPort: 64999
	};
} else {
	hmrConfig = {
		protocol: 'wss',
		host: host,
		port: parseInt(process.env.FRONTEND_PORT!) || 8002,
		clientPort: 443
	};
}

export default defineConfig({
	server: {
		port: Number(process.env.PORT || 3000),
		hmr: hmrConfig,
		fs: {
			// See https://vitejs.dev/config/server-options.html#server-fs-allow for more information
			allow: ['app', 'node_modules']
		}
	},
	plugins: [tailwindcss(), sveltekit()],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	build: {
		assetsInlineLimit: 0
	}
});
