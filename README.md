# 启动说明
项目使用React构建，进入`package.json`同级目录，打开命令行输入`npm start`即可
> 确保运行项目的电脑安装了对应的nodejs
> 需要安装以下库：
> 1. react-router-dom
> 2. pubsub-js
> 3. scss/sass的解析库：`sass-loader node-sass`并在`node_modules/react-scripts/config/webpack.config.js`中配置以下Rules
> ```
> {
>  test: /\.scss$/,
>  use: [
>    {loader: 'style-loader'},
>    {loader: 'css-loader'},
>    {loader: 'sass-loader'},
>  ]
> }
> ```
