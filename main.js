console.log("加载成功");

/**
配置当前这个项目用到哪些模块 
遵从的都是AMD规范

所有.js文件,后缀都可以省略

 */
require.config({
    //设置路径
    paths:{
        "jquery":"jquery-1.11.3",//所有.js文件,后缀都可以省略
        "jquery-cookie":"jquery.cookie",//所有.js文件,后缀都可以省略
        "nav":"nav",
    },
    //shim设置jquery和jquery.cookie之间的依赖关系
    shim:{
     //设置依赖关系
     "jquery-cookie":["jquery"]
    }
})

//require下nav.js文件
 require(["nav"],function(nav){
     //调用出的是两个对象，在nav.js中的success处需要遍历
     nav.download();//弹出框显示[object Object]
     //调用banner函数，实现轮播图效果
     nav.banner();
     nav.leftNavTab();

     

 })