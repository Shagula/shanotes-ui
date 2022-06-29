const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  pwa: {
    workboxOptions: {
      // https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin
      skipWaiting: true,
      clientsClaim: true,
      // importScripts: 'local',
      // importsDirectory: 'js',
      navigateFallback: '/',
      // navigateFallbackBlacklist: [/\/api\//]
    }
  }
})
