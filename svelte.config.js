import { sveltePreprocess } from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';

export default {
	preprocess: sveltePreprocess( { sourceMap: false } ),
	kit: {
		alias: {
			"@components": "/src/components",
			"@images": "/src/images"
		},
		adapter: adapter(),
		prerender: {
			handleHttpError: 'fail'
		}
	}
}