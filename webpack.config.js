var webpack = require("webpack");
const path = require("path"); // 首先要引入node.js中path 模块，用于处理文件与目录的路径
// 引入html-webpack-plugin 插件 启动页面
const HtmlWebpackPlugin = require("html-webpack-plugin");

// const HtmlWebpackPlugin = require(require.resolve('html-webpack-plugin', { paths: [process.cwd()] }));

/**
 * const ExtractTextPlugin = require("extract-text-webpack-plugin");
 * 上面的插件好像不适合webpack最新版了
 * 下面的适合
 * const MiniCssExtractPlugin = require('mini-css-extract-plugin')
 *
 */
// 分离css
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  //入口
  entry: path.join(__dirname, "./src/main.js"),
  //输出文件
  output: {
    path: path.resolve(__dirname, "./dist"), // 指定出口文件的路径目录
    filename: "bundle.js",
    // publicPath: "dist/",
    // filename: "[name].[hash].js", // 将入口文件重命名为带有20位的hash值的唯一文件
    // path:所有输出文件的目标路径;
    // publicPath:输出解析文件的目录，url 相对于 HTML 页面
  },
  module: {
    rules: [
      // 在webpack2中，loaders 被替换成了 rules 其实就是loader的规则
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        // use: ExtractTextPlugin.extract({ 好像报错！
        //   fallback: "style-loader",
        //   use: "css-loader"
        // })
        // test 说明了当前 loader 能处理那些类型的文件
        // use 则指定了 loader 的类型。
        // 注意：数组中的loader不能省略扩展名
      },

      {
        test: /\.scss$/,
        // 注意 是sass-loader ，不是 scss-loader
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      // // 实现 less 打包
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      // 实现 url 资源打包
      {
        // 图片和字体文件使用 url-loader 来处理
        test: /\.(png|jpg|gif|ttf|eot|woff|woff2|svg)$/,
        use: [
          {
            loader: "url-loader",
            // options 为可以配置的选项
            options: {
              limit: 8192,
              // limit=8192表示将所有小于8kb的图片都转为base64形式（为什么呢？因为一个很小的图片，不值当的去发送一个请求，减少请求次                               数。）
              // （其实应该说超过8kb的才使用 url-loader 来映射到文件，否则转为dataurl形式）
            },
          },
        ],
        //保证输出的图片名称与之前命名的图片名称保持一致(目前只是支持这样的写法，webpack3 没有响应的options进行配置)
        // use:'url-loader?limit=8192&name=imgs/[name].[ext]'
      },
    ],
  },
  devServer: {
    // 这是配置 dev-server 命令参数的第二种形式，相对来说，这种方式麻烦一些
    //  --open --port 3000 --contentBase src --hot
    open: true, // 自动打开浏览器
    port: 3000, // 设置启动时候的运行端口
    contentBase: "src", // 指定托管的根目录
    hot: true, // 启用热更新
  },
  plugins: [
    // 配置插件的节点
    new webpack.HotModuleReplacementPlugin(), // new 一个热更新的 模块对象， 这是 启用热更新的第 3 步
    // new HtmlWebpackPlugin({ // 创建一个 在内存中 生成 HTML  页面的插件  --加了报错
    //   template: path.join(__dirname, './src/index.html'), // 指定 模板页面，将来会根据指定的页面路径，去生成内存中的 页面
    //   filename: 'index.html' // 指定生成的页面的名称
    // }),
    new ExtractTextPlugin("s.css")
  ],
};
