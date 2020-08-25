//处理首页导航部分  声明模块遵循AMD规范

//通过define声明遵循
//通过$获取jquery的数据
define(["jquery"], function ($) {
    //封装下载函数
    function download() {
        //通过ajax数据下载
        $.ajax({
            //请求方式为get
            type: "get",
            //请求路径
            url: "../data/nav.json",
            success: function (result) {
                // alert(result);
                //取出数据
                var bannerArr = result.banner;
                //通过循环将数据添加到页面
                for (var i = 0; i < bannerArr.length; i++) {
                    //通过jQuery的方法直接创建图片标签(index.html中轮播图的注释部分）追加到页面
                    $(`<a href="${bannerArr[i].url}">
                    <img class="swiper-lazy swiper-lazy-loaded" src="images/banner/${bannerArr[i].img}" >
                    </a>`).appendTo("#J_homeSwiper .swiper-slide");//使用``进行拼接，页面显示a链接5个


                    var node = $(`<a href="#" class = 'swiper-pagination-bullet '></a>`);
                    //banner图左下角的小圆圈进行判断，banner图片对应的即被选中
                    //默认下标为0的小圆点为选中，即i==0；
                    if (i == 0) {
                        //第一张图片添加class样式
                        node.addClass("swiper-pagination-bullet-active");//swiper-pagination-bullet-active是被选中的样式
                    }
                    node.appendTo("#J_homeSwiper .swiper-pagination");////使用``进行拼接，页面显示a链接5个
                }
            },
            error: function (msg) {
                console.log(msg);
            }
        })
        leftNavDownload();
        topNavDownload();
    }

    //实现轮播图的轮播效果
    function banner() {
        var iNow = 0;//当前显示图片的下标，默认的话是0
        var aImgs = null;//记录页面所有的轮播图片
        var aBtns = null;//记录页面轮播图右下角小圆圈，虽然是a标签，把他当作按钮处理

        //想达到自动轮播的效果，通过启动定时器每2.5秒进行切换
        var timer = setInterval(function () {
            iNow++;
            tab();
        }, 2500);

        //封装切换函数tab
        function tab() {
            //假设当前显示的图片是iNow，先找到这个节点去判断
            if (!aImgs) {
                //通过jquery的#J_homeSwiper .swiper-slide图片div下面去寻找所有的a标签
                aImgs = $("#J_homeSwiper .swiper-slide").find("a");
            }
            //同理：通过#J_homeSwiper .swiper-pagination去寻找页面上所有的左下角小圆圈
            if (!aBtns) {
                aBtns = $("#J_homeSwiper .swiper-pagination").find("a");
            }
            //当banner图轮播到最后一张(第五张就要换成第一张）切换到第一张继续进行轮播
            if (iNow == 5) {
                iNow = 0;
            }

            //假设iNow是当前图片显示的下标 ，图片的切换和小圆点切换
            //先将所有的图片进行隐藏，再将透明度全部设置成0.2，设置完之后再通过eq(iNow)找到想要找到的图片并将他显示出来
            //最后通过jquery的animate动画效果实现图片的透明度在500毫秒的时候将透明度转化成1
            aImgs.hide().css("opacity", 0.2).eq(iNow).show().animate({ opacity: 1 }, 500);

            //小圆点按钮的切换
            //先直接移除页面所有的class按钮（选中swiper-pagination-bullet-active即被取消）
            //再通过eq(iNow)找到想要的图片找到对应的按钮，给对应的按钮添加class样式
            aBtns.removeClass("swiper-pagination-bullet-active").eq(iNow).addClass("swiper-pagination-bullet-active")
        }

        //鼠标移入轮播图最大的div清除定时器
        //添加鼠标移入和移除事件
        //1.获取整个轮播图页面的节点和左右小箭头按钮的节点
        $("#J_homeSwiper,.swiper-button-prev,.swiper-button-next").mouseenter(function () {
            clearInterval(timer);//鼠标移入清除定时器
        }).mouseleave(function () {//鼠标移出开启定时器，使用链式操作
            timer = setInterval(function () {
                iNow++;
                tab();
            }, 2500);
        })

        //点击右下角的小圆圈可以切换到对应的图片【注释】使用事件委托，给后添加的节点绑定事件
        //小圆圈是通过ajax异步加载过来的，所以a标签找不到，
        //alert($("#J_homeSwiper .swiper-pagination").find("a").size());//只能弹出数量，不能加载出a标签。弹出0
        $("#J_homeSwiper .swiper-pagination").on("click", "a", function () {
            //alert($(this).index());//页面中可通过this.index()可以弹出点击圆圈的小标
            //将获取的下标赋值给iNow，
            iNow = $(this).index();
            tab();
            return false;//可以阻止a链接的默认行为
        })

        //轮播图内的左右按钮进行绑定点击事件
        $(".swiper-button-prev,.swiper-button-next").click(function () {
            //判断当前点击的按钮是上按钮，回到上一张（要判断是-1的时候如何如理），点击下一张回到下一张可以使用iNow++
            if (this.className == "swiper-button-prev") {
                iNow--;
                if (iNow == -1) {//点击上一张至-1
                    iNow == 4;//跳转到第四张
                }
            } else {
                iNow++;//点击下一张直接加加
            }
            tab();//记得调用切换函数tab
        })

    }



    //侧边导航栏数据的加载,数在sideNav
    function leftNavDownload() {//此函数在download函数处40行调用
        $.ajax({
            url: "../data/nav.json",
            success: function (result) {
                var sideArr = result.sideNav;//直接通过result.sideNav拿到后台数据
                //返回一个数组，数组内一个有十个对象（sideNav有十个数据）
                //alert(sideArr);//页面弹出[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object]
                //通过循环li标签创建节点
                for (var i = 0; i < sideArr.length; i++) {
                    var node = $(`<li class = 'category-item'>
                <a href="index.html" class = 'title'>
                    ${sideArr[i].title}
                    <em class = 'iconfont-arrow-right-big'></em>
                </a>
                <div class="children clearfix ">
                    
                </div>
            </li>`);
                    node.appendTo("#J_categoryList");
                    //创建title，加载右侧子节点
                    //取出当前选项对应的子节点
                    var childArr = sideArr[i].child;
                    //计算一共需要多少列，每列有6条数据，
                    var col = Math.ceil(childArr.length / 6);//向上取整数
                    //children-col-1这是一列的宽度，children-col-2这是两列的宽度
                    //计算一共多少列，设置对应的class样式
                    node.find("div.children").addClass("children-col-" + col);
                    //通过循环，创建右侧的每一个数据
                    for (var j = 0; j < childArr.length; j++) {
                        //判断如果j/6==0时
                        if (j % 6 == 0) {
                            //创建一个ul
                            var newUl = $(`<ul class="children-list children-list-col children-list-col-${parseInt(j / 6)}">
                </ul>`);
                            //将创建的ul插入node下面的div下class为children的标签内
                            newUl.appendTo(node.find("div.children"));
                        }
                        //创建每一个li标签数据
                        $(`<li>
            <a href="http://www.mi.com/redminote8pro" data-log_code="31pchomeother001000#t=normal&amp;act=other&amp;page=home&amp;page_id=10530&amp;bid=3476792.2" class="link clearfix" data-stat-id="d678e8386e9cb0fb" onclick="_msq.push(['trackEvent', '81190ccc4d52f577-d678e8386e9cb0fb', 'http://www.mi.com/redminote8pro', 'pcpid', '31pchomeother001000#t=normal&amp;act=other&amp;page=home&amp;page_id=10530&amp;bid=3476792.2']);">
                <img src="${childArr[j].img}" width="40" height="40" alt="" class="thumb">
                <span class="text">${childArr[j].title}</span>
            </a>
              </li>`).appendTo(newUl);
                    }
                }

            },
            error: function (msg) {
                console.log(msg);
            }
        })

    }

    //给侧边导航添加移入移出切换效果，选项卡的切换效果
    function leftNavTab() {
        //通过事件委托给页面上的选项实现移入和移除效果(给新创建的标签绑定事件基本都使用事件委托)
        //鼠标移入
        $(`#J_categoryList`).on("mouseenter", ".category-item", function () {
            $(this).addClass("category-item-active");
        })
        //鼠标移出
        $(`#J_categoryList`).on("mouseleave", ".category-item", function () {
            $(this).removeClass("category-item-active");
        })
    }


    //下载顶部导航数据函数、
    function topNavDownload() {//记得上方调用
        $.ajax({
            url: "../data/nav.json",
            success: function (result) {
                //将顶部行数据直接取出
                // console.log(result);
                var topNavArr = result.topNav;

                //页面效果中服务和社区没有加载项，需要单独处理
                topNavArr.push({ title: "服务" }, { title: "社区" });
                // console.log(result.topNav);
                //通过循环加载商品
                for (let i = 0; i < topNavArr.length; i++) {
                    $(`<li data-index="${i}" class="nav-item nav-item">
                         <a href="javascript:void(0);" class="link">
                            <span class="text">${topNavArr[i].title}</span>
                         </a>
                      </li>`).appendTo(".site-header .header-nav .nav-list");

                    //创建html中的ul
                    // style="display:${i==0 ? "block":"none"
                    //                     var node=$(`<ul class="children-list clearfix" style="display:${i==0 ? "block":"none" "></ul>`);
                    //                     node.appendTo("#J_navMenu .container");
                    // // console.log(node[0]);
                    //                     // console.log(topNavArr[i]);
                    //                     //取出所有的子菜单
                    //                     //需要先判断一下topNavArr这个属性是否存在 ，只有在存在的情况下，才可能出现下面的下拉菜单
                    //                     if(topNavArr[i].childs){
                    //                         var childArr=topNavArr[i].childs;//导航栏所有的子节点
                    //                         // console.log(childArr);
                    //                         //循环遍历出每个子节点
                    //                         for(var j=0; j<childArr.length;j++){
                    //                             $(`<li>
                    //                             <a href="#">
                    //                                 <div class="figure figure-thumb">
                    //                                     <img src="${childArr[j].img}" alt="">
                    //                                 </div>
                    //                                 <div class="title">${childArr[j].a}</div>
                    //                                 <p class="price">${childArr[j].i}</p>
                    //                             </a>
                    //                         </li>`).appendTo(node);//追加到新建的node（ul）上去
                    //                         }
                    //                         $(".children-list clearfix").css({diplay:`${i==1 ? "block":"none"}`})


                    //                     }


                }
                $(".header-nav .nav-list").on("mouseenter", ".nav-item", function () {


                    var index = $(this).index() - 1;
                    if (index >= 7) return;
                    // console.log(index);
                    // alert(index);//如果不减一，则对应下一个li，因为顶部导航处下面有一个多出来的 <li id = 'J_navCategory' >
                    //   首先注意服务和社区两个li不具有下拉效果，所以需要做出判断

                    if (index >= 0 && index <= 6) {
                        $("#J_navMenu").css({ diplay: "block" }).removeClass("slide-up").addClass("slide-down");
                        // console.log( $("#J_navMenu .container").find("ul").eq(index).css());
                        // $("#J_navMenu .container").find("ul").children().eq(index).css({"diplay":"block"}).siblings("ul").css({"diplay":"none"});
                        // console.log( $("#J_navMenu .container").find("ul"));
                    }
                    //动画效果放在下面
                    
                    //$(this).addClass("nav-item-active");
                    // console.log($(this).find('span').text());
                    //   console.log(topNavArr);

                    // console.log(node[0]);
                    topNavArr.forEach((ele, key) => {
                        if (key >= topNavArr.length - 2) return;
                        //  console.log(ele);
                        if (ele.title == $(this).find('span').text()) {
                            //比对两个数据是否相同
                            //console.log(ele.title, $(this).find('span').text());
                            var node = $(`<ul class="children-list clearfix" style="display:block;"></ul>`);
                            node.appendTo("#J_navMenu .container");
                            //  console.log(ele.childs);
                            ele.childs.forEach(goods => {
                                $(`<li>
                                  <a href="#">
                                   <div class="figure figure-thumb">
                                   <img src="${goods.img}" alt="">
                                   </div>
                                    <div class="title">${goods.a}</div>
                                      <p class="price">${goods.i}</p>
                                      </a>
                                     </li>`).appendTo(node);//追加到新建的node（ul）上去

                            })

                            //    $(".children-list clearfix").css({diplay:`${1==1 ? "block":"none"}`})
                        }
                    });
                })

            },
            error: function (msg) {
                console.log(msg);
            }
        })
    }




    //给顶部的导航添加移入移出效果（通过事件委托）
    function topNavTab() {
        $(".header-nav .nav-list").on("mouseenter",".nav-item",function(){

            $(this).addClass("nav-item-active");//鼠标移入后字体变成黄色
            //console.log($(this).text());
       // 找出当前移入时a标签的下标  减一后下标跟下方导航下拉菜单一样li一一对应
        //console.log($(this).index());

        // var index=$(this).index()-1;
        // console.log(index);
        // alert(index);//如果不减一，则对应下一个li，因为顶部导航处下面有一个多出来的 <li id = 'J_navCategory' >
        //首先注意服务和社区两个li不具有下拉效果，所以需要做出判断

        // if(index>=0 && index<=6){
        //     $("#J_navMenu").css({diplay:"block"}).removeClass("slide-up").addClass("slide-down");
        //     // console.log( $("#J_navMenu .container").find("ul").eq(index).css());
        //     $("#J_navMenu .container").find("ul").children().eq(index).css({"diplay":"block"}).siblings("ul").css({"diplay":"none"});
        //     console.log( $("#J_navMenu .container").find("ul"));
        // }
        })
        $(".header-nav .nav-list").on("mouseleave", ".nav-item", function () {
            $(this).removeClass("nav-item-active");
            $("#J_navMenu").css({ diplay: "none" }).addClass("slide-up").removeClass("slide-down");
           $('#J_navMenu .container .children-list').remove();
        })

        //移出效果
        //有问题
        $(".site-header").mouseleave(function(){
            $("#J_navMenu").css({display:"block"}).removeClass("slide-down").addClass("slide-up");
        })
    }



    //搜索框(静态效果实现  可以做成百度下拉列表的形式)
    function searchTab(){
        $("#search").focus(function(){
            $("#J_keywordList").removeClass("hide").addClass("show");
        }).blur(function(){
            $("#J_keywordList").removeClass("show").addClass("hide");
        })
    }

    //上面方法需要被暴露，通过AMD规范进行调用
    return {
        download: download,
        //把函数当成返回值直接调用
        banner: banner,
        leftNavTab: leftNavTab,
        topNavTab: topNavTab,
        searchTab:searchTab,

    }
    //暴露完以后需要切换到main.js文件操作
})
