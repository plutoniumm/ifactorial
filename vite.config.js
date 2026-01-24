import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from 'vite-imagetools';
import dsv from '@rollup/plugin-dsv';

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
