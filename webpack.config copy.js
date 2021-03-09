var webpack = require("webpack");
const path = require("path"); // 首先要引入node.js中path 模块，用于处理文件与目录的路径
// 引入html-webpack-plugin 插件
// const HtmlWebpackPlugin = require("html-webpack-plugin");

const {resolve} = require('path')
const HtmlWebpackPlugin = require(require.resolve('html-webpack-plugin', { paths: [process.cwd()] }));

/**
 * const ExtractTextPlugin = require("extract-text-webpack-plugin");
 * 上面的插件好像不适合webpack最新版了
 * 下面的适合
 * const MiniCssExtractPlugin = require('mini-css-extract-plugin')
 *
 */
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  //入口
  entry:path.join(__dirname, './src/main.js'),
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
        // test 说明了当前 loader 能处理那些类型的文件
        // use 则指定了 loader 的类型。
        // 注意：数组中的loader不能省略扩展名
      },

      {
        test: /\.scss$/,
        // 注意 是sass-loader ，不是 scss-loader
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      // 实现 less 打包
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
      // 实现 ES6转 ES5
      // {
      //   test: /\.js$/,
      //   exclude: /(node_modules)/, // exclude 排除的意思，把 node_modules文件夹排除编译之外
      //   use: {
      //     loader: "babel-loader",
      //     options: {
      //       // presets 预设列表（一组插件）加载和使用
      //       presets: ["env"],
      //       plugins: ["transform-runtime"], // 加载和使用的插件列表
      //     },
      //   },
      // },
      //ExtractTextPlugin 兼容性问题4x++5x
      {
        test: /\.(le|c)ss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "postcss-loader",
              options: {
                ident: "postcss",
                plugins: [require("autoprefixer")()],
              },
            },
            {
              loader: "less-loader",
            },
          ],
        }),
      },
      //MiniCssExtractPlugin
    //   {
    //     test: /\.(le|c)ss$/,
    //     use: [
    //       MiniCssExtractPlugin.loader,
    //       {
    //         loader: "css-loader",
    //       },
    //       {
    //         loader: "postcss-loader",
    //         options: {
    //           ident: "postcss",
    //           plugins: [require("autoprefixer")()],
    //         },
    //       },
    //       {
    //         loader: "less-loader",
    //       },
    //     ],
    //   },
    ],
  },
  devServer: {
    // contentBase: './dist', // 在 localhost:8080(默认) 下建立服务，将 dist 目录下的文件，作为可访问文件  contentBase：告诉服务器从哪里提供内容
    // 或者通过以下方式配置
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    // 当它被设置为true的时候对所有的服务器资源采用gzip压缩
    // 对JS，CSS资源的压缩率很高，可以极大得提高文件传输的速率，从而提升web性能
    port: 9000, // 如果想要改端口，可以通过 port更改
    hot: true, // 启用 webpack 的模块热替换特性()
    inline: true, // 实现实时重载（实现自动刷新功能）默认情况下是 true。
    host: "localhost", // 如果你希望服务器外部可访问，指定使用一个 host。默认是 localhost(也就是你可以不写这个host这个配置属性)。
  },
  //   plugins: [new webpack.BannerPlugin("菜鸟教程 webpack 实例")],
  plugins: [
    new HtmlWebpackPlugin({
      title: "首页", // 用于生成的HTML文档的标题
      filename: "index.html", //写入HTML的文件。默认为index.html。也可以指定一个子目录（例如：）assets/admin.html
      template: "src/index.html", // Webpack需要模板的路径
    }),
    new webpack.HotModuleReplacementPlugin(), // 需要结合 启用热替换模块(Hot Module Replacement)，也被称为 HMR
  ],
};
