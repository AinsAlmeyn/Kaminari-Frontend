const webpack = require('webpack');

module.exports = function override(config, env) {
    // Webpack'in Node.js çekirdek modüllerine otomatik polifil ekleme davranışını değiştirmek için
    config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        "buffer": require.resolve("buffer/"),
        "timers": require.resolve("timers-browserify")
    };

    // Buffer global değişkenini sağlamak için
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        })
    ]);

    return config;
};
