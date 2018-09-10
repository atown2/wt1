const globby = require('globby');
const merge = require('webpack-merge');
const wpcommon = require('./webpack.common');
const path = require('path');
const webpack = require('webpack');

const P = {
 assets: path.join(__dirname, "assets"),
 bld:    path.join(__dirname, "pub/bld"),
};
const publicPath = "bld/";
const shareConf = merge([
 {
  stats: {
   assets: true,
   children: true,
   chunks: true,
   chunkModules: true,
   chunkOrigins: true,
   entrypoints: true,
   errors: true,
   errorDetails: true,
   maxModules: 500,
   moduleTrace: true,
   optimizationBailout: true,
   providedExports: true,
   reasons: true,
   source: true,
   usedExports: true,
   warnings: true,
  },
  entry: {
   common : [ P.assets + '/js/common.js', P.assets + '/scss/common.scss', ]
   .concat(globby.sync(['assets/img'], {expandDirectories: {extensions: ['jpg']}},)),
  },
  output: {
   path: P.bld,
   publicPath,
   libraryTarget: 'umd'
  },
  amd: {jQuery: true},
  bail: true,
  parallelism: 1,
  profile: true,
  recordsPath: path.join(__dirname, 'records.json'),
  resolve: {
   alias: {},
   modules: [path.resolve(__dirname),'node_modules',]
  }
 },
 wpcommon.provideJQ(),
 wpcommon.exposeJQ(),
 wpcommon.loadJS({
  name: "js/[name].[hash].[ext]",
  include: P.assets + "/js",
  exclude: [/(node_modules)/,]
 }),
]);

const prodConf = merge([
 { performance: {hints: "warning",},},
 { output: {
  chunkFilename: 'js/[name].[chunkhash].js',
  filename: 'js/[name].[chunkhash].js',
  pathinfo: false,
 },},
 wpcommon.Hoist(),
 wpcommon.optimizeJS(),
 wpcommon.Chunks(),
 wpcommon.loadSCSS({
  filename: "css/[name].[contenthash].css",
  chunkFilename: "css/[name].[contenthash].css",
  includePaths: [ "node_modules/foundation-sites/scss", ]
 }),
 wpcommon.loadImg({ name: "img/[name].[hash].[ext]", }),
 wpcommon.Hashes(),
 wpcommon.Manifest()
]);


const devConf = merge([
 { output: {
  chunkFilename: 'js/[name].js',
  filename: 'js/[name].js',
  pathinfo: false,
 },},
 wpcommon.Hoist(),
 wpcommon.Chunks(),
 wpcommon.loadSCSS({
  filename: "css/[name].css",
  chunkFilename: "css/[name].css",
  includePaths: [ "node_modules/foundation-sites/scss", ]
 }),
 wpcommon.loadImg({ name: "img/[name].[ext]" }),
 wpcommon.Revision(),
 wpcommon.SourceMaps({ type: "cheap-module-inline-source-map" }),
 wpcommon.Manifest()
]);

module.exports = mode => {
 process.env.NODE_ENV = mode;
 if (mode === "production") { return merge(shareConf, prodConf, { mode });
 } else { return merge(shareConf, devConf, { mode }); }
};
