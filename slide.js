define(["jquery"], function ($) {
    //下载数据的函数
    function download() {//要去main.js中去引用这个js文件
        $.ajax({
            url: "../data/slide.json",
            success: function (result) {
                //  alert(result);//[object Object]说明拿到数据
                //取出数据
                var slideArr = result.data.list.list;//bejson中的data的层级
                // alert(slideArr);//输出好多个[object Object]，说明所有数据已经拿到，下面进行遍历
                for (var i = 0; i < slideArr.length; i++) {
                    $(`<li class = 'swiper-slide rainbow-item-3' style = 'width: 234px; margin-right: 14px;'>
                    <a href="#" target = "_blank">
                        <div class = 'content'>
                            <div class = 'thumb'>
                                <img width="160" height="160" src="${slideArr[i].pc_img}" alt=""/>
                            </div>
                            <h3 class = 'title'>${slideArr[i].goods_name}</h3>
                            <p class = 'desc'>${slideArr[i].desc}</p>
                            <p class = 'price'>
                                <span>${slideArr[i].seckill_Price}元</span>
                                <del>${slideArr[i].goods_price}元</del>
                            </p>
                        </div>
                    </a>
                </li>`).appendTo("#J_flashSaleList ul");
                }
            },
            error: function (msg) {
                console.log(msg);
            }
        })
    }


    //商品列表滚动
    function slideTab() {
        //获取页面上的左右按钮
        var aSpans = $(".swiper-controls").find("span");
        var iNow = 0;//默认下标是0开始，显示第一组图片，每四张图片为一组
        var count = Math.ceil(26 / 4) - 1;//json中一共有26张图片，每四个一组，第一组下标为0默认


        //启动定时器，自动滚动
        var timer = setInterval(function () {
            console.log(1111);
            iNow++;
            tab();
            //判断默认的0下标递增是否跟数字相等，相等就清除定时器
            if (iNow == count) {
                clearInterval(timer);
            }
        }, 2000);

        function tab() {
            //左边按钮设置
            //iNow代表第几组数据，默认第0组
            //显示的图片组数为0，箭头函数被禁用,否则删除禁用的样式
            iNow == 0 ? aSpans.eq(0).addClass("swiper-button-disabled") : aSpans.eq(0).removeClass("swiper-button-disabled")
    
            //右边按钮设置
            //显示图片的组数与count相同，箭头函数被禁用 否则清除禁用样式
            iNow == count ? aSpans.eq(1).addClass("swiper-button-disabled") : aSpans.eq(1).removeClass("swiper-button-disabled")
            
            
            //计算要运动的目的值，四张图片的宽度就是992px
            //判断inow是否等于最后一个，等于最后一个，最后一个只有两张图片 应该只显示两张图片即长度为走一半，否则就走992
            var iTarget = iNow == count  ? iNow*-992+496  : iNow*-992;
            if(iNow==count){
                iNow=0;
            }    
            //通过transform属性实现  即C3的属性
            $("#J_flashSaleList ul").css({//使用translate3d属性进行运动 然后设置持续时间
                transform:`translate3d(${iTarget}px,0px,0px)`,
                transitionDuration:"1000ms"
            })
    
    
        }
        
        //给左边按钮设置点击事件
        aSpans.click(function(){
            //判断点击当前为0的数据,可以点击左边方向箭头
            if($(this).index()==0){
                //左键
                iNow--;
                //iNow最小不能为0，限制出界限,去最大值
                iNow=Math.max(0,iNow);
            }else{
                //邮件
                iNow++;
                //iNow要么用当前值，要么最大值
                iNow=Math.min(count,iNow);

            }
            //进行切换调用
            tab();
        })

        //给整个商品列表添加一个移入移出事件
        $("#J_flashSaleList").mouseenter(function(){
            clearInterval(timer);
        }).mouseleave(function(){
            //不要再重新写定时器，因为会冲突
            timer = setInterval(function () {
                console.log(1111);
                iNow++;
                tab();
                //判断默认的0下标递增是否跟数字相等，相等就清除定时器
                if (iNow == count) {
                    clearInterval(timer);
                }
            }, 2000);
    
        })

    }

  



    return {
        //暴露
        download: download,
        slideTab:slideTab,
        
    }
})