export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: 'Our Map | Mapped Interests | Open Sourced | Crowd Sourced',
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
  /*
   ** Global CSS
   */
  css: [
    '@/assets/css/MarkerCluster.css',
    '@/assets/css/MarkerCluster.Default.css',
    { src: 'leaflet-minimap/dist/Control.MiniMap.min.css', lang: 'css' },
  ],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    { src: '@/plugins/vue2leaflet-marker-cluster.js', mode: 'client' },
    { src: '@/plugins/leaflet-minimap.js', mode: 'client' },
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sitemap',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt/content
    '@nuxt/content',
    '@nuxtjs/strapi',
    // With options
    [
      'nuxt-leaflet',
      {
        /* module options */
      },
    ],
    'nuxt-i18n',
  ],

  strapi: {
    url: process.env.STRAPI_URL || 'http://localhost:1337',
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

  axios: {},

  content: {},

  build: {},
}
