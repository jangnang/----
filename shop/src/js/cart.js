// 判断用户是否登录 - 获取cookie
var username = getCookie('username')
// 判断
if(!username) { // 未登录
    // 提示用户并强制跳转到登录
    layer.msg('请先登录！', {
        icon: 2,
        time: 1500
    }, function() {
        // 将当前路径存储到本地存储
        localStorage.setItem('url', location.href)
        // 跳转
        location.href = '/login.html'
    })
} else { // 已登录
    // 显示用户名
    var logStatus = document.querySelector('.logStatus')
    // 设置内容
    logStatus.innerHTML = `
        <li style="line-height: 50px;">欢迎<a style="display: inline;" href="/usercenter.html">${username}</a></li>
        <li><a href="javascript:;" onclick="logout()">退出</a></li>
    `
    // 发请求获取购物车页面的数据
    // 从cookie中获取用户id
    var userid = getCookie('userid')
    // 从本地存储获取token
    var token = localStorage.getItem('token')
    request ({
        url: 'cart/api/list/' + userid,
        // 设置请求头
        headers: {
            Authorization: token
        },
        success: res => {
            // console.log(res);
            // 定义用户的购物车数据
            var cartData = res.data
            // 判断用户是否有购物车数据
            if(!cartData) { // 没有数据
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
                // console.log(goodsids);
                // 根据购物车数据中的商品id 到 商品表中获取商品信息
                sendAjax({
                    method: 'post',
                    url: '/goods/api/cartgoods',
                    headers: {
                        Authorization: token
                    },
                    data: {
                        goodsids: JSON.stringify(goodsids)
                    },
                    success: res => {
                        // console.log(res);
                        var goodsData = res.data.goods
                        // console.log(goodsData);
                        // 根据购物车数据渲染
                        var html = ''
                        cartData.forEach(item => {
                            // console.log(111, item);
                            // 根据item中的goodsid到goodsData中找到对应的商品信息对象
                            var goodsObj = goodsData.find(v => v._id === item.goodsid)
                            html += `
                                <tr>
                                    <td><input type="checkbox" name="selectOne">单选</td>
                                    <td>
                                        <img src="${goodsObj.goodsimg1}" alt="">
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
                        // 支付
                        cartPay()
                    }
                })
            }
        }
    })
}
// 支付
function cartPay() {
    var btn = document.querySelector('.pay')
    btn.onclick = function() {
        sendAjax({
            method: 'post',
            url: '/cart/api/pay',
            dataType: 'text',
            success: res => {
                console.log(res);
            }
        })
    }
}
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
        if(input.parentElement.parentElement.firstElementChild.firstElementChild.checked) {
            totalNum += +input.value
            totalPrice += subtotal
        }
    })
    document.querySelector('.totalPrice').innerText = totalPrice
    document.querySelector('.totalNum').innerText = totalNum
}

// 清空购物车
function removeAll() {
    document.querySelector('.removeAll').onclick = function() {
        layer.confirm('是否清空？', {
            btn: ['真的', '假的']
        }, function() {
            // 发送请求
            sendAjax({
                url: '/cart/api/removeAll/' + getCookie('userid'),
                headers: {
                    Authorization: localStorage.getItem('token')
                },
                success: res => {
                    console.log(res);
                    if(res.errorCode === 0) {
                        document.querySelector('.goods').innerHTML = `
                            <div class="jumbotron">
                                <h1>购物车是空的!</h1>
                                <p>赶快去列表页精心挑选商品吧！</p>
                                <p><a class="btn btn-primary btn-lg" href="/list.html" role="button">去列表页</a></p>
                            </div>
                        `
            
                        layer.msg('删除成功', {
                            icon: 1,
                            time: 1500
                        })
                    } else {
                        layer.msg('删除失败', {
                            icon: 2,
                            time: 1500
                        })
                    }
                }
            })
            
        }, function() {
            layer.msg('保留成功', {
                icon: 1,
                time: 1500
            })
        })
    }
}

// 删除单个商品
function removeOne() {
    // 获取删除按钮
    var removeBtns = document.querySelectorAll('.remove')
    // 遍历绑定事件
    removeBtns.forEach(btn => {
        btn.onclick = function() {
            var _this = this
            // 询问
            layer.confirm('你真的要删除吗？', {
                btn: ['删除', '保留']
            }, function() {
                // 删除掉自己的父.父
                _this.parentElement.parentElement.parentElement.removeChild(_this.parentElement.parentElement)
                sendAjax({
                    url: '/cart/api/removeOne',
                    method: 'post',
                    headers: {
                        Authorization: localStorage.getItem('token')
                    },
                    data: {
                        userid: getCookie('userid'),
                        goodsid: _this.dataset.id
                    },
                    success: res => {
                        console.log(res);
                        if(res.errorCode === 0) {
                            layer.msg('删除成功', {
                                icon: 1,
                                time: 1500
                            })
                            total()
                        } else {
                            layer.msg('删除成功', {
                                icon: 2,
                                time: 1500
                            })
                        }
                    }
                })
                
            }, function() {
                layer.msg('保留成功', {
                    icon: 1,
                    time: 1500
                })
            })
            
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
        btn.onclick = function() {
            // 获取自己的下一个标签的内容
            var num = +this.nextElementSibling.value
            // 自增
            num++
            // 放到自己的下一个标签中
            this.nextElementSibling.value = num
            // h5提供了一个快速操作属性值的api - 属性必须是 data-XX
            // 通过标签.dataset属性获取
            // console.log( this.parentElement.dataset );
            // 发请求让数据库的数量也发生更改
            changenumber(num, this.parentElement.dataset.id)
            total()
        }
    })
    reduceBtns.forEach(btn => {
        btn.onclick = function() {
            // 获取自己的下一个标签的内容
            var num = +this.previousElementSibling.value
            // 自减
            num--
            // 限制
            if(num < 1) {
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
    sendAjax({
        url: '/cart/api/changenumber',
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
        item.onchange = function() {
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
        input.onchange = function() {
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
// 定义用户退出函数
function logout() {
    // 询问用户
    layer.confirm('你真的要退出吗？', {
        btn: ['残忍退出', '考虑一下']
    }, function() { // 点击了第一个按钮后要执行的函数
        // 删除cookie
        removeCookie('username')
        removeCookie('userid')
        // 删除token
        localStorage.removeItem('token')
        layer.msg('退出成功', {
            icon: 1,
            time: 2000
        }, function() {
            // 换内容
            logStatus.innerHTML = `
                <li><a href="/login.html">登录</a></li>
                <li><a href="/register.html">注册</a></li>
            `
            // 跳转到首页
            location.href = '/'
        })
    }, function() {
        // 提示
        layer.msg('没有退出', {
            icon: 1,
            time: 2000
        })
    })
}