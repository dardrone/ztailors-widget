var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

require('dotenv').load({
    silent: true
});

module.exports = {
    entry: [
        'webpack-hot-middleware/client',
        './app/client/zwidget.js'
    ],
    output: {
        path: path.join(__dirname, 'public/assets/'),
        filename: 'zwidget.min.js',
        publicPath: 'http://localhost:9001/assets/'
    },
    eslint: {
        configFile: './.eslintrc',
        quiet: true,
        failOnWarning: false
    },
    module: {
        loaders: [
            { test: /.js?$/, loader: 'babel', exclude: /node_modules/},
            { test: /.js?$/, loader: 'eslint-loader', exclude: /node_modules/},
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('css!sass?outputStyle=expanded&sourceComments=true'),
                exclude: /node_modules/
            },
            {test: /\.css$/, loader: 'style!css'},
            {test: /\.(ttf|eot|otf|gif|png|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader'},
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?limit=10000&minetype=application/font-woff'
            }
        ],
        noParse: [/braintree-web/]
    },
    styleLoader: require('extract-text-webpack-plugin').extract('style-loader', 'css-loader!less-loader'),
    plugins: [
        new ExtractTextPlugin('style.css'),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            ZAPI_URL: JSON.stringify(process.env.ZAPI_URL),
            ZAPI_CLIENT_KEY: JSON.stringify(process.env.ZAPI_CLIENT_KEY),
            ZAPI_CLIENT_SECRET: JSON.stringify(process.env.ZAPI_CLIENT_SECRET),
            SMARTYSTREETS_URL: JSON.stringify(process.env.SMARTYSTREETS_URL),
            SMARTYSTREETS_AUTH_ID: JSON.stringify(process.env.SMARTYSTREETS_AUTH_ID),
            SMARTYSTREETS_AUTH_TOKEN: JSON.stringify(process.env.SMARTYSTREETS_AUTH_TOKEN),
            GOOGLE_ANALYTICS_CODE: JSON.stringify(process.env.GOOGLE_ANALYTICS_CODE),
            CUSTOMER_SERVICE_PHONE_NUMBER: JSON.stringify(process.env.CUSTOMER_SERVICE_PHONE_NUMBER),
            ZTAILORS_SERVICES_URL: JSON.stringify(process.env.ZTAILORS_SERVICES_URL),
            ZTAILORS_URL: JSON.stringify(process.env.ZTAILORS_URL)
        })
    ],
    devtool: 'eval'
};
