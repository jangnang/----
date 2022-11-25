// 判断用户是否登录 - 获取cookie
var username = getCookie('username')
var userinfo = document.querySelector('.userinfo')

// 判断
if (!username) { // 未登录
    // 提示用户并强制跳转到登录

    // 将当前路径存储到本地存储
    localStorage.setItem('url', location.href)
    // 跳转
    location.href = '/login.html'

} else { // 已登录
    // 显示用户名
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
// 发请求获取购物车页面的数据
// 从cookie中获取用户id
var userid = getCookie('userid')
console.log(userid);
// 从本地存储获取token
var token = localStorage.getItem('token')
console.log();
request({
    url: '/api/cart/cartList/' + userid,
    // 设置请求头
    headers: {
        Authorization: localStorage.getItem('token')
    }
}).
then(res => {

    // 定义用户的购物车数据
    var cartData = res.data
    // 判断用户是否有购物车数据
    // console.log(cartData );
    if (!cartData) { // 没有数据
        // 页面中显示购物车为空
        document.querySelector('.goods').innerHTML = `
                    <div class="jumbotron">
                        <h1>购物车是空的!</h1>
                        <p>赶快去列表页精心挑选商品吧！</p>
                        <p><a class="btn btn-primary btn-lg" href="/list.html" role="button">去列表页</a></p>
                    </div>
                `

    } else { // 用户有购物车数据
        // 渲染到页面中

        // console.log(cartData);
        // 将购物车数据中的所有商品id组成一个数组
        var goodsids = cartData.map(item => item.goodsid)

        // 根据购物车数据中的商品id 到 商品表中获取商品信息
        var token = localStorage.getItem('token')
        request({
            method: 'post',
            url: '/api/goods/cartgoods',
            data: {
                goodsids: JSON.stringify(goodsids)

            },
            headers: {
                Authorization: token
            },
        }).then(res => {

            console.log(res);
            var goodsData = res.data.goods
            // console.log(goodsData);
            // 根据购物车数据渲染
            var html = ''
            cartData.forEach(item => {
                // console.log(111, item);
                // 根据item中的goodsid到goodsData中找到对应的商品信息对象
                var goodsObj = goodsData.find(v => v._id === item.goodsid)
                console.log(goodsObj.img_small_logo);
                html += `
                                <tr>
                                    <td><input type="checkbox" name="selectOne">单选</td>
                                    <td>
                                        <img src="${goodsObj.img_small_logo}" alt="">
                                    </td>
                                    <td>10</td>
                                    <td data-id="${goodsObj._id}">
                                        <input type="button" name="add" value="+">
                                        <input type="text" name="number" value="${item.goodsnumber}">
                                        <input type="button" name="reduce" value="-">
                                    </td>
                                    <td>${10 * item.goodsnumber}</td>
                                    <td>
                                        <button data-id="${goodsObj._id}" class="remove btn btn-danger">删除</button>
                                    </td>
                                </tr>
                            `
            })
            // 将组合好的内容放在tbody中
            document.querySelector('.goods tbody').innerHTML = html
            // 实现购物车功能
            // 全选功能
            checkAll()
            // 单选功能
            checkOne()
            // 数量加和减
            addAndReduce()
            // 删除一个
            removeOne()
            // 删除所有
            removeAll()
            // 统计数量和价格的
            total()
        })

    }
})
// 统计
function total() {
    // 统计小计
    // 获取标签
    var numbersInput = document.querySelectorAll('[name="number"]')
    // 定义总数量
    var totalNum = 0
    // 定义总价格
    var totalPrice = 0
    // 遍历
    numbersInput.forEach((input, index) => {
        var price = +input.parentElement.previousElementSibling.innerText
        var subtotal = price * +input.value
        input.parentElement.nextElementSibling.innerText = subtotal

        // 判断当前input数量对应的input复选框是否是选中状态
        if (input.parentElement.parentElement.firstElementChild.firstElementChild.checked) {
            totalNum += +input.value
            totalPrice += subtotal
        }
    })
    document.querySelector('.totalPrice').innerText = totalPrice
    document.querySelector('.totalNum').innerText = totalNum
}
// 清空购物车

function removeAll() {
    document.querySelector('.removeAll')
        .onclick = function () {
            if (confirm('是否真的清空购物车')) {

                // 发送请求
                request({
                    url: '/api/cart/removeAll/' + getCookie('userid'),
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                }).
                then(res => {
                    console.log(res);
                    location.reload()
                    if (res.errorCode === 0) {
                        document.querySelector('.goods').innerHTML = `
                            <div class="jumbotron">
                                <h1>购物车是空的!</h1>
                                <p>赶快去列表页精心挑选商品吧！</p>
                                <p><a class="btn btn-primary btn-lg" href="/list.html" role="button">去列表页</a></p>
                            </div>
                        `


                    }
                  
                })
               


            }

        }
} // 删除单个商品
function removeOne() {
    // 获取删除按钮
    var removeBtns = document.querySelectorAll('.remove')
    // 遍历绑定事件
    removeBtns.forEach(btn => {
        btn.onclick = function () {
            var _this = this
            // 询问
            if (confirm('是否真的要删除')) {

                // 删除掉自己的父.父
                _this.parentElement.parentElement.parentElement.removeChild(_this.parentElement.parentElement)
                request({
                    url: '/api/cart/removeOne',
                    method: 'post',
                    headers: {
                        Authorization: localStorage.getItem('token')
                    },
                    data: {
                        userid: getCookie('userid'),
                        goodsid: _this.dataset.id
                    }
                }).
                then(res => {
                    console.log(res);
                    if (res.errorCode === 0) {
                        layer.msg('删除成功', {
                            icon: 1,
                            time: 1500
                        })
                        total()
                    }

                })

            }
        }



    })
}
// 数量加
function addAndReduce() {
    // 获取标签
    var addBtns = document.querySelectorAll('[name="add"]')
    var reduceBtns = document.querySelectorAll('[name="reduce"]')
    // 遍历绑定事件
    addBtns.forEach(btn => {
        btn.onclick = function () {
            // 获取自己的下一个标签的内容
            var num = +this.nextElementSibling.value
            // 自增
            num++
            // 放到自己的下一个标签中
            this.nextElementSibling.value = num
            // h5提供了一个快速操作属性值的api - 属性必须是 data-XX
            // 通过标签.dataset属性获取
            // console.log( this.parentElement.dataset .id);
            // 发请求让数据库的数量也发生更改
            changenumber(num, this.parentElement.dataset.id)
            total()
        }
    })
    reduceBtns.forEach(btn => {
        btn.onclick = function () {
            // 获取自己的下一个标签的内容
            var num = +this.previousElementSibling.value
            // 自减
            num--
            // 限制
            if (num < 1) {
                return
            }
            // 放到自己的下一个标签中
            this.previousElementSibling.value = num

            changenumber(num, this.parentElement.dataset.id)
            total()
        }
    })
}
// 改变数量的请求
function changenumber(num, goodsid) {
    request({
        url: '/api/cart/changenumber',
        method: 'post',
        data: {
            num,
            userid: getCookie('userid'),
            goodsid
        },
        headers: {
            Authorization: localStorage.getItem('token')
        }
    })
}
// 单选函数
function checkOne() {
    // 获取标签
    var selectAll = document.querySelectorAll('[name="selectAll"]')
    var selectOne = document.querySelectorAll('[name="selectOne"]')
    // 将selectOne为数组转成数组调用every
    selectOne = Array.from(selectOne)
    // console.log(selectOne);
    // 遍历绑定事件
    selectOne.forEach(item => {
        item.onchange = function () {
            // 判断是否所有的都选中
            selectAll.forEach(vv => vv.checked = selectOne.every(v => v.checked))
            total()
        }
    })
}
// 定义全选功能函数
function checkAll() {
    // 获取标签
    var selectAll = document.querySelectorAll('[name="selectAll"]')
    var selectOne = document.querySelectorAll('[name="selectOne"]')
    // 遍历全选按钮
    // console.log(selectAll);
    selectAll.forEach(input => {
        // console.log(input);
        // 绑定事件
        input.onchange = function () {
            selectOne.forEach(item => {
                // console.log(item);
                item.checked = input.checked
            })
            selectAll.forEach(item => {
                // console.log(item);
                item.checked = input.checked
            })
            total()
        }
    })
}