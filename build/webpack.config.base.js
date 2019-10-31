const path = require("path");
const { VueLoaderPlugin } = require('vue-loader');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');//打包进度条

module.exports = {
  entry: {
    // index: "../src/main.js"  //webpack的入口文件，指定将哪个文件进行打包
    index: path.resolve(__dirname, '../src/main.js'),  //webpack的入口文件，指定将哪个文件进行打包
  },
  module: {
    rules: [
      {
        test: /\.vue$/,//vue文件加载器
        use: ['vue-loader']
      },
      {
        test: /\.js$/,//js文件加载器
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,//lsaa文件加载器
        loaders: ["style-loader", "css-loader", "less-loader"]
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,//css文件加载器
        loaders: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpeg|jpg|gif|ttf|woff)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: "[name].[ext]",
              outputPath: "img",
            }
          }
        ]
      },
    ]
  },
  plugins: [
    // 添加VueLoaderPlugin，以响应vue-loader
    new VueLoaderPlugin(),
    new ProgressBarPlugin()//打包进度条
  ]
};
