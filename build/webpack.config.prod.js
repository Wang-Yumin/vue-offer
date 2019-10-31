const merge = require('webpack-merge');//用于合并两个配置文件的工具
const common = require('./webpack.config.base.js');//加载之前定义的配置文件
const HtmlWebpackPlugin = require('html-webpack-plugin');//可以将你所有配置好的东西打包成一个html文件
const path = require("path");
module.exports = merge(common, {
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[contenthash].js',//[hash]是为了避免js缓存
  },
  plugins: [
    new HtmlWebpackPlugin({//要使用就必须得new出来
      title: '生产模式',//生成的html文件的title
      template: './src/index.html',//生成的html文件可以使用定义好的模板，生成好的html文件会继承模板的所有内容，同时如果模板里面定义好了title，上面的title配置是不会生效的
      filename: 'index.html',//生成的title文件的名称
      hash: true,//是否产生hash值
      chunks: ["index"],//加载那些js文件，这个js文件就是输出的js文件名
      chunksSortMode: 'manual'//排序方式
    })
  ],
  devtool: 'inline-source-map'//开启控制台输出错误信息具体在哪行
});
