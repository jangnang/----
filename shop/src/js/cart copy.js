// 检查用户是否登录
var username = getCookie('username')
console.log(username);
if(!username) {
    // 强制去登录
    layer.msg('请先登录！', {
        icon: 2,
        time: 2000
    }, function() {
        // 存储url
        localStorage.setItem('url', location.href)
        // 跳转
        location.href = '/login.html'
    })
} else {
    // 展示用户名
    var logStatus = document.querySelector('.logStatus')
    logStatus.innerHTML = `
        <li style="line-height: 50px;">欢迎<a style="display: inline;" href="/usercenter.html">${username}</a></li>
        <li><a href="javascript:;" onclick="logout()">退出</a></li>
    `
    // 发请求 - 获取购物车数据
    // 获取用户id
    let userid = getCookie('userid')
    // 获取token
    var token = localStorage.getItem('token')
    sendAjax({
        url: '/cart/api/list/' + userid,
        headers: {
            Authorization: token
        },
        success: res => {
            // console.log(res);
            var data = res.data
            // 判断是否有数据
            if(data) {
                // 根据data中的商品id获取商品数据
                var ids = data.map(item => item.goodsid)
                console.log(ids);
                sendAjax({
                    headers: {
                        Authorization: token
                    },
                    method: 'post',
                    url: '/goods/api/cartgoods',
                    data: {
                        goodsids: JSON.stringify(ids)
                    },
                    success: res => {
                        console.log(res.data);
                        // 渲染数据
                        var html = ''
                        data.forEach(item => {
                            var obj = res.data.goods.find(v => v._id === item.goodsid)
                            html += `
                                <tr>
                                    <th><input type="checkbox" name="selectOne">单选</th>
                                    <th>
                                        <img src="${obj.goodsimg1}" alt="">
                                    </th>
                                    <th>10</th>
                                    <th>
                                        <input type="button" name="add" value="+">
                                        <input type="text" name="number" value="${item.goodsnumber}">
                                        <input type="button" name="reduce" value="-">
                                    </th>
                                    <th>${10 * item.goodsnumber}</th>
                                    <th>
                                        <button class="btn btn-danger">删除</button>
                                    </th>
                                </tr>
                            `
                        })
                        document.querySelector('.goods tbody').innerHTML = html
                        
                    }
                })
                
            } else {
                // 显示购物车为空
                document.querySelector('.goods').innerHTML = `
                    <div class="jumbotron">
                        <h1>购物车是空的!</h1>
                        <p>赶快去列表页精心挑选商品吧！</p>
                        <p><a class="btn btn-primary btn-lg" href="/list.html" role="button">去列表页</a></p>
                    </div>
                `
            }
        }
    })
}
// 退出登录
function logout() {
    layer.confirm('你确定要退出吗？', {
        btn: ['确定', '取消']
    }, function() {
        // 删除cookie
        removeCookie('username')
        removeCookie('userid')
        localStorage.removeItem('token')
        // 切换页面内容
        logStatus.innerHTML = `
            <li><a href="/login.html">登录</a></li>
            <li><a href="/register.html">注册</a></li>
        `
        // 确定后要执行的函数
        layer.msg('退出成功', {
            icon: 1,
            time: 1500
        })
    }, function() {
        layer.msg('取消成功', {
            icon: 1,
            time: 1500
        })
    })
}

/*
逻辑总结：
    查询购物车表 - data = [{goodsid: 1, goodsnumber, userid}]
    需要通过goodsid查询对应的商品信息
        将购物车数据中的所有商品id组成数组
            var ids = 数组.map(item => item.goodsid)
    发送请求
        接口中 - 商品数组 = goodsModel.find({_id: {$in: ids}})
    渲染数据
        遍历data - 每一项是一个对象
            每个对象中的goodsid到商品数组中找到对应的商品信息对象

*/