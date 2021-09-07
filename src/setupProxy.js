const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    console.log("setting proxy");
    app.use(
        '/server',
        createProxyMiddleware({
            target: 'http://localhost:80',
            changeOrigin: true,
        })
    );
};
