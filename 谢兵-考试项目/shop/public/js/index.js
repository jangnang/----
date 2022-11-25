var userinfo = document.querySelector('.userinfo')
var username = getCookie('username')
if (username) {
    userinfo.innerHTML = `
    欢迎<b style="color:red"><a href="usercenter.html"> <img class="ps" src="" alt="">${username}</a></b>!
    <a href="javascript:;" onclick="logout()">退出</a>
`
}

function logout() {
    if (confirm('你真的退出吗？')) {
        removeCookie('username')
        userinfo.innerHTML = `
        <a href="login.html">登录</a>
        <a href="register.html">注册</a>
    `
    }
}
request({
    url: '/api/users/getUsers/' + getCookie('userid'),
    headers: {
        Authorization: localStorage.getItem('token')
    }
}).then(res => {
    console.log(res);

    document.querySelector('img').src = res.data.avatar
})
// 获取商品数据
var goods = document.querySelector('.goods')
var page = 1
var pageSize = 8
var flag = true
getGoods()

function getGoods() {
    if (!flag) return
    flag = false
    request({
        url: `/api/goods/getAllGoods/${page}/${pageSize}`,
    }).then(res => {
        // console.log(res);
        var data = res.data.data
        if (data.length === 0) {
            return
        }
        var html = ''
        data.forEach(goods => {
            html += `
            <a href="detail.html?id=${goods._id}" style="display: block;width: 100%; height: 100%;">
                <li>
                    <img src="${goods.img_big_logo}" alt="">
                    <p>价格：${goods.price}</p>
                    <p class="goodstitle">${goods.title}</p>
                </li>
            </a>
        `
        })
        goods.innerHTML += html
        flag = true
        page++
    })
}
var goodsContainer = document.querySelector('.goodsContainer')
var windowTop = document.querySelector('.top')
window.onscroll = function () {
    var t = document.documentElement.scrollTop || document.body.scrollTop
    // 当卷去的距离 + 浏览器高度 > 当前文档的高度的时候
    if (t + innerHeight > goodsContainer.offsetHeight + windowTop.offsetHeight - 200) {
        getGoods()
    }
}