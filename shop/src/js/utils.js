/**
 * 获取某个范围的随机整数
 * @param {string} a 表示范围的数字
 * @param {string} b 表示范围的数字
 * @return {string} 最终需要的范围内的随机整数
 */
function getRandom(a, b = 0) {
    var max = a
    var min = b
    if(a < b) {
        max = b
        min = a
    }
    return parseInt(Math.random() * (max - min)) + min
}
/**
 * 获取随机颜色的函数
 * @param {boolean} hex 表示是否需要16进制的颜色值
 * @return {string} 最终生成的随机颜色值
 */
function getColor(hex = false) {
    if(hex) {
        var color = '#'
        for(var a=0; a<3; a++) {
            var num = getRandom(256).toString(16)
            num = num.length === 1 ? '0' + num : num
            color += num
        }
        return color
    }
    var arr = []
    for(var a=0; a<3; a++) {
        arr.push(getRandom(256)) 
    }
    var color = 'rgb('+arr.join()+')'
    return color
}
/**
 * 批量设置样式的函数
 * @param {DOM-object} element 要设置样式的标签对象
 * @param {object} styleObj 要设置的样式组成的对象
 */
function setStyle(element, styleObj) {
 
    var cssText = ''
    for(var key in styleObj) {
        cssText += key + ':' + styleObj[key] + ';'
       
    }
    element.style.cssText += cssText
}
/**
 * 获取样式的函数
 * @param {object-element} ele 要获取样式标签
 * @param {string} key 要获取样式的css键
 */
function getStyle(ele, key) {
    return window.getComputedStyle(ele)[key]
}
/**
 * 动画函数
 * @param {node} ele 要动画的标签元素
 * @param {object} obj css键值对组成的对象
 * @param {function} fn 动画结束后要执行的函数
 */
function animate(ele, obj, fn = function() {}) {
    let k = 0
    for(let key in obj) {
        k++
        let target = obj[key]
        if(key === 'opacity') target *= 100
        let l = getStyle(ele, key)
        if(key === 'opacity') l *= 100
        l = parseInt(l)
        let timerId = setInterval(function() {
            let speed = (target - l)/10
            l += speed > 0 ? Math.ceil(speed) : Math.floor(speed)
            ele.style[key] = key === 'opacity' ? l/100 : l + 'px'
            if(l === target) {
                clearInterval(timerId)
                if(--k === 0) fn()
            }
        }, 20)
    }
}
/**
 * 深拷贝函数
 * @param {object} data 要拷贝的数据
 * @return {object} target 深拷贝出的数据
 */
function cloneData(data) {
    if(Object.prototype.toString.call(data) === '[object Object]')
        var target = {}
    else if(Object.prototype.toString.call(data) === '[object Array]')
        var target = []
    else 
        return data
    for(var key in data) {
        if(typeof data[key] === 'object') {
            target[key] = fn(data[key])
        } else {
            target[key] = data[key]
        }
    }
    return target
}
/**
 * 设置cookie的函数
 * @param {string} key 存储的cookie的键
 * @param {string} value 存储的cookie的值
 * @param {number} seconds cookie有效期秒数
 * @param {string} path 生效路径
 */
function setCookie(key, value, seconds, path = '/') {
    var date = new Date()
    date.setTime(date.getTime() - 8*3600*1000+seconds*1000)
    document.cookie = `${key}=${value};expires=${date};path=${path}`
}
/**
 * 获取cookie的函数
 * @param {string} key 要获取的cookie的键
 * @return {string} 返回key对应的值
 */
function getCookie(key) {
    var reg = /([^=; ]+)=([^;]+)/g
    while(true) {
        var arr = reg.exec(document.cookie)
        if(!arr) {
            break
        }
        if(arr[1] === key) {
            return arr[2]
        }
    }
}
/**
 * 删除cookie的函数
 * @param {string} key 要删除的cookie的键
 * @param {string} path 要删除的cookie的路径
 */
function removeCookie(key, path = '/') {
    setCookie(key, null, -1, path)
}
/**
 * 发送ajax请求的函数
 * @param {object} obj 发送的请求配置项
 */
function sendAjax(obj) {
    if(obj.async === undefined) obj.async = true
    if(typeof obj.async != 'boolean') throw new Error('async必须是布尔值')
    if(obj.method === undefined) obj.method = 'get'
    if(obj.method.toLowerCase() != 'get' && obj.method.toLowerCase() != 'post') throw new Error('请求方式必须是get或post')
    if(typeof obj.url != 'string') throw new Error('请求地址有误404')
    var data = ''
    if(obj.data != undefined) {
        if(Object.prototype.toString.call(obj.data) === '[object Object]') {
            var arr = []
            for(var key in obj.data) {
                arr.push(key + '=' + obj.data[key])
            }
            data = arr.join('&')
        } else if(Object.prototype.toString.call(obj.data) === '[object String]') {
            // if(!obj.data.includes('=')) throw new Error('请求参数有误')
            data = obj.data
        } else throw new Error('请求参数有误')
        if(obj.method.toLowerCase() === 'get') obj.url += '?' + data
    }
    if(obj.success === undefined) obj.success = function() {}
    if(obj.error === undefined) obj.error = function() {}
    if(typeof obj.success != 'function') throw new Error('success必须是函数')
    if(typeof obj.error != 'function') throw new Error('error必须是函数')
    if(obj.dataType === undefined) obj.dataType = 'json'
    var xhr = new XMLHttpRequest;
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            if(xhr.status>=200 && xhr.status<300){
                var res = xhr.responseText;
                switch(obj.dataType.toLowerCase()) {
                    case 'json':
                        res = JSON.parse(res)
                    break
                    case 'text':break
                    case 'xml':
                        res = xhr.responseXML
                    break
                    default:
                        throw new Error('dataType必须是json/xml/text')
                }
                obj.success(res)
            } else {
                obj.error('请求错误')
            }
        }
    }
    xhr.open(obj.method, obj.url, obj.async)
    // 判断是否有头信息传递
    if(obj.headers) {
        for(var key in obj.headers) {
            xhr.setRequestHeader(key, obj.headers[key])
        }
    }
    if(data && obj.method.toLowerCase() === 'post') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.send(data)
        return
    }
    xhr.send()
}
/******************** 调用示例 **********************/
/*
sendAjax({
    method: 请求方式, // 可选项：默认是get，只能是get或post
    url: 请求地址, // 必填项：类型必须是字符串
    dataType: 响应回来的数据的格式, // 可选项：默认是json
    async: true/false, // 可选项：默认是true，异步或同步
    data: 数据, // 可选项：请求携带的参数，可以是字符串，可以是对象
    success: function(res){ // 可选项：请求成功要执行的函数 - res是响应的结果 - 必须是函数
        console.log(res);
    },
    error: function(err) { // 可选项：请求失败要执行的函数 - 必须是函数
        console.log(err);
    }
})
*/