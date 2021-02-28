//全局变量
let aindex = 0;
let aimg;
let abullet;
let timer = null;


//获取banner图数据
function getbannerData() {
    $.ajax({
        url: '../data/nav.json',
        method: 'get',
        dataType: 'json',
        success: function (res) {
            let bannerArr = res.banner;
            for (var i = 0; i < bannerArr.length; i++) {
                $(`<a href="${bannerArr[i].url}" class="swiper-banner"><img src="images/banner/${bannerArr[i].img}" alt=""></a>
                `).appendTo('.swiper-center');

                let bullet = $(`<a href="" class="bullet"></a>`);
                if (i == 0) {
                    bullet.addClass('bullet-swiper')
                }
                bullet.appendTo('.swiper-pagination');
            }
            banner()


        },
        error: function (err) {
            console.log(err);

        }
    })
}

//轮播函数
function banner() {
    timer = setInterval(function () {
        aindex++;
        tab();
    }, 2500)

    //小圆点的委托点击事件
    $('.swiper-pagination').on('click', 'a', function () {
        aindex = $(this).index();
        tab();
        return false;
    })

    //左右键功能函数
    $('.swiper-left,.swiper-right').click(function () {
        if (this.className == 'swiper-left') {
            aindex--;
            if (aindex == -1) {
                aindex = 4;
            }
        } else {
            aindex++;
            console.log(aindex);
            if (aindex == 5) {
                aindex = 0;
            }
        }
        tab();
    })

}

//轮播停止消除定时器函数
$('.swiper-center').mouseenter(function () {
    clearInterval(timer);
}).mouseleave(function () {
    timer = setInterval(function () {
        aindex++;
        tab();
    }, 2500)
})

function tab() {
    if (!aimg) {
        aimg = $('.swiper-center').find('img');
    }
    if (!abullet) {
        abullet = $('.swiper-pagination').find('a');
    }
    if (aindex == 5) {
        aindex = 0;
    }

    // 图片轮播
    aimg.hide().css("opacity", 0.2).eq(aindex).show().animate({ opacity: 1 }, 500);



    //小圆点切换
    abullet.removeClass('bullet-swiper').eq(aindex).addClass('bullet-swiper');
}

// *********************商品详情获取
function getshopData() {
    $.ajax({
        url: '../data/data.json',
        method: 'get',
        success: function (arr) {
            var firstdata = arr[0];
            var node = $(`<div class="shop-list">
                    <div class="box-hd">
                        <h2 class="title">${firstdata.title}</h2>
                        <div class="more">
                            <a href="./html/shop.html" class="more-link">查看全部</a>
                        </div>
                    </div>
                    <div class="box-content">
                        <div class="left-box">
                            <a href="#">
                                <img src="${firstdata.img}"
                                    alt="" />
                            </a>
                        </div>
                        <div class="right-box">
                        </div>
                    </div>
                </div>
            `);
            node.appendTo('.main');
            for (var i = 0; i < firstdata.childs.length; i++) {
                $(`<div class="shop-introduce">
                                <a href="#">
                                    <div class='figure figure-img'>
                                        <img width="160" height="160"
                                            src="${firstdata.childs[i].img}"
                                            alt="" />
                                    </div>
                                    <h3 class='title'>
                                        ${firstdata.childs[i].title}
                                    </h3>
                                    <p class='desc'>${firstdata.childs[i].desc}</p>
                                    <p class='price'>
                                        <span class='num'>${firstdata.childs[i].price}</span>
                                        元
                                        <span>起</span>
                                    </p>
                                </a>
                            </div>
                `).appendTo(node.find('.right-box'));
            }
            for (var j = 1; j < arr.length; j++) {
                let node = $(`
                <div class="banner-top" style="margin:50px 0">
                        <a href="#">
                            <img src="${arr[j].topImg}"
                                alt="" />
                        </a>
                </div>
                <div class="shop-list">
                    <div class="box-hd">
                        <h2 class="title">${arr[j].title}</h2>
                        <div class="more">
                            <a href="#" class="more-link">查看全部</a>
                        </div>
                    </div>
                    <div class="box-content">
                        <div class="left-box">
                            <a href="#">
                                <img src="${arr[j].leftChilds[0]}"
                                    alt="" />
                            </a>
                            <a href="#">
                                <img src="${arr[j].leftChilds[1]}"
                                    alt="" />
                            </a>
                        </div>
                        <div class="right-box">
                        </div>
                    </div>
                </div>
            `)
                for (var k = 0; k < 8; k++) {
                    $(`<div class="shop-introduce">
                                <a href="#">
                                    <div class='figure figure-img'>
                                        <img width="160" height="160"
                                            src="${arr[j].hotChilds[k].img}"
                                            alt="" />
                                    </div>
                                    <h3 class='title'>
                                        ${arr[j].hotChilds[k].title}
                                    </h3>
                                    <p class='desc'>${arr[j].hotChilds[k].desc}</p>
                                    <p class='price'>
                                        <span class='num'>${arr[j].hotChilds[k].price}</span>
                                        元
                                        <span>起</span>
                                    </p>
                                </a>
                            </div>
                    `).appendTo(node.find('.right-box'));
                }
                node.appendTo('.main');
            }
        },
        error: function (msg) {
            console.log(msg);
        }
    })
}



//ajax获取数据函数调用
getbannerData();
getshopData();




function fun(res) {
    let str = ''
    let arr = res.result
    for (var i = 0; i < arr.length; i++) {
        str += `<p>${arr[i][0]}</p>`
    }
    $('.boxipt').html(str);
}

$('.sch-ipt').keydown(function () {
    if ($('.sch-ipt').val()) {
        let script = document.createElement('script')
        script.src = `https://suggest.taobao.com/sug?code=utf-8&q=${$('.sch-ipt').val()}&_ksTS=1611924128343_918&callback=fun`
        document.body.appendChild(script)
        script.remove();
    } else {
        $('.boxipt').html('')
        $('.boxipt').css({
            borderWidth: 1
        })
    }
})

$('.search-btn').click(function () {
    if ($('.sch-ipt').val()) {
        $.ajax({
            url: './data/goodsList2.json',
            type: 'get',
            success: function (res) {
                console.log(res);
                for (var i = 0; i < res.length; i++){
                    if ($('.sch-ipt').val() == res[i].name) {
                        window.location.href = 'html/shopsDesc.html?product_id=' + res[i].product_id;
                    }
                }
            },
            error: function (msg) {
                console.log(msg);
            }
        })
    } else {
        alert('您的输入为空');
    }
})
