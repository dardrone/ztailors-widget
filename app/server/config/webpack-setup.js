var fs = require('fs');
var path = require('path');

module.exports = function (app) {

    if (process.env.NODE_ENV === 'local') {
        var webpack = require('webpack');
        var config = require(path.join(__dirname, '../../../webpack.dev'));
        var compiler = webpack(config);

        app.use(require('webpack-dev-middleware')(compiler, {
            noInfo: true,
            publicPath: config.output.publicPath
        }));

        app.use(require('webpack-hot-middleware')(compiler));
    } else {
        fs.readFile(path.join(__dirname, './webpack-assets.json'), 'utf8', function (err, data) {
            if (err) {
                throw err;
            }
            app.locals.assets = JSON.parse(data);
        });
    }
};