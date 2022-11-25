function setCookie(key, value, seconds, path = '/') {
    var date = new Date()
    date.setTime(date.getTime() - 8*3600*1000 + seconds*1000)
    document.cookie = `${key}=${value};expires=${date};path=${path}`
}
function getCookie(key) {
    var reg = /([^; =]+)=([^;]+)/g;
    do{
        var arr = reg.exec(document.cookie)  
        if(arr && arr[1] === key) {
            return arr[2]
        }
    }while(arr)
}

// 删除cookie的函数
function removeCookie(key, path='/') {
    setCookie(key, null, -1, path)
}