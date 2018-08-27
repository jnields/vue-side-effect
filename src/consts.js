export const CONTEXT_KEY = 'vue-helmet-context';
export const isServer = typeof window === 'undefined';
export const isProd = process.env.NODE_ENV === 'production';
