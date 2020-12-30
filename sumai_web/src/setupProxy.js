const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app){
  app.use(
      createProxyMiddleware('/api', {
          target: 'http://sumai.co.kr:3306/',
          changeOrigin: true
      })
  )
};