// 封装发送ajax的get和post请求的函数
function request(obj) {
    return new Promise((resolve, reject) => {
        if(obj.url === undefined) {
            throw new Error('请求地址不能为空！')
        }
        if(typeof obj.url != 'string') {
            throw new Error('请求地址不正确！')
        }
        if(obj.method === undefined) {
            obj.method = 'get'
        }
        // if(obj.method.toLowerCase() != 'get' && obj.method.toLowerCase() != 'post') {
        //     throw new Error('请求方式必须是get或post')
        // }
        if(obj.async === undefined) {
            obj.async = true
        }
        if(typeof obj.async != 'boolean') {
            throw new Error('async必须是布尔值！')
        }
        if(obj.data != undefined) {
            var data = ''
            if({}.toString.call(obj.data) === '[object String]') {
                if(!obj.data.includes('=')) {
                    throw new Error('字符串数据格式：键=值！')
                }
                data = obj.data
            } else if({}.toString.call(obj.data) === '[object Object]') {
                var arr = []
                for(var key in obj.data) {
                    arr.push(key + '=' + obj.data[key])
                }
                data = arr.join('&')
            }
            else if('[object FormData]' === {}.toString.call(obj.data)) {
                data = obj.data
            }
            else {
                throw new Error('数据必须是字符串或对象！')
            }
            if(obj.method.toLowerCase() === 'get') {
                obj.url += '?' + data
            }
        }
        if(obj.dataType === undefined) {
            obj.dataType = 'json'
        }
        var xhr = new XMLHttpRequest
        xhr.open(obj.method, obj.url, obj.async)
        if(obj.headers != undefined) {
            if({}.toString.call(obj.headers) != '[object Object]') {
                throw new Error('headers头信息必须是对象！')
            }
            for(var key in obj.headers) {
                xhr.setRequestHeader(key, obj.headers[key])
            }
        }
        if(obj.method.toLowerCase() === 'post' || obj.method.toLowerCase() === 'put' && data != undefined) {
            if({}.toString.call(data) != '[object FormData]') {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
            }
            xhr.send(data)
        } else {
            xhr.send()
        }
        if(obj.async === true) {
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4) {
                    if(xhr.status >= 200 && xhr.status < 300) {
                        switch(obj.dataType) {
                            case 'json':
                                var res = xhr.responseText
                                res = JSON.parse(res)
                            break
                            case 'text':
                                var res = xhr.responseText
                            break
                            case 'xml':
                                var res = xhr.responseXML
                            break
                            default:
                                throw new Error('dataType必须是json或text或xml！')
                        }
                        resolve(res)
                    } else {
                        reject()
                    }
                }
            }
        } else {
            switch(obj.dataType) {
                case 'json':
                    var res = xhr.responseText
                    res = JSON.parse(res)
                break
                case 'text':
                    var res = xhr.responseText
                break
                case 'xml':
                    var res = xhr.responseXML
                break
                default:
                    throw new Error('dataType必须是json或text或xml！')
            }
            resolve(res)
        }
    })
}