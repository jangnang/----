// 获取登录按钮
var btn = document.querySelector('.submit')

// 点击事件 - 登录提交
btn.onclick = function() {
    var username = document.querySelector('[name="username"]').value
    var password = document.querySelector('[name="password"]').value
    if(username === '' || password === '') {
        layer.msg('输入不能够为空', {
            icon: 2,
            time: 1500
        })
        return
    }
    // 加载层
    var loadid = layer.load(2, {
        shade: [1, '#000']
    })
    sendAjax({
        method: 'post',
        url: '/users/api/login',
        data: {
            username,
            password
        },
        success: res => {
            console.log(res);
            // 去掉加载层
            layer.close(loadid)
            var {errorCode, message} = res
            

            if(errorCode === 0) {
                // 登录成功
                // 提示信息
                layer.msg(message, {
                    time: 1500,
                    icon: 1
                }, function() {
                    // 设置cookie
                    setCookie('username', username, 7200)
                    setCookie('userid', res.data.userid, 7200)
                    // 存储token
                    window.localStorage.setItem('token', res.data.token)
                    // 获取本地存储的url
                    var url = window.localStorage.getItem('url')
                    // console.log(url);
                    if(url){
                        window.localStorage.removeItem('url')
                        location.href = url
                    } else {
                        // 跳转
                        location.href = '/'
                    }
                    
                })
                
            } else {
                layer.msg(message, {
                    time: 1500,
                    icon: 2
                })
            }
        }
    })
}