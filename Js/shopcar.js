var login = $.cookie('login');
if (!login) {
    alert('您还没登录,请先登录')
    // localStorage.setItem('url', location.href);
    window.location.href = '../html/login.html';
}

getData();

//请求数据
function getData() {
    if (login) {
        loginname = JSON.parse(login);
        new Promise(function (resolve, reject) {
            $.ajax({
                url: '../api/getshopData.php',
                type: 'post',
                data: {
                    'username': loginname
                },
                success: function (des) {
                    resolve(des);
                },
                error: function (msg) {
                    reject(msg)
                }
            })
        }).then(function (des) {
            new Promise(function (resolve, reject) {
                var data = JSON.parse(des)
                console.log(data);
                $.ajax({
                    url: '../data/goodsList.json',
                    type: 'get',
                    success: function (arr) {
                        // for (var i = 0; i < cookieArr.length; i++) {
                        //     for (var j = 0; j < arr.length; j++) {
                        //         if (cookieArr[i].id == arr[j].product_id) {
                        //             arr[j].num = cookieArr[i].num;
                        //             newArr.push(arr[j])
                        //         }
                        //     }
                        // }

                        var newArr = []
                        for (var i = 0; i < data.length; i++) {
                            for (var j = 0; j < arr.length; j++) {
                                if (data[i].goods_id == arr[j].product_id) {
                                    arr[j].num = data[i].goods_num;
                                    newArr.push(arr[j])
                                }
                            }
                        }


                        for (var l = 0; l < newArr.length; l++) {
                            $(`<div class="shops-item" id="${newArr[l].product_id}">
                                    <div class="checkbox">
                                        <input class="check" checked type="checkbox">
                                    </div>
                                    <div class="imgbox"><img src="${newArr[l].images[0]}"></div>
                                    <div class="shopsname">${newArr[l].name}</div>
                                    <div class="shopsprice">${newArr[l].price_min}</div>
                                    <div class="num">
                                        <a class="reduce" style="border-right: 0;" href="">-</a>
                                        <div class="numshops">${newArr[l].num}</div>
                                        <a class="add" style="border-left: 0;" href="">+</a>
                                    </div>
                                    <div class="totall">${newArr[l].price_min * newArr[l].num}</div>
                                    <div class="do">
                                        <a class="del" href="">x</a>
                                    </div>
                                </div>
                                `).appendTo('.shops');
                        }

                        count();

                        // **********************全选功能*********************

                        $('.allcheckbox').click(function () {
                            // var allcheckbox = $('.check')

                            // //点击的元素this添加到元素集合中
                            // // console.log($(this).add(allcheckbox));

                            // //is判断是否存在该属性，还可判断对象，元素等
                            // if ($(this).is(':checked')) {
                            //     $(this).add(allcheckbox).attr('checked', true);
                            // } else {
                            //     $(this).add(allcheckbox).attr('checked', false);
                            // }
                            $('.check').prop('checked', this.checked);
                            count();
                        })

                        $('.shops').on('click', '.check', function () {
                            $(this).prop('checked', this.checked);
                            if ($('.check:checked').length == $('.check').length) {
                                $('.allcheckbox').prop('checked', true);
                            } else {
                                $('.allcheckbox').prop('checked', false);
                            }
                            count();
                        })

                        // ********************计算各项数据******************
                        function count() {
                            var isAll = true//假设都被选中

                            //Bug：定义计算变量一定要赋初始值，否则会返回NaN从而无法计算！
                            var totalprice = 0;
                            var totalnum = 0;

                            $('.shops-item').each(function (index, item) {
                                if (!$(item).find('.check').is(':checked')) {
                                    isAll = false;
                                } else {
                                    //find()方法是寻找父元素下的子元素节点
                                    totalprice += parseFloat($(item).find($('.shopsprice')).html().trim()) * parseFloat($(item).find($('.numshops')).html().trim());
                                    totalnum += parseFloat($(item).find($('.numshops')).html());
                                }
                            })
                            $('.totalnum').html(totalnum);
                            $('.totalpri').html(totalprice);
                        }

                        // **********************增减****************
                        //写多个类名时，使用逗号隔开
                        $('.shops .num').on('click', '.add,.reduce', function () {
                            console.log(data);
                            //closest匹配元素节点，直至返回空的jq对象
                            var id = $(this).closest('.shops-item').attr('id');
                            // var cookieStr = $.cookie('goods');
                            // var cookieArr = JSON.parse(cookieStr);
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].goods_id == id) {
                                    if (this.className == 'reduce') {
                                        data[i].goods_num == 1 ? alert('数量最小为1') : --data[i].goods_num;
                                        $.ajax({
                                            url: '../api/updatacar.php',
                                            type: 'get',
                                            data: {
                                                'goods_num': data[i].goods_num,
                                                'goods_id': data[i].goods_id,
                                                'username': data[i].username
                                            },
                                            success: function (suc) {
                                                console.log(suc);
                                            },
                                            error: function (msg) {
                                                console.log(msg);
                                            }
                                        })
                                    } else {
                                        ++data[i].goods_num;
                                        $.ajax({
                                            url: '../api/updatacar.php',
                                            type: 'get',
                                            data: {
                                                'goods_num': data[i].goods_num,
                                                'goods_id': data[i].goods_id,
                                                'username': data[i].username
                                            },
                                            success: function (suc) {
                                                console.log(suc);
                                            },
                                            error: function (msg) {
                                                console.log(msg);
                                            }
                                        })
                                    }
                                    //修改输入框num
                                    $(this).parent().find('.numshops').html(data[i].goods_num);

                                    //修改小计
                                    var Nowprice = parseInt($(this).closest('.shops-item').find('.shopsprice').html());
                                    $(this).closest('.shops-item').find('.totall').html(data[i].goods_num * Nowprice);
                                }
                            }
                            count();
                            return false
                        })

                        // *****************删除数据*******************
                        $('.shops').on('click', '.del', function () {
                            var id = $(this).closest('.shops-item').remove().attr('id');
                            for (var i = 0; i < data.length; i++) {
                                if (id == data[i].goods_id) {
                                    console.log(data);
                                    $.ajax({
                                        url: '../api/delcar.php',
                                        type: 'get',
                                        data: {
                                            'username': data[i].username,
                                            'goods_id': data[i].goods_id
                                        },
                                        success: function (suc) {
                                            console.log(suc);
                                        },
                                        error: function (msg) {
                                            console.log(msg);
                                        }
                                    })
                                }
                            }
                            // for (var i = 0; i < cookieArr.length; i++) {
                            //     if (id == cookieArr[i].id) {
                            //         cookieArr.splice(i, 1)
                            //     }
                            // }
                            // $.cookie('goods', JSON.stringify(cookieArr), { expires: 7 });
                            count();
                            return false
                        })
                    },
                    error: function (msg) {
                        console.log(msg);
                    }
                })
            }).then(function (footdt) {
                console.log(footdt);
            })
        })
    } else {
        return
    }
}