import { sveltekit } from '@sveltejs/kit/vite';
import dsv from '@rollup/plugin-dsv';
import { imagetools } from 'vite-imagetools'

import autoProcess from "svelte-preprocess";

const config = {
	preprocess: [ autoProcess( { sourceMap: false } ) ],
	plugins: [
		dsv(),
		sveltekit(),
		imagetools()
	],
	server: { port: 3000 }
};

export default config;
