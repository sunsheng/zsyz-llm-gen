module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 100,
      propList: ['*'],
      selectorBlackList: [/^\.el-/],
      exclude: /node_modules/
    },
    autoprefixer: {}
  }
}
