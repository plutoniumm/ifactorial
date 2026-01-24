import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from 'vite-imagetools';
import dsv from '@rollup/plugin-dsv';
import { defineConfig } from 'vite';

import autoProcess from "svelte-preprocess";

const config = defineConfig( {
	preprocess: [ autoProcess( { sourceMap: false } ) ],
	plugins: [
		dsv(),
		sveltekit(),
		imagetools()
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
