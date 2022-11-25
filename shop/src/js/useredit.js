// 页面一打开 - 发送请求获取用户信息 - 显示在页面中
async function fn() {
    var userinfo = await new Promise((resolve, reject) => {
        sendAjax({
            url: '/users/api/info/' + getCookie('userid'),
            headers: {
                Authorization: localStorage.getItem('token')
            },
            success: res => {
                resolve(res)
            },
            error: () => {
                reject('请求失败')
            }
        })
    })
    // console.log(userinfo);
    // 显示在页面中
    var data = userinfo.data.info
    console.log(data);
    document.querySelector('.avatar').src = data.avatar ? data.avatar : './images/404.png'
    document.querySelector('[name="username"]').value = data.username
    document.querySelector('[name="email"]').value = data.email
    document.querySelector('[name="tel"]').value = data.tel
    document.querySelector('[name="nickname"]').value = data.nickname ? data.nickname : '未设置'

    // 修改提交
    document.querySelector('.submit').onclick = function() {
        var inputFile = document.querySelector('#avatar')
        var avatarImg = inputFile.files[0]
        // console.dir(avatarImg);
        var username = document.querySelector('[name="username"]').value
        var email = document.querySelector('[name="email"]').value
        var tel = document.querySelector('[name="tel"]').value
        var nickname = document.querySelector('[name="nickname"]').value
        new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest;
            xhr.open('put','/users/api/edit/' + getCookie('userid'));
            xhr.setRequestHeader('Authorization', localStorage.getItem('token'))
            // 当发送的数据包含文件信息，我们就不设置 content-type  application/x-www-form-urlencoded 这个请求头了
            // 如果发送的数据有文件信息 - 不能手动设置数据了 - 利用formData去传送数据 - H5内置的api
            var formData = new FormData()
            // console.log(formData);
            // 给formData中追加数据
            formData.append('avatar', avatarImg)
            formData.append('username', username)
            formData.append('email', email)
            formData.append('tel', tel)
            formData.append('nickname', nickname)
            xhr.send(formData)
            xhr.onreadystatechange = function(){
                if(xhr.readyState === 4){
                    if(xhr.status>=200 && xhr.status<300){
                        var res = xhr.responseText;
                        res = JSON.parse(res)
                        console.log(res);
                        if(res.errorCode === 0) {
                            alert(res.msg)
                            location.href = '/usercenter.html'
                        }
                        // console.log(res);
                    }
                }
            }
        })
    }
}

fn()