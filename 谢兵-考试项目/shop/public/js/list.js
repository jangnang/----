var page = 1
var pageSize = 8
var goodsList = document.querySelector('.goodsList')
var pageBox = document.querySelector('.pageBox')
var totalPage
getGoods()
function getGoods() {
    request({
        url: '/api/goods/getAllGoods/' + page + '/' + pageSize
    }).then(res => {
        console.log(res);
        var data = res.data.data
        totalPage = res.data.totalPage
        var html = ''
        data.forEach(goods => {
            html += `
                <li>
                    <a href="detail.html?id=${goods._id}" style="display: block;width: 100%; height: 100%;">
                    <img src="${goods.img_big_logo}" alt="">
                    <p>价格：${goods.price}</p>
                    <p class="goodstitle">${goods.title}</p>
                    </a>
                </li>
            `
        })
        goodsList.innerHTML = html
        pageBox.innerHTML = `
            <span onclick="first()">首页</span>
            <span onclick="prev()">上一页</span>
            <b style="font-weight:normal;">
        `
        if(totalPage <= 5) {
            for(var a=1; a<=totalPage; a++) {
                pageBox.innerHTML += `
                    <a onclick="go(${a})">${a}</a>
                `
            }
        } else {
            if(page <= 3) {
                for(var a=1; a<=5; a++) {
                    pageBox.innerHTML += `
                        <a onclick="go(${a})">${a}</a>
                    `
                }
            } else if(page >= totalPage - 2) {
                for(var a=totalPage-4; a<=totalPage; a++) {
                    pageBox.innerHTML += `
                        <a onclick="go(${a})">${a}</a>
                    `
                }
            } else {
                for(var a=page-2; a<=page+2; a++) {
                    pageBox.innerHTML += `
                        <a onclick="go(${a})">${a}</a>
                    `
                }
            }
        }   
        pageBox.innerHTML += `
                </b>
            <span onclick="next()">下一页</span>
            <span onclick="last()">尾页</span>
        `
    })
}
function first() {
    page = 1
    getGoods()
}
function last() {
    page = totalPage // 最后一页
    getGoods()
}
function prev() {
    page--
    if(page < 1) {
        page = 1
    }
    getGoods()
}
function next() {
    page++
    if(page > totalPage) {
        page = totalPage
    }
    getGoods()
}
function go(a) {
    page = a
    getGoods()
}
/*
去接口中给响应数据添加总页数的响应
发送ajax请求数据 - 封装成函数
调用数据请求的函数 -> 渲染数据 -> 渲染分页 -> 给页码添加点击事件 -> 定义点击函数 -> 设置当前页 -> 调用数据请求的函数
*/
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