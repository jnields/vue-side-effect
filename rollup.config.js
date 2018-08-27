import babel from 'rollup-plugin-babel';

export default {
  input: './src/index.js',
  output: [
    {
      file: './dist/index.js',
      format: 'cjs',
    },
    {
      file: './dist/index.mjs',
      format: 'es',
    },
  ],
  plugins: [
    babel(),
  ],
};
