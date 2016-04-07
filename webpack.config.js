var webpack = require('webpack'),
    path = require('path'),
    debug = JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
    plugin = [];
if (debug) {
    plugin = [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin()
    ]
} else {
    plugin = [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin()
    ]
}
module.exports = {
    //入口文件
    entry: {
        base: ['./css/style.css', './css/mcbox.less', './lib/jquery.js', './lib/jquery.page.js', './lib/lodash-4.10.min.js', './lib/jquery.dsTab.js', "./lib/d3.v2.js", './lib/minimal.js', './js/action.js', './js/store.js'],
        component: ['./jsx/mcbox_body']
    },
    //输出
    output: {
        path: debug ? 'js' : 'assets',
        publicPath: debug ? './js/' : './assets/',
        libraryTarget: 'umd',  //打包成模块(库),可加装
        umdNamedDefine: true,  //同上
        filename: "[name].js"
    },
    plugins: plugin,
    resolve: {
        //根目录遍历
        root: [process.cwd() + '/lib', process.cwd() + '/node_modules'],
        alias: {
            'react': path.join(__dirname, '/node_modules/react/dist/react.min'),
            'react-dom': path.join(__dirname, '/node_modules/react-dom/dist/react-dom.min'),
            'react-redux': path.join(__dirname, '/node_modules/react-redux/dist/react-redux.min')
        },
        //自动补全后缀
        extensions: ['', '.js', '.jsx', '.css', '.less', '.png', '.jpg']
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loaders: ['babel?optional=runtime'],
                exclude: /(node_modules|assets|lib)/,
            }, {
                test: /\.(less|css)$/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader!autoprefixer-loader!less-loader'
            }, {
                test: /\.(png|jpg|gif)$/,
                exclude: /node_modules/,
                loader: 'url-loader?limit=8192'
            }
        ]
    }
};
