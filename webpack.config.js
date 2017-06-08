/**
 * Created by peter on 11/05/2017.
 */

const path = require('path');

module.exports = {

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: path.resolve('./js'),
                loader:'babel-loader',
            },

            {
                test: /(\.css$)/,
                loaders: ['style-loader', 'css-loader']},

            {
                test: /\.(gif|png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000' },
        ],
    },

    entry: path.resolve('./js/3dnotes.js'),

    output: {
        filename: './dist/bundle.js',
    },

    devtool: 'source-map'
};
