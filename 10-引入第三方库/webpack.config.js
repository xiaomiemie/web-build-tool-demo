const webpack = require('webpack')
const extractTextWebpackPlugin = require('extract-text-webpack-plugin')
module.exports = {
  entry: {
    index: __dirname + '/src/index.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: extractTextWebpackPlugin.extract({
        fallback: {
          loader: 'style-loader',
          /* options: {
             insertInto: 'body',//插入到哪个dom上面
             singletom: true, // 把所有的style合成一个
             transform: './css.transform.js' // 类似钩子，发生在浏览器环境，可以根据浏览器环境不同做出不同的兼容，例如做media query
           }*/
        },
        use: [{
          loader: 'css-loader',
          options: {
            minimize: true,// 开启压缩
            // module: true// 模块化
          },
          // loader: 'file-loader',
        },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('autoprefixer')(),
                require('cssnano')(),
              ]
            }
          }]
      })
    },
      // {
      //   test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      //   use: [{
      //     loader: 'file-loader',
      //     options: {
      //       publicPath: '',
      //       outputPath: '/dist/',
      //       useRelativePath: true
      //     }
      //   },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].min.[ext]',
              limit: 2000,
              publicPath: '',
              outputPath: '/dist/',
              useRelativePath: true
            }
          },
          {
            loader: 'img-loader',
            options: {
              gifsicle: {
                interlaced: false
              },
              mozjpeg: {
                progressive: true,
                arithmetic: false
              },
              optipng: false, // disabled
              pngquant: {
                floyd: 0.5,
                speed: 2
              },
              svgo: {
                plugins: [
                  {removeTitle: true},
                  {convertPathData: false}
                ]
              }
            }
          }
        ]
      },
      {
        test: /\.(eot|woff2?|woff|ttf|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options:{
              limit: 2000,
              publicPath: '',
              outputPath: '/dist/',
              useRelativePath: true
            }
          }
        ]
      }]
  },
  plugins: [
    // new ExtractTextPlugin("[name].[contenthash:8].css"),
    new extractTextWebpackPlugin({
      filename: '[name].min.css',
      allChunks: false // 制定提取css的范围,提取初始化（非异步加载）,此时在commonChunk插件下，css也会被当成一个chunk,所有要用contenthash
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
}