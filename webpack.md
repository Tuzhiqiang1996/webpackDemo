## webpack 使用与打包原理

3/8/2021 7:13:08 PM

#### 打包原理

---

- webpack 打包原理是根据文件间的依赖关系对其进行静态分析，然后将这些模块按指定规则生成静态资源，当 webpack 处理程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。
- webpack 有两种组织模块的依赖方式，同步、异步。异步依赖将作为分割点，形成一个新的块；在优化了依赖树之后，每一个异步区块都将作为一个文件被打包。
- 至于你的代码使用的是 commonjs 还是 amd 或者 es6 的 import。webpack 都会对其进行分析。来获取代码的依赖。
- webpack 做的就是分析代码。转换代码，编译代码，输出代码。webpack 本身是一个 node 的模块，所以 webpack.config.js 是以 commonjs 形式书写的(node 中的模块化是 commonjs 规范的)
- webpack 中每个模块有一个唯一的 id，是从 0 开始递增的。整个打包后的 bundle.js 是一个匿名函数自执行。参数则为一个数组。数组的每一项都为个 function。function 的内容则为每个模块的内容，并按照 require 的顺序排列。

  ![](https://img-blog.csdnimg.cn/20181126150212236.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3lhb2NvbmcxOTkz,size_16,color_FFFFFF,t_70)

### webpack 核心概念：

- Entry

> 入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。每个依赖项随即被处理，最后输出到称之为 bundles 的文件中。

- Output

> output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist。基本上,整个应用程序结构，都会被编译到指定的输出路径的文件夹中

- Module

> 模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。

- Chunk

> 代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。

- Loader

> loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。
> loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后就可以利用 webpack 的打包能力，对它们进行处理。
> 本质上，webpack loader 将所有类型的文件，转换为应用程序的依赖图（和最终的 bundle）可以直接引用的模块。

### webpack 使用

[参考 1](https://www.runoob.com/w3cnote/webpack-tutorial.html)
[参考 2](https://www.cnblogs.com/fps2tao/p/10879910.html)
[参考 3](https://www.cnblogs.com/ywsun/articles/11563562.html)
[参考 4](https://www.cnblogs.com/wangqi2019/p/14338492.html)

### 一、webpack 介绍

#### 1、由来

由于前端之前 js、css、图片文件需要单独进行压缩和打包，这样团队人员处理很繁琐，然后 Instagram 团队就想让这些工作自动化，然后 webpack 应运而生。

#### 2、介绍

webpack 是一个模块打包器（module bundler），webpack 视 HTML，JS，CSS，图片等文件都是一种 资源 ，每个资源文件都是一个模块（module）文件，webpack 就是根据每个模块文件之间的依赖关系将所有的模块打包（bundle）起来。

#### 3、作用

对 CommonJS 、 AMD 、ES6 的语法做了兼容
对 js、css、图片等资源文件都支持打包（适合团队化开发）
比方你写一个 js 文件，另外一个人也写一个 js 文件，需要合并很麻烦，现在交给 webpack 合并很简单
有独立的配置文件 webpack.config.js
可以将代码切割成不同的 chunk，实现按需加载，降低了初始化时间
具有强大的 Plugin（插件）接口，大多是内部插件，使用起来比较灵活

#### 4、拓展说明

CommonJS、AMD、CMD 是用于 JavaScript 模块管理的三大规范，CommonJS 定义的是模块的同步加载，是一个更偏向于服务器端的规范（也可以在浏览器中使用），主要用于 Nodejs，根据 CommonJS 规范，一个单独的文件就是一个模块，加载模块使用 require()方法，该方法读取一个文件并执行，最后返回文件内部的 exports 对象。

AMD 和 CMD 则是定义模块异步加载适用于浏览器端，都是为了 JavaScript 的模块化开发，（这里说一下为什要有异步加载，因为浏览器如果使用 common.js 同步加载模块的话，就会导致性能等问题，所以针对这个问题，又出了一个规范，这个规范可以实现异步加载依赖模块）

AMD 规范会提前加载依赖模块，AMD 规范是通过 requireJs 在推广过程中对模块定义的规范化产出。（AMD 规范：https://github.com/amdjs/amdjs-api/wiki/AMD）

CMD 规范会延迟加载依赖模块， CMD 规范是 SeaJs 在推广过程中对模块定义的规范化产出。

（CMD 规范：https://github.com/seajs/seajs/issues/242）

- AMD 规范和 CMD 规范的区别

对于依赖的模块，AMD 是提前执行，CMD 是延迟执行。不过 RequireJS 从 2.0 开始，也改成可以延迟执行（根据写法不同，处理方式不同）
CMD 推崇依赖就近，AMD 推崇依赖前置
AMD 的 API 默认是一个当多个用，CMD 的 API 严格区分，推崇职责单一。比如 AMD 里，require 分全局 require 和局部 require，都叫 require。CMD 里，没有全局 require，而是根据模块系统的完备性，提供 seajs.use 来实现模块系统的加载启动。CMD 里，每个 API 都简单纯粹

- webpack 和 gulp 的区别

gulp 是前端自动化构建工具，强调的是前端开发的工作流程，我们可以通过配置一系列的 task，定义 task 处理的事情（代码压缩、合并、编译、浏览器实时更新等），然后定义执行顺序，来让 gulp 执行这些 task，从而构建项目的整个前端开发流程，自动化构建工具并不能把所有模块打包到一起，也不能构建不同模块之间的依赖关系。
webpack 是 JavaScript 应用程序的模块打包器，强调的是一个前端模块化方案，更侧重模块打包，我们可以把开发中的所有资源（图片、js 文件、css 文件等）都看成模块，通过 loader（加载器）和 plugins（插件）对资源进行处理，打包成符合生产环境部署的前端资源。

#### 5、webpack 整体认知

​ (1)、webpack 的核心概念分为 入口(Entry)、加载器(Loader)、插件(Plugins)、出口(Output);
![](https://img2018.cnblogs.com/blog/548763/201905/548763-20190517094932584-1474441094.png)

1. 入口(Entry)：入口起点告诉 webpack 从哪里开始，并根据依赖关系图确定需要打包的文件内容
2. 加载器(Loader)：webpack 将所有的资源（css, js, image 等）都看做模块，但是 webpack 能处理的只是 JavaScript，因此，需要存在一个能将其他资源转换为模块，让 webpack 能将其加入依赖树中的东西，它就是 loader。loader 用于对模块的源代码进行转换。loader 可以使你在 import 或”加载”模块时预处理文件。因此，loader 类似于其他构建工具中“任务(task)”，并提供了处理前端构建步骤的强大方法。

`rules: [ { test: /\.(js|jsx)$/, use: 'babel-loader' } ]`

3. 插件(Plugins)：loader 只能针对某种特定类型的文件进行处理，而 plugin 的功能则更为强大。在 plugin 中能够介入到整个 webpack 编译的生命周期，Plugins 用于解决 loader 无法实现的其他事情，也就是说 loader 是预处理文件，那 plugin 就是后处理文件

对 loader 打包后的模块文件（bundle.js）进行二次优化处理，例如：代码压缩从而减小文件体积

提供辅助开发的作用：例如：热更新（浏览器实时显示）

plugins: [
new webpack.optimize.UglifyJsPlugin(),
new HtmlWebpackPlugin({template: './src/index.html'})
]

- 安装 Webpack

```
npm install webpack webpack-cli -D
```

- 在项目中安装最新版本或特定版本，分别执行以下命令：

```
npm install --save-dev webpack
npm install --save-dev webpack@<version>
```

> 对文件打包

- css 打包

```js
npm install css-loader style-loader --save-dev
或者
cnpm install css-loader style-loader --save-dev
```

在 module 中配置

```js
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
  ];
}
```

- scss 打包

```
npm install sass-loader node-sass webpack --save-dev
或者
cnpm install sass-loader css-loader style-loader node-sass webpack --save-dev
```

在 module 中配置

```js
module: {
  rules: [
    //.......
    {
      test: /\.scss$/,
      // 注意 是sass-loader ，不是 scss-loader
      use: ["style-loader", "css-loader", "sass-loader"],
    },
  ];
}
```

- less 打包

```
cnpm install --save-dev
cnpm install less less-loder css-loader style-loader  webpack --save-dev
或者
cnpm install less-loader less --save-dev

```

在 module 中配置

```js
module: {
  rules: [
    //.......
    // 实现 less 打包
    {
      test: /\.less$/,
      use: ["style-loader", "css-loader", "less-loader"],
    },
  ];
}
```

- 打包 url 资源（图片、gif、图标等）功能

  > 如果我们希望在页面引入图片（包括 img 的 src 和 background 的 url）。当我们基于 webpack 进行开发时，引入图片会遇到一些问题。
  > ​ 其中一个就是引用路径的问题。拿 background 样式用 url 引入背景图来说，我们都知道，webpack 最终会将各个模块打包成一个文件，因此我们样式中的 url 路径是相对入口 html 页面的，而不是相对于原始 css 文件所在的路径的。这就会导致图片引入失败。这个问题是用 file-loader 解决的，file-loader 可以解析项目中的 url 引入（不仅限于 css），根据我们的配置，将图片拷贝到相应的路径，再根据我们的配置，修改打包后文件引用路径，使之指向正确的文件。
  > ​ 另外，如果图片较多，会发很多 http 请求，会降低页面性能。这个问题可以通过 url-loader 解决。url-loader 会将引入的图片编码，生成 dataURl。相当于把图片数据翻译成一串字符。再把这串字符打包到文件中，最终只需要引入这个文件就能访问图片了。当然，如果图片较大，编码会消耗性能。因此 url-loader 提供了一个 limit 参数，小于 limit 字节的文件会被转为 DataURl，大于 limit 的还会使用 file-loader 进行 copy。
  > ​ url-loader 和 file-loader 是什么关系呢？简答地说，url-loader 封装了 file-loader。url-loader 不依赖于 file-loader，即使用 url-loader 时，只需要安装 url-loader 即可，不需要安装 file-loader，因为 url-loader 内置了 file-loader。通过上面的介绍，我们可以看到，url-loader 工作分两种情况：1.文件大小小于 limit 参数，url-loader 将会把文件转为 DataURL；2.文件大小大于 limit，url-loader 会调用 file-loader 进行处理，参数也会直接传给 file-loader。因此我们只需要安装 url-loader 即可。

```
cnpm install
cnpm install url-loader file-loader --save-dev
```

在 module 中配置

```js
module: {
  rules: [
    //.......
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
  ];
}
```

> 结合后端服务器的热替换配置 Webpack-dev-server

webpack-dev-server 提供了一个简单的 web 服务器，并且能够实时重新加载(live reloading)，同时把生成好的 js 和 html 构建到我们的电脑内存中，这样的话，即使我们的目录中没有了相关 js 等文件，还能够加载出来，这样能够提高我们页面运行速度。

安装 webpack-dev-server 插件

```
cnpm install
cnpm install webpack-dev-server --save-dev
```

```js

   module:{
        rules:[
            //.......
        ]
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
         host: "localhost" // 如果你希望服务器外部可访问，指定使用一个 host。默认是 localhost(也就是你可以不写这个host这个配置属性)。
     }
```

> ES6 转换为 ES5 语法

```
cnpm install --save-dev babel-loader babel-core babel-preset-env
```

babel-core 如果某些代码需要调用 Babel 的 API 进行转码，就要使用 babel-core 模块
babel-preset-env 通过根据您的目标浏览器或运行时环境自动确定您需要的 Babel 插件
babel 对一些公共方法使用了非常小的辅助代码，比如 \_extend。 默认情况下会被添加到每一个需要它的文件中,你可以引入 babel runtime 作为一个独立模块，来避免重复引入。

你必须执行 npm install babel-plugin-transform-runtime --save-dev 来把它包含到你的项目中，也要使用 npm install babel-runtime --save 把 babel-runtime 安装为一个依赖

```js

   module:{
        rules:[
            //.......
             // 实现 ES6转 ES5
                    {
                        test: /\.js$/,
                        exclude: /(node_modules)/,  // exclude 排除的意思，把 node_modules文件夹排除编译之外
                        use: {
                            loader: 'babel-loader',
                            options: {
                            // presets 预设列表（一组插件）加载和使用
                            presets: ['env'],
                            plugins: ['transform-runtime'] // 加载和使用的插件列表
                            }
                        }
                    }
        ]
    },

```

> 抽取 CSS 为单独文件

```

npm install --save-dev extract-text-webpack-plugin
```

```js
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module:{
        rules:[
            //.......
          // 提取 css模块（如果使用这个模块的话，需要把之前的CSS打包模块注释掉，不然会重复）
1.
               {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
2.
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
        ]
    },

```

> 开发环境和生产环境的分离

1. 因为 webpack 默认找的是 webpack.config.js 配置文件，所以要把开发环境的 webpack.config.js 配置文件改为 webpack.dev.config.js 代表开发环境的配置文件。

2. 新建一个 webpack.prod.config.js，再把开发环境中的 webpack.config.js 复制进去（没用的配置文件该删除的删除）

3. 修改 package.json 文件（在 scripts 标签中添加"dev"和"prod" 属性配置）

```json
"scripts": {
"test": "echo \"Error: no test specified\" && exit 1",
"dev": "webpack --config webpack.dev.config.js",
"prod": "webpack --config webpack.prod.config.js"
},
```

```
执行开发环境的中配置
npm run dev
执行生产环境的中配置
npm run prod
```

> 在生产环境中配置代码压缩功能

配置 webpack.prod.config.js 文件

```js
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

//.......

plugins: [
  // ……

  // js代码 压缩
  new UglifyJsPlugin({
    compress: {
      warnings: false,
    },
  }),
];
```

> webpack 跨域

```js

devServer:{
      proxy:{
          "/api":{
              target:"https://mapi.eyee.com",  //目标服务器地址
              changeOrigin:true,  //是否修改来源, 为true时让目标服务器以为是webpack-dev-server发出的请求
              pathRewrite:{  // 将/api开头的请求地址, /api 改为 ""
                  "^/api":""
              }
          }
     }
}

```

### 插件问题

> [The ‘compilation‘ argument must be an instance of Compilation](https://blog.csdn.net/qq_34838046/article/details/109193145)
> [Cannot find module '@babel/core'](https://blog.csdn.net/joyvonlee/article/details/96507604) > [TypeError: this.getOptions is not a function](https://blog.csdn.net/qq_42430948/article/details/113552673)
> less 版本过高
> [TypeError: this.getOptions is not a function](https://www.jianshu.com/p/83ccde644771)
> scss 版本过高
