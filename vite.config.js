import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import dsv from '@rollup/plugin-dsv';
import { defineConfig } from 'vite';

import { sveltePreprocess } from "svelte-preprocess";

const config = defineConfig( {
	preprocess: [ sveltePreprocess( { sourceMap: false } ) ],
	plugins: [
		dsv(),
		enhancedImages(),
		sveltekit(),
	],
	server: { port: 3000 },
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern'
			}
		}
	}
} );

export default config;
