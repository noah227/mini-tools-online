const {defineConfig} = require('@vue/cli-service')
const webpack = require("webpack")
const {execSync} = require("child_process")

/**
 * 转为浏览器可用的函数
 */
execSync([
    "browserify",
    "./node_modules/json-schema-generator/lib/index.js", "-s",
    "jsonSchemaGenerator", ">",
    "./node_modules/json-schema-generator/lib/jsg-browser.js"].join(" ")
)

module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: "./",
    productionSourceMap: false,
    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({
                __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
            })
        ]
    }
})
