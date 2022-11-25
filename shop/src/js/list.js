// jquery中发请求的方法
// get请求
/*
$.get(url, data, success回调函数, 响应的数据类型)
*/
// 定义当前页
var page = 1
var pagesize = 6
getData()
function getData() {
    $.get('/goods/api/goodslist/' + page + '/' + pagesize, res => {
        console.log(res);
        var data = res.data.goods
        var html = ''
        data.forEach(item => {
            html += `
                <div class="col-sm-6 col-md-4">
                    <div class="thumbnail">
                    <img src="${item.goodsimg2}" alt="...">
                    <div class="caption">
                        <h3>${item.goodsname}</h3>
                        <p>${item.goodsname}</p>
                        <p><a href="/detail.html?id=${item._id}" class="btn btn-primary" role="button">查看详情</a></p>
                    </div>
                    </div>
                </div>
            `
        })
        $('.goodslist').html(html)
        // 动态渲染分页
        let pageHTML = `
            <li onclick="prev()">
                <a href="javascript:;" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
        `
        let totalPage = res.data.totalPage
        if(totalPage <= 5) {
            for(var a=1; a<=totalPage; a++) {
                pageHTML += `<li onclick="clickPage(${a})" ${page==a?'class="active"':''}><a href="javascript:;">${a}</a></li>`
            }
        } else {
            // 总页数大于5，每页都显示5个页码
            if(page <= 3) {
                for(var a=1; a<=5; a++) {
                    pageHTML += `<li onclick="clickPage(${a})" ${page==a?'class="active"':''}><a href="javascript:;">${a}</a></li>`
                }
            } else if(page >= totalPage - 2) {
                for(var a=totalPage-4; a<=totalPage; a++) {
                    pageHTML += `<li onclick="clickPage(${a})" ${page==a?'class="active"':''}><a href="javascript:;">${a}</a></li>`
                }
            } else {
                for(var a=page-2; a<=page+2; a++) {
                    pageHTML += `<li onclick="clickPage(${a})" ${page==a?'class="active"':''}><a href="javascript:;">${a}</a></li>`
                }
            }
        }
        pageHTML += `
            <li onclick="next(${totalPage})">
                <a href="javascript:;" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        `
        $('.pagination').html(pageHTML)
    })
}
// 上一页的点击函数
function prev() {
    page--
    if(page < 1) {
        return
    }
    getData()
}
// 下一页
function next(totalPage) {
    page++
    if(page > totalPage) {
        return
    }
    getData()
}
// 点击页码
function clickPage(targetPage) {
    if(page == targetPage) {
        return
    }
    page = targetPage
    getData()
}