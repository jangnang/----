 // 获取当前商品的id - 从地址栏中获取商品id
    var reg = /id=([^&]+)/
    var arr = location.search.match(reg)
    console.log(arr);
    if (arr && arr[1]) {
        var id = arr[1]
    }
    // 发请求获取商品详细信息
    var enlarge = document.querySelector('.enlarge')
    var goods = document.querySelector('.goods')
    var bottom = document.querySelector('.bottom')
    request({
        url: '/api/goods/goodsDetail/' + id
    }).then(res => {
        
        console.log(res);
        enlarge.innerHTML = `  <div class="fdj">
        <div class="leftBox">
            <img src="${res.data.data.img_big_logo}" alt="">
            <div class="mark"></div>
        </div>
        <div class="rightBox">
            <img src="${res.data.data.img_big_logo}" alt="">
        </div>
    </div>
        `
        goods.innerHTML = `
        <p >${res.data.data.title}

        </p>
 
        <span><span/>
        <p>${res.data.data.price}<span>元<span></p>
        <button class="addcart">加入购物车</button>
        <button onclick="location.href='cart.html'">去购物车结算</button>
    `
        bottom.innerHTML = res.data.data.goods_introduce
        var leftBox = document.querySelector('.leftBox')
        var mark = document.querySelector('.mark')
        var rightBox = document.querySelector('.rightBox')
        var rightImg = rightBox.querySelector('img')

        //给左边大盒子对象绑定事件
        leftBox.onmouseover = function () {
            //显示蒙版层和右边大盒子
            mark.style.display = 'block'
            rightBox.style.display = 'block'
        }
        leftBox.onmouseout=function(){
            //隐藏蒙版层和右边大盒子
            mark.style.display='none'
            rightBox.style.display='none'
        }

        //给左边大盒子绑定鼠标移动事件
        leftBox.onmousemove=function(e){
            //兼容事件对象
            var e = e || window.event
            //计算蒙版层的移动距离
            var left1=e.pageX-leftBox.offsetLeft-parseInt(mark.offsetWidth/2)
            var top1=e.pageY-leftBox.offsetTop-parseInt(mark.offsetHeight/2)
            // console.log(left1,top1)
            //计算蒙版层最大的移动距离
            var maxX=leftBox.offsetWidth-mark.offsetWidth
            var maxY=leftBox.offsetHeight-mark.offsetHeight

            //创建右边图片的移动距离
            var imgX,imgY
            //判断当前移动距离是否小于等于0
            if(left1<=0){
                mark.style.left='0px'
                imgX=0
            }else if(left1>=maxX){
                mark.style.left=maxX+'px'
                imgX=maxX
            }else{
                mark.style.left=left1+'px'
                imgX=left1
            }

            //垂直方向
            if(top1<=0){
                mark.style.top='0px'
                imgY=0
            }else if(top1>=maxY){
                mark.style.top=maxY+'px'
                imgY=maxY
            }else{
                mark.style.top=top1+"px"
                imgY=top1
            }

            //让图片进行移动
            // rightImg.style.left=-2*imgX+'px'
            // rightImg.style.top=-2*imgY+'px'


            //计算移动比率
            var sclX=imgX/(leftBox.offsetWidth-mark.offsetWidth)
            var sclY=imgY/(leftBox.offsetHeight-mark.offsetHeight)
            //计算右边图片的移动距离
            var x1=sclX*(rightImg.offsetWidth-rightBox.offsetWidth)
            var y1=sclY*(rightImg.offsetHeight-rightBox.offsetHeight)
            //让图片进行移动
            rightImg.style.left=-x1+'px'
            rightImg.style.top=-y1+'px'

        }
        // 加入购物车
        cart()
       
    })

    function cart() {
        document.querySelector('.addcart').onclick = function () {
            // 判断用户是否登录
            var username = getCookie('username')
            if (!username) {
                alert('请先登录')
                // 将当前地址存起来
                localStorage.setItem('url', location.href)
                location.href = '/login.html'
                return false
            }
            // 登录成功
            // 添加购物车，本质就是将当前商品数据存储下来，到购物车页面的时候获取出来展示
            request({
                url: '/api/cart/addcart',
                method: 'post',
                data: {
                    goodsid: id,
                    goodsnumber: 1,
                    userid: getCookie('userid')
                }
            }).then(res => {
                // console.log(res);
                var {
                    error_code,
                    msg
                } = res
                alert(msg)

            })
        }
    }
