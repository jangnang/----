
// 获取所有的ul
var uls = document.querySelectorAll('.goods ul')
// 定义默认第1页
var page = 1
var flag = true
getData()
function getData() {
    if(!flag) return
    flag = false
    // 发送ajax请求获取商品数据
    sendAjax({
        url: '/goods/api/list/' + page,
        success: res => {
            console.log(res);
            // 获取数据
            let data = res.data
            if(!data) {
                return
            }
            // 遍历渲染
            data.forEach(item => {
                // 找最短的ul
                var minUl = getMinUl()
                // 创建一个li
                var li = `
                    <li>
                        <img src="${item.goodsimg1}" alt="">
                        <p>${item.goodsname}</p>
                        <span>${parseInt(Math.random() * 9000) + 1000}</span>
                        <a class="btn btn-primary" href="/detail.html">查看详情</a>
                    </li>
                `
                // 将li放在最短的ul中
                minUl.innerHTML += li
            })
            page++
            flag = true
        }
    })
}

// 监听滚动条事件
window.onscroll = function() {
    var minUl = getMinUl()
    // 判断 - 是否快到了最短的ul的底部了
    var t = document.documentElement.scrollTop || document.body.scrollTop
    if(t + window.innerHeight > $(minUl).offset().top + minUl.offsetHeight - 200) {
        getData()
    }
}

// 获取最短的ul
function getMinUl() {
    var minUl = uls[0]
    for(var a=1; a<uls.length; a++) {
        if(minUl.offsetHeight > uls[a].offsetHeight) {
            minUl = uls[a]
        }
    }
    return minUl
}