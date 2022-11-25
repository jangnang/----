var form = document.querySelector('form')
var usernameInput = document.querySelector('[name="username"]')
var passwordInput = document.querySelector('[name="password"]')
var repassInput = document.querySelector('[name="repass"]')
var emailInput = document.querySelector('[name="email"]')
form.onsubmit = function () {
    var usernameReg = /^[a-zA-Z][a-zA-Z0-9]{3,9}$/
    if (!usernameReg.test(usernameInput.value)) {
        alert('用户名不符合规则')
        return false
    }
    var passwordReg = /^.{6,10}$/
    if (!passwordReg.test(passwordInput.value)) {
        alert('密码不符合规则')
        return false
    }
    if (passwordInput.value != repassInput.value) {
        alert('两次密码输入不一致')
        return false
    }
    var emailReg = /(^[1-9]\d{5,9}@qq\.com$)|(^[a-zA-Z]\w{5,17}@((126|163)\.com|yeah\.net)$)/
    if (!emailReg.test(emailInput.value)) {
        alert('邮箱不符合规则')
        return false
    }
   form.onsubmit = function () {
     
        request({
            // url: 'http://localhost:3000/api/users/register',
            // 跨域了，用proxy
            url: '/api/users/register',
            method: 'post',
            data: {
                username: usernameInput.value,
                password: passwordInput.value,
                email: emailInput.value
            }
        }).then(res => {
            // console.log(res);
            var {
                error_code,
                msg
            } = res
            alert(msg)
            if (error_code === 0) {
                location.href = './login.html'
            }
        })
        return false
    }
}