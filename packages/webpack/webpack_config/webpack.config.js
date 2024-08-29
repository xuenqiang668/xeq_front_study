// webpack.config.js
const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // 入口文件
  entry: './src/main.js',
  mode: 'development',

  // 输出配置
  output: {
    // 输出文件名
    filename: 'main.js',
    // 输出路径
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },

  // 加载器配置
  module: {
    rules: [
      // 用于处理 .js 文件
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },

  // 插件配置
  plugins: [
    new htmlWebpackPlugin(),
    // 这里可以添加Webpack插件
  ],

  // 其他配置
  // ...
}
