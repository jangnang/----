// 获取标签
var usernameInput = document.querySelector('[name="username"]')
var emailInput = document.querySelector('[name="email"]')
var avatarInput = document.querySelector('[name="avatar"]')
// 发请求获取用户信息展示在表单中
request({
    url: '/api/users/getUsers/' + getCookie('userid'),
    headers: {
        Authorization: localStorage.getItem('token')
    }
}).then(res => {
    console.log(res);
    usernameInput.value = res.data.username
    emailInput.value = res.data.email
    document.querySelector('img').src = res.data.avatar
})

document.querySelector('form').onsubmit = function() {
    var username = usernameInput.value
    var email = emailInput.value
    console.dir(avatarInput);
    // ajax要提交数据带有文件信息 - formData
    var formdata = new FormData()
    formdata.append('username', username)
    formdata.append('email', email)
    formdata.append('avatar', avatarInput.files[0])
    
    request({
        url: '/api/users/editUser/' + getCookie('userid'),
        method: 'put',
        data: formdata,
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(res => {
        var {
            error_code,
            msg
        } = res
        alert(msg)
        if (error_code === 0) {
            removeCookie(username)
            location.href = './login.html'
        }
    })
    return false
}