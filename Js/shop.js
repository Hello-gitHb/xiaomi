function getshopData() {
    $.ajax({
        url: '../data/goodsList2.json',
        method: 'get',
        success: function (arr) {
            console.log(arr);
            let bignode = $(`<div class="bigshop">
                <div class="banner-img">
                    <a href="shopsDesc.html?product_id=${arr[0].product_id}">
                        <img src="${arr[0].image}" alt="">
                    </a>
                </div>
                <div class="shop-desc">
                    <div class="title"><a href="shopsDesc.html?product_id=${arr[0].product_id}">${arr[0].name}</a></div>
                    <p class="desc">${arr[0].desc}</p>
                    <p class="price"><span>${arr[0].price}</span> 元起</p>
                    <div class="buy">
                        <a href="shopsDesc.html?product_id=${arr[0].product_id}">立即购买</a>
                    </div>
                </div>
            </div>
            `)
            bignode.appendTo('.content');
            for (var i = 1; i < arr.length; i++){
                $(`<div class="smallshop">
                    <div class="banner-img">
                        <a href="shopsDesc.html?product_id=${arr[i].product_id}">
                            <img src="${arr[i].image}" alt="">
                        </a>
                    </div>
                    <div class="shop-desc">
                        <div class="title"><a href="shopsDesc.html?product_id=${arr[i].product_id}">${arr[i].name}</a></div>
                        <div class="price-desc">
                            <p class="desc">${arr[i].desc}</p>
                            <p class="price"><strong>${arr[i].price}</strong> 元起</p>
                        </div>
                    </div>
                </div>
                `).appendTo('.content');
            }
        },
        error: function (msg) {
            console.log(msg);
        }
    })
}

getshopData();