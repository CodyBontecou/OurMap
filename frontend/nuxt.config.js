import { defineNuxtConfig } from '@nuxt/bridge'

const strapiUrl = 'https://hotspringers-api.herokuapp.com'
// process.env.NODE_ENV === 'development'
//   ? 'http://localhost:1337'
//   : 'https://hotspringers-api.herokuapp.com'

export default defineNuxtConfig({
  target: 'static',
  head: {
    title: 'Hotspringers | Mapped Interests | Open Sourced | Crowd Sourced',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: "Let's map the interesting locations around the globe.",
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/logo.png' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined',
      },
    ],
  },
  css: [
    '@/assets/css/MarkerCluster.css',
    '@/assets/css/MarkerCluster.Default.css',
    { src: 'leaflet-minimap/dist/Control.MiniMap.min.css', lang: 'css' },
  ],
  plugins: [
    { src: '@/plugins/vue2leaflet-marker-cluster.js', mode: 'client' },
    { src: '@/plugins/leaflet-minimap.js', mode: 'client' },
  ],
  components: true,
  buildModules: [],
  modules: ['nuxt-leaflet', '@nuxtjs/tailwindcss'],
  strapi: {
    url: strapiUrl,
    entities: ['locations', 'categories'],
  },
  sitemap: {
    hostname: 'https://hotspringers.netlify.app',
  },
  i18n: {
    baseUrl: 'https://hotspringers.netlify.app',
    lazy: true,
    seo: false,
    detectBrowserLanguage: {
      useCookie: true,
    },
    langDir: 'lang/',
    locales: [
      {
        code: 'en',
        name: 'English',
        iso: 'en-US',
        file: 'en-US.js',
      },
      {
        code: 'es',
        name: 'Español',
        iso: 'es-ES',
        file: 'es-ES.js',
      },
    ],
    defaultLocale: 'en',
    parsePages: false,
    pages: {
      'account/index': {
        en: '/account',
        es: '/cuenta',
      },
      'about/index': {
        en: '/about',
        es: '/sobre',
      },
    },
  },
})
