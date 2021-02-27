var imgNow = 0;
var imgs;
var btns;
var timer;
var bigimgs;

getData()
banner()

//加入购物车
//jq的cookie方法需要引入jquery.cookie.js文件
$('.content-right').on('click', '.addshopcar', function () {
    var login = $.cookie('login');
    if (!login) {
        alert('您还没登录,请先登录')
        // localStorage.setItem('url', location.href);
        window.location.href = '../html/login.html';
        return
    }

    var id = this.id;
    //存储购物车信息，cookie最大为4kb，以键值对存储id，num
    //判断是否第一次添加购物车
    var first = $.cookie('goods') == null ? true : false;
    if (first) {
        //为第一次，创建cookie数据
        var cookieArr = [{ id: id, num: 1 }];
        //存储cookie数据，有效期7天
        $.cookie('goods', JSON.stringify(cookieArr), { expires: 7 });
    } else {
        //不是第一次创建，获取goods商品的键值对
        //转换JSON格式对num++，并重新加入cookie;
        var same = false;
        var cookieStr = $.cookie('goods');
        var cookieArr = JSON.parse(cookieStr);
        for (var k = 0; k < cookieArr.length; k++){
            if (cookieArr[k].id == id) {
                cookieArr[k].num++;
                same = true;
                break;
            }
        }
        if (!same) {
            var obj = { id: id, num: 1 };
            cookieArr.push(obj);
        }
        $.cookie('goods', JSON.stringify(cookieArr), { expires: 7 });
    }
    ////添加至数据库存储
    if (login) {
        var cookiename = JSON.parse(login);
        $.ajax({
            url: '../api/addcar.php',
            type: 'post',
            data: {
                'id': id,
                'username': cookiename
            },
            success: function (suc) {
                console.log(suc);
            },
            error: function (msg) {
                console.log(msg);
            }
        })

    }
    alert('添加成功')
    return false;
})


// **********放大镜****************
//1.移入移出事件
$('.imgbox').mouseenter(function () {
    $('.mask').show();
    $('.bigimg').show();
    bigchang();
}).mouseleave(function () {
    $('.bigimg').hide();
    $('.mask').hide();
})

//2.鼠标滑动事件
$('.imgbox').mousemove(function (e) {

    //设置mask盒子的x，y值
    var x = e.clientX - $('.imgbox').offset().left - $('.mask').width() / 2;
    var y = e.clientY - $('.imgbox').offset().top - $('.mask').height() / 2;
    //设置mask的临界值
    if (x < 0) {
        x = 0;
    }
    if (y < 0) {
        y = 0;
    }
    if (x > $('.imgbox').width() - $('.mask').width()) {
        x = $('.imgbox').width() - $('.mask').width();
    }
    if (y > $('.imgbox').height() - $('.mask').height()) {
        y = $('.imgbox').height() - $('.mask').height();
    }
    $('.mask').css({
        top: y,
        left:x
    })
    $('.bigimg img').css({ top: -y * 2, left: -x * 2 })
})

//请求数据
function getData() {
    $.ajax({
        url: '../data/goodsList.json',
        type: 'get',
        success: function (data) {
            //渲染右侧数据
            var product_id = localtionvalue(location.search, 'product_id');
            for (var i = 0; i < data.length; i++) {
                if (data[i].product_id == product_id) {
                    $(`<h1>${data[i].name}</h1>
                        <p class="desc">${data[i].product_desc_ext}</p>
                        <span>小米自营</span>
                        <p class="price">秒杀价：<strong>${data[i].price_min}</strong>元</p>
                        <div class="btncar">
                            <a class="addshopcar" id="${product_id}">加入购物车</a>
                            <a href="./shopcar.html" class="toshopcar">查看购物车</a>
                        </div>
                    `).appendTo('.content-right')
                    //渲染左侧图片
                    var imgbox = data[i].images;
                    if (imgbox.length == 1) {
                        $(`<img src="${imgbox[0]}" alt="">`).appendTo('.imgbox');
                        $(`<img src="${imgbox[0]}" alt="">`).appendTo('.bigimg')
                        $('.banner-left,.banner-right').hide();
                    } else {
                        for (var j = 0; j < imgbox.length; j++) {
                            $(` <a class="bullit"></a>`).appendTo('.bot');
                            let firsta = $('.bot').find('a').first().addClass('active')
                            $(`<img src="${imgbox[j]}" alt="">`).appendTo('.imgbox');
                        }
                    }
                }
            }
        },
        error: function (msg) {
            console.log(msg);
        }
    })
}

// 获取url参数
function localtionvalue(search, name) {
    let start = search.indexOf(name + '=');
    if (start == -1) {
        return
    } else {
        let end = search.indexOf('&')
        if (end == -1) {
            end = search.length
        }
        let str = search.substring(start, end);
        let arr = str.split('=');
        return arr[1]
    }
}

//轮播函数
function banner() {


    //左右键单点事件
    $('.banner-left,.banner-right').click(function () {
        if (this.className == 'banner-left') {
            imgNow--;
            tab();
            bigchang();
        } else {
            imgNow++;
            tab();
            bigchang();
        }
    })

    //小方块事件委托
    $('.bot').on('click', 'a', function () {
        imgNow = $(this).index();
        tab();
        bigchang();
        return false;
    })


    function tab() {
        if (!imgs) {
            imgs = $('.imgbox').find('img');
        }
        if (!btns) {
            btns = $('.bot').find('a');
        }
        if (!bigimgs) {
            bigimgs = $('.bigimg').find('img')
        }
        if (imgNow < 0) {
            imgNow = btns.length-1
        }

        if (imgs.length == 1) {
            clearInterval(timer)
        } else {
            if (imgNow == btns.length) {
                imgNow = 0;
            }
            //小圆点的切换样式
            btns.removeClass('active').eq(imgNow).addClass('active');
            //图片的切换
            imgs.hide().eq(imgNow).show();
            bigimgs.hide().eq(imgNow).show();
        }
    }


    
    //     timer = setInterval(function () {
    //         imgNow++;
    //         tab();
    //     }, 2000)
    
    // //轮播停止消除定时器函数
    // $('.imgbox').mouseenter(function () {
    //     clearInterval(timer);
    // }).mouseleave(function () {
    //     timer = setInterval(function () {
    //         imgNow++;
    //         tab();
    //     }, 2000)
    // })

}

//大图移动事件
function bigchang() {
    $.ajax({
        url: '../data/goodsList.json',
        type: 'get',
        success: function (data) {
            var product_id = localtionvalue(location.search, 'product_id');
            for (var i = 0; i < data.length; i++) {
                if (data[i].product_id == product_id) {
                    var imgbox = data[i].images;
                    var node = $(`<img src="${imgbox[imgNow]}" alt="">`);
                    node.appendTo('.bigimg');
                }
            }
        },
        error: function (msg) {
            console.log(msg);
        }
    })
}