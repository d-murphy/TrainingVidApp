const webpack = require('webpack');
const config = {
    entry:  __dirname + '/scripts/app.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
  
    module: {
        rules: [
            {
            test: /\.(js|jsx)?/,
                exclude: /node_modules/,
                use: 'babel-loader'     
            }        
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
          "React": "react",
        }),
      ]
};
module.exports = config;