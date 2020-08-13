// Karma configuration

module.exports = function(config) {
  config.set({
    autoWatch: false,
    basePath: "",
    browsers: ["ChromeHeadless"],
    colors: true,
    frameworks: ["jasmine"],
    logLevel: config.LOG_INFO,
    port: 9876,
    reporters: ["progress"],
    singleRun: true,
    files: ["test/**/*.js"],
    preprocessors: {
      'test/**/*.js': ['webpack', 'sourcemap'],
    },
    webpack: {
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.js$/i,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          },
          {
            test: /\.tsx?$/,
            loader: "ts-loader"
          }
        ]
      }
    },

    webpackMiddleware: {
      noInfo: true,
      stats: 'errors-only',
    },
  });
};
