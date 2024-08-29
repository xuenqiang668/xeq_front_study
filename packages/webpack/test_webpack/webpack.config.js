const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const changeWebpackPlugin = require('./plugin/changeWebpackPlugin')
const ESLintWebpackPlugin = require('eslint-webpack-plugin')
const TestPlugin = require('./plugin/testPlugin')

module.exports = {
  mode: 'development',
  entry: {
    index: './src/main.js',
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: path.resolve(__dirname, './loader/mdLoader.js'),
            options: {
              someOption: 'value',
              anotherOption: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, // 排除node_modules代码不编译
        loader: 'babel-loader',
      },
    ],
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      titie: 'title',
      template: './index.html',
    }),
    new changeWebpackPlugin(),
    new ESLintWebpackPlugin({
      context: path.resolve(__dirname, 'src'),
    }),
    new TestPlugin(),
  ],
}
