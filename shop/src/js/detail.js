// 发请求
// 从地址栏获取到商品id
var reg = /id=(\w+)/
var arr = location.search.match(reg)
// console.log(arr);
if(!arr || !arr[1]) {
    layer.msg('非法访问！', {
        icon: 2,
        time: 1500
    }, function() {
        location.href = '/list.html'
    })
}
var goodsid = arr[1]
// console.log(goodsid);
// $.get('/goods/api/detail/'+goodsid, function(res) {
//     console.log(res);
//     $('.goods h4').text(res.data.goodsname)
// })

$.get('/goods/api/detail/'+goodsid).then(res => {
    // console.log(res);
    $('.goods h4').text(res.data.goodsname)
    // return $.post('/cart/api/add', {
    //     goodsid,
    //     userid,
    //     goodsnumber
    // })

    addcart()
    
})

function addcart() {
    $('.addcart').click(function() {
        // 判断用户是否登录
        if(!username) {
            // 提示用户先登录
            layer.msg('请先登录', {
                icon: 2,
                time: 1500
            }, function() {
                // 先将当前页面的url保存下来 - 在登录页能获取到的地方
                // 浏览器还有另外一种存储技术 - 本地存储
                window.localStorage.setItem('url', location.href)
                location.href = '/login.html'
            })
            return false
        }
        // 获取token
        var token = window.localStorage.getItem('token')
        if(!token) {
            layer.msg('请先登录', {
                icon: 2,
                time: 1500
            }, function() {
                window.localStorage.setItem('url', location.href)
                location.href = '/login.html'
            })
            return false
        }
        console.log(token);
        var userid = getCookie('userid')
        var goodsnumber = 1
        $.ajax('/cart/api/add', {
            method: 'post',
            headers: {
                'Authorization': token
            },
            data: {
                goodsid,
                userid,
                goodsnumber
            }
        }).then(res => {
            // console.log(res);
            if(res.errorCode === 0) {
                layer.msg(res.msg, {
                    icon: 1,
                    time: 1500
                })
            } else {
                layer.msg(res.msg, {
                    icon: 2,
                    time: 1500
                })
            }
        })
    })
}

/*
逻辑总结：
    在详情页必须有列表页从地址栏传递的商品id来
    获取地址栏中的商品id
        获取不到，非法访问，强制跳转到列表页
    获取到了
    发请求获取商品详情数据
    渲染页面
    给添加购物车的按钮绑定点击事件
    判断用户是否登录
        获取cookie中的用户名
            获取不到 - 没有登录，将当前url存储在本地存储，强制跳转到登录页
        获取到 - 登录成功
    发请求添加购物车 - token/userid

登录成功后：
    本地存储中存储token
    cookie中存储userid - 修改接口，响应的数据中携带用户id
    判断本地存储是否有需要跳转的地址
        没有 - 跳转到首页
        有 - 跳转到存储的url

*/