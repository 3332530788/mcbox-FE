###调试前确保有安装node的环境

#### React.js

相关资料:

1. [中文社区](http://reactjs.cn/)
2. [轻松入门React和Webpack](http://www.tuicool.com/articles/BrAVv2y)

安装调试必备的模块

#### webpack:
    npm install //安装所有

	//调试
	cd bin/html
	npm run dev //监听编译与压缩

	//压缩后只需要提供js/ base.js/component.js 2个文件


    //上线打包
    npm run deploy

	//上线项目的必要文件
	//-ajxa
	  -css/img(css与less可不用)
	  -assets
	    |-base.js
	    |-component.js
	  -mcbox.html
相关资料:

1. [github](https://github.com/webpack/webpack)
2. [前端webpack](http://itanguo.cn/?p=195)
3. [Webpack 入门指迷](http://segmentfault.com/a/1190000002551952)
4. [Webpack 怎么用](http://segmentfault.com/a/1190000002552008)
