import {defineConfig} from 'vite';
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig({
    plugins: [
        commonjs(),
    ],
});

module.exports = {
    root: '.',
    build: {
        outDir: 'docs', // to allow GitHub Pages to serve the site
        emptyOutDir: true,
        minify: false, // for debugging
    }
}

