//  This file 'webpack.config.js' is part of an example for building a multi-widget React front-end
//  app step by step as outlined in the tutorial blog at
//  http://maratbn.com/blogs/2018/07/02/react-multi-widget/


const path = require('path');

module.exports = {
    entry: [path.join(__dirname, 'webpack_in', 'entry.js'),
            path.join(__dirname, 'webpack_in', 'entry.jsx')],
    module: {
        rules: [{
            test: /\.es$/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['env'],
                    plugins: ['transform-object-rest-spread']
                  }
              }]
          }, {
            test: /\.jsx$/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['env', 'react'],
                    plugins: ['transform-object-rest-spread']
                  }
              }]
          }]
      },
    resolve: {
        alias: {
            //'react':      'preact-compat',
            //'react-dom':  'preact-compat'
          }
      },
    output: {
        path:      path.join(__dirname, 'webpack_out'),
        filename:  'main.js'
      },
    mode: 'production'
  };
