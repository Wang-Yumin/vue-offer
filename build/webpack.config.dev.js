const merge = require('webpack-merge');//用于合并两个配置文件的工具
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.config.base.js');
module.exports = merge(common, {
  output: {
    path: "/",//热加载模式不能指定输出的文件地址，它输出的文件会缓存放在这里，你是看不到的，这里必须这样配置
    filename: "[name].js"
  },
  devServer: {//webpack-server的配置
    host: 'localhost',//服务显示的地址localhsot  127.0.0.1  本机的ip地址都可以
    port: 8095,//服务的端口号
    open: true,//服务启动是否打开浏览器，打开的都是默认的浏览器
    contentBase: './',//服务器加载的目录，会自动找到该目录下的index.html文件进行页面展示
    inline: true,//页面刷新方式
    // proxy: {//配置代理，因为我是前后台分离的，所以在调试的时候需要这个代理的配置才能向后台取数据
    //   '/api': {//代理所有的url请求
    //     target: 'http://192.168.101.29:8778',//代理的地址
    //     changeOrigin: true, // 支持跨域
    //     pathRewrite: { // 重写路径: 去掉路径中开头的'/api'
    //       '^/api': ''
    //     }
    //   }
    // }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '开发模式',
      template: './src/index.html',//模板文件
      filename: 'index.html',//打包后生成文件
      hash: true,// 添加hash值解决缓存问题
      chunks: ["index"],
      chunksSortMode: 'manual'
    })
  ],
  devtool: 'inline-source-map'
});
