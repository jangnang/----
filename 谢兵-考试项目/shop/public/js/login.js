document.querySelector('form').onsubmit = function () {
    var username = document.querySelector('[name="username"]').value
    var password = document.querySelector('[name="password"]').value
    request({
        url: '/api/users/login',
        method: 'post',
        data: {
            username,
            password
        }
    }).then(res => {
        var {
            error_code,
            msg
        } = res
        alert(msg)
        if (error_code === 0) {
            setCookie('username', username, 7200 + 3600)
            setCookie('userid', res.data.userid, 7200 + 3600)
            localStorage.setItem('token', res.data.token)
            // 判断是否有存储过的地址，有就跳到存储的地址，没有就跳到首页
            var url = localStorage.getItem('url')
            if (url) {
                localStorage.removeItem('url')
                location.href = url
            } else {
                location.href = '/'
            }
        }
        console.log(res);
    })
    return false
}