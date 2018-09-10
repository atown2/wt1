const exposeLoader = require("expose-loader");
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const glob = require('glob-all');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const pkg = require('./package.json');
const pureFuncs = require('side-effects-safe').pureFuncs;
const UglifyWebpackPlugin = require("uglifyjs-webpack-plugin");
const webpack = require('webpack');
const WebpackManifest = require('webpack-manifest-plugin');

exports.Chunks = () => ({
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /(node_modules\/(.*)\.js)/,
          name: 'vendor',
          chunks: 'all',
          priority: -10,
        },
      }
    },
    runtimeChunk: {name: "runtime_manifest"},
  }
});
exports.exposeJQ = () => ({
  module: { rules: [{
    test: require.resolve('jquery'),
    use: [{loader: 'expose-loader',options: '!expose-loader?$'}]}
  ]}});
exports.Hashes = () => ({ plugins: [ new webpack.NamedModulesPlugin() ] });
exports.Hoist = () => ({ plugins: [new webpack.optimize.ModuleConcatenationPlugin()]});
exports.loadSCSS = ({filename, chunkFilename, includePaths}) => {
  const plugin = new MiniCssExtractPlugin({
    filename,
    chunkFilename
  });
  return {
    module: { rules: [ {
      test:/\.(s*)css$/,
      use:[
        MiniCssExtractPlugin.loader,
        { loader: "css-loader", options: { importLoaders: 2, sourceMap: true } },
        { loader: "postcss-loader",
          options: {
            ident: 'postcss',
            sourceMap: true,
            plugins: (loader) => [
              require('postcss-import')({
                root: loader.resourcePath
              }),
              require('postcss-preset-env')({
                autoprefixer: {
                  cascade: false,
                  flexbox: "no-2009",
                  grid: false
                }
              }),
              require('css-mqpacker')({}),
              process.env.NODE_ENV === 'production' ?
                require('cssnano')({
                  autoprefixer: false,
                })
                :null,
              require('postcss-reporter')({}),
            ].filter(function(plugin) { return plugin !== null; })
          }
        },
        { loader: "resolve-url-loader", options: { debug: false, sourceMap: true } },
        { loader: "sass-loader", options: { sourceMap: true, includePaths } }
      ],
    },],},
    plugins: [plugin],
  };
};
exports.loadImg = ({ include, exclude, name } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(gif|png|jpe?g|svg|ico)$/,
        include, exclude,
        use: [
          { loader: "file-loader",
            options: {
              name,
              context: "assets", useRelativePath: false,
              hashType: "sha512", digestType: "hex", length: 32
            }
          },
          { loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              mozjpeg: { progressive: true, quality: 40 },
            },
          },
        ]
      }
    ],
  },
});
exports.loadJS = ({ include, exclude, name } = {}) => ({
  module: {rules: [{
    test: /\.js$/,
    sideEffects: false,
    include,
    exclude,
    use:[
      {loader: "babel-loader", options: { babelrc: true, sourceMap: true,}},
      {loader: "eslint-loader", options: {sourceMap: true,}},
      {loader: "source-map-loader", options: {}},
    ],
  },],},
});
exports.Manifest = () => ({ plugins: [ new WebpackManifest({ fileName: 'manifest.json', filter: (file) => !file.path.match(/\.map$/), }) ] });
exports.optimizeJS = () => ({
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyWebpackPlugin({
        parallel: true,
        sourceMap: true,
        uglifyOptions:
          {
          warnings: true,
          ecma: 5,
          options: {
            ecma: 5,
            parse: {},
            compress: {
              dead_code: true,
              drop_console: true,
              ecma: 5,
              global_defs: {DEBUG: false},
              pure_funcs: pureFuncs,
              unsafe: true,
              unused: true,
            },
            mangle: {toplevel: true, properties: {}},
            output: {beautify: false},
            sourceMap: {},
            toplevel: true,
          }
        }
      })
    ]
  }
});
exports.provideJQ = () => ({ plugins: [new webpack.ProvidePlugin({'$': 'jquery', foundation: 'Foundation'})], });
exports.Revision = () => ({ plugins: [ new webpack.BannerPlugin({ banner: new GitRevisionPlugin().version(), }), ], });
exports.SourceMaps = ({ type }) => ({devtool: type,});
