// 获取标签
var logStatus = document.querySelector('.logStatus')
// 获取cookie
var username = getCookie('username')
// 判断是否存在
if(username) {
    // 存在就显示用户名密码 - 修改标签中内容
    logStatus.innerHTML = `
        <li style="line-height: 50px;">欢迎<a style="display: inline;" href="/usercenter.html">${username}</a></li>
        <li><a href="javascript:;">退出</a></li>
    `
}