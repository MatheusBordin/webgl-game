const path = require('path');
const webpack = require('webpack');

module.exports = env => {
    const isProduction = env && env.production;

    return {
        mode: isProduction ? 'production' : 'development',
        entry: './src/index.ts',
        devtool: 'inline-source-map',
        module: {
            rules: [{
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }]
        },
        devServer: {
            publicPath: '/',
            contentBase: path.join(__dirname, 'dist'),
            compress: true,
            overlay: true,
            port: 9000
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ],
        resolve: {
            extensions: [ '.tsx', '.ts', '.js' ]
        },
        output: {
            filename: 'game.js',
            path: path.resolve(__dirname, 'dist')
        }
    }
};