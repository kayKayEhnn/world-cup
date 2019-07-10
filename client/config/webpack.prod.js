const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const webpack = require("webpack");

const { basePath } = require("./webpack.base");

/** @type {webpack.Configuration} */
module.exports = {
  mode: "production",
  devtool: "none",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        options: {
          presets: ["env", "react"],
          plugins: ["transform-object-rest-spread"]
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader"
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
    new WorkboxPlugin.GenerateSW({
      exclude: [/\.DS_STORE$/i, /^CNAME$/i],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/russia-wc.herokuapp.com\/api\/(?:teams|matches).*$/,
          handler: "CacheFirst",
          options: {
            cacheName: "api-responses",
            expiration: {
              maxAgeSeconds: 60 * 60 * 24 * 365
            }
          }
        }
      ]
    }),
    new webpack.DefinePlugin({
      "process.env.BASE_URL": JSON.stringify("https://russia-wc.herokuapp.com")
    })
  ]
};
