
const { API_HOST, TOKEN_KEY, DOMAIN, API_KEY, FILE_PATH, GOOGLE_MAPS_API_KEY, API_HOST_TRANSPORT, FILE_PATH_TRANSPORT } = process.env

import { createResolver } from "@nuxt/kit";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  // Enable server-side rendering
  ssr: false,

  // TypeScript configuration
  typescript: {
    shim: false,
  },

  // Vuetify build configuration
  build: {
    transpile: ["vuetify"],
  },

  // Modules
  modules: [
    "@pinia/nuxt",
    '@nuxt-alt/proxy',
    'pinia-plugin-persistedstate/nuxt',
  ],

  // Application metadata
  app: {
    head: {
      title: "On Farm Off Farm - PTPN I",
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo-ptpn1.png' }, // Favicon ditambahkan di sini
      ],
      script: [
        // Preload Google Maps API
        {
          src: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY || 'AIzaSyArNRBs8AoRkevLgqnOrGoR09-cJPL5PIA'}&libraries=places,geometry`,
          async: true,
          defer: true,
        }
      ],
      meta: [
        // Add meta tags for better SEO and performance
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' }
      ]
    },
  },

  // CSS configuration
  css: [
    // Add any global CSS if needed
  ],

  // Vite configuration
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    // Define global variables for Google Maps
    define: {
      global: 'globalThis',
    },
    optimizeDeps: {
      include: ['google-maps']
    }
  },

  // Nitro configuration
  // nitro: {
  //   serveStatic: true,
  // },

  proxy: {
    enableProxy: true,
    proxies: {
      "/api": {
        target: API_HOST,
        changeOrigin: true,
        rewrite: (path: any) => path.replace(/^\/api/, "/v1/"),
      },
      "/files": {
        target: API_HOST,
        changeOrigin: true,
        rewrite: (path: any) => path.replace(/^\/files/, "/files/"),
      },
     "/transport": {
        target: API_HOST_TRANSPORT,
        changeOrigin: true,
        rewrite: (path:any) =>  path.replace(/^\/transport/, "/v1/"),
      },
    },
  },

  // Dev server handlers
  devServerHandlers: [],
  
  compatibilityDate: "2024-09-06",
  
  runtimeConfig: {
    public: {
      tokenKey: TOKEN_KEY,
      apiBase: '/api',
      apiTransportBase: '/transport',
      baseUrl: API_HOST,
      baseTransportUrl: API_HOST_TRANSPORT,
      domain: DOMAIN,
      apiKey: API_KEY,
      filePath: FILE_PATH,
      filePathTransport: FILE_PATH_TRANSPORT,
      googleMapsApiKey: GOOGLE_MAPS_API_KEY || 'AIzaSyArNRBs8AoRkevLgqnOrGoR09-cJPL5PIA', // Add Google Maps API key
    }
  },

  // Plugins
  plugins: [
    // Add Google Maps plugin if needed
    '~/plugins/google-maps.client.js'
  ]
});