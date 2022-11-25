// bootstrap - 前端的框架
var submitBtn = document.querySelector('.submit')
    $('.register-form').validate({
        rules: {
            username: {
                required: true,
                minlength: 4,
                maxlength: 10
            },
            password: {
                required: true,
                minlength: 6,
                maxlength: 12
            },
            repass: {
                required: true,
                equalTo:"#password"
            },
            tel: {
                required: true,
                number:true
            },
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            username: {
                required: '用户名不能为空',
                minlength: '最短4位',
                maxlength: '最长10位'
            },
            password: {
                required: '密码不能为空',
                minlength: '最短6位',
                maxlength: '最长12位'
            },
            repass: {
                required: '确认密码不能为空',
                equalTo:"两次密码输入不一致"
            },
            tel: {
                required: '手机号不能为空',
                number: '手机号错误'
            },
            email: {
                required: '邮箱不能为空',
                email: "邮箱格式错误"
            }
        }
        ,submitHandler: function() {
            let formData = $('.register-form').serialize()
            // 上加载层
            let loadid = layer.load(1, {
                shade: [1, '#000']
            })
            sendAjax({
                method: 'post',
                url: '/users/api/register',
                data: formData,
                success: res => {
                    let {errorCode, message} = res
                    layer.close(loadid)
                    
                    if(errorCode === 0) {
                        layer.msg(message, {
                            icon: 1,
                            time: 2000
                        }, function() {
                            location.href = '/login.html'
                        })
                    } else {
                        layer.msg(message, {
                            icon: 2,
                            time: 2000
                        })
                    }
                }
            })
        }
    })
// }