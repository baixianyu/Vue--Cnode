var botleft = document.getElementById('botleft');
    /*
	封装绑定事件处理函数的工具函数
		addEventListener()
    */ 
var t = (function (){
	function on(element,evName,evFn){
		element.addEventListener(evName,evFn);	
	}

	function off(element,evName,evFn){
		element.removeEventListener(evName,evFn);	
	}
	
	// 把这些方法暴露出去

	return {
		on:on,
		off:off
	}

})()
    //生成结构函数
    var html = '';
    var z = 999999;
    for(var j in data){
        if(data[j].pid < z) {
            z = data[j].pid
        }
    }
    //把当前元素的子级放入数组中
    function getChild(data,num){
        var childArr = [];
        for(var i in data){
            if(data[i].pid == num){
                childArr.push(data[i])
            }
        }
        return childArr
    }
    //生成左边的树状图
    function fnAdd (data,num,n){  
        n++;
        var newArr = getChild(data,num)
        if(newArr.length > 0){//如果当前元素有子级
            html += '<ul>'
            for(var j = 0;j < newArr.length; j++){
                html += `<li>
                    <div data-id=${newArr[j].id} style="padding-left:${n*25}px;">
                        <span>${newArr[j].title}</span>
                    </div>`
                fnAdd(data,newArr[j].id,n)
                html += '</li>'
            }
            html += '</ul>'
        }
        return html
    }
   botleft.innerHTML =  fnAdd(data,z,-1);
   //控制左侧树状图的隐藏
    var uls = botleft.getElementsByTagName('ul')
    // for(var i = 0; i < uls.length; i++){
    //    uls[i].style.display = 'none';
    // }
    // uls[0].style.display = 'block';
    var spans = botleft.getElementsByTagName('span');
    var divs = botleft.getElementsByTagName('div')
    fnZuoShuTu(spans,divs)//给span和div加样式
    function fnZuoShuTu(span,div){
        for(var i = 0; i < span.length; i++){
            if(div[i].nextElementSibling){
                span[i].className = 'botLeftTxet botLeftYouMeiN';//有内容 没点开
            }else{
                span[i].className = 'botLeftTxet botLeftMeiNeiM';//没内容
            }
        }
        //给左侧树状图的div添加点击事件
        for(var i = 0; i < div.length; i++) {
            div[i].index = true;//没点开
            div[i].onclick = function (){
                //生成右边导航栏
                shengRigNav(this.dataset.id)
                //生成右边显示
                shengRigCon(this.dataset.id)
                for(var j = 0; j < div.length; j++){
                    div[j].className = '';
                }
                if(this.nextElementSibling){
                    if(this.index){
                        this.className = 'gaoL'
                        this.firstElementChild.className = 'botLeftTxet botLeftYouDianK'//有内容 点开了
                        if(this.nextElementSibling){
                            this.nextElementSibling.style.display = 'block';
                        }
                        this.index = false;
                    }else{
                        this.firstElementChild.className = 'botLeftTxet botLeftYouMeiN';//有内容 没点开
                        this.nextElementSibling.style.display = 'none';
                        this.index = true;
                    }
                }else{
                    if(this.index){
                        this.className = 'gaoL'
                        this.firstElementChild.className = 'botLeftTxet botLeftMeiNeiD'//没内容 点开了
                        this.index = false;
                    }else{
                        this.firstElementChild.className = 'botLeftTxet botLeftMeiNeiM';//没内容 没点开
                        this.index = true;
                    }
                }
            }   
        }
    }
      //-----------------左侧的高亮
      zuoGao(0)
    function zuoGao(id){
        for(var i = 0; i < divs.length; i++){
            if(id == divs[i].dataset.id){
                divs[i].className = "gaoL"
            }else{
                divs[i].className = "";
            }
        }
    }
    //-----------渲染导航区域------------
    function getParentsId(id) {//通过id 找到他所有父级
        var arr = [];
        var key = data[id];
        if(key){
            arr.push(key);
            arr = arr.concat(getParentsId(key.pid));
        }
        return arr;
    }
    var rigNav = document.getElementById('rigNav');//获取右边导航
   
    //生成右边nav结构
    shengRigNav(0);
    function shengRigNav(id){
        //把点击元素的父级存入rigNavData
        var rigNavData = getParentsId(id).reverse();
        var rigHtml = ``;
        if(rigNavData.length > 0){
            for(var i = 0; i < rigNavData.length-1; i++){
                rigHtml += `
                <a  data-id=${rigNavData[i].id} href="javascript:;" class="fl yangs ">${rigNavData[i].title}</a> `
            }
            rigHtml += `<span class="fl rigHeadDian " data-id=${rigNavData[rigNavData.length-1].id}>${rigNavData[rigNavData.length-1].title}</span>`
            rigNav.innerHTML = rigHtml;
        }
    }
    //  有点导航栏的 点击事件
    t.on(rigNav,'click',function(ev) {
        var target = ev.target;
        if(target.nodeName == 'A'){
            shengRigCon(target.dataset.id);//调用函数
            shengRigNav(target.dataset.id);//调用函数
            zuoGao(target.dataset.id)
        }
    })
    //---------------------渲染右边的显示区域---------------
    function getChildId(id) {//通过id找到他子级
        var arr = [];
        for(var m in data){
            if(data[m].pid == id){
                arr.push(data[m])
            }
        }
        return arr;
    }
    //console.log(getChildId(0))
    var rigXian = document.getElementById('rigXian');
    //生成右边下边的显示
    shengRigCon(0)
    function shengRigCon(id) {
        var rigConArr = getChildId(id);
        var rigConHtml = '';
        if(rigConArr.length > 0){
            rigConHtml = '<ul class="rigList fl">'
            for(var i = 0; i < rigConArr.length; i++){
                rigConHtml += `
                    <li data-id=${rigConArr[i].id} class="fl">
                        <p class=""></p>
                        <div class="rigImg"></div>
                        <span class="rigText">${rigConArr[i].title}</span>
                        <input  data-id=${rigConArr[i].id} class="chongM" type="text">
                    </li>
                `
            }
        }else{
            rigConHtml += ` <ul class="rigList noWenJ fl"> `
        }
        rigConHtml += '</ul>';
        rigXian.innerHTML = rigConHtml;
    }
    //点击文件函数
    t.on(rigXian,'click',function(ev) {
        var target = ev.target;
        if(target.nodeName == 'DIV'||target.nodeName == 'SPAN' ){
            target = ev.target.parentNode;
        }
        if(target.nodeName == 'LI'){
            zuoGao(target.dataset.id)//左边高亮
            shengRigCon(target.dataset.id);//生成右边内容
            shengRigNav(target.dataset.id);//生成右边导航栏
        }
        //单选  左上角的p
        if(target.nodeName == 'P'){
            if(target.classList.contains('kuang')){
                target.className = 'gou';
            }else{
                target.className = 'kuang';
            }
            fnQuan();
        }
        
    })
    //---------------------------------文件点击选中函数
    //鼠标移入的时候
    t.on(rigXian,'mouseover',function(ev) {
        var target = ev.target;
        if(target.nodeName == 'DIV'||target.nodeName == 'SPAN'||target.nodeName == 'P' ){
            target = ev.target.parentNode;
        }
        if(target.nodeName == 'LI'){
            if(!target.classList.contains('noWenJ')){
                target.classList.add('LiYIRu');
                if(!target.firstElementChild.classList.contains('gou')){
                    target.firstElementChild.classList.add('kuang');
                }
               
            }
        }
    })
    //鼠标移出的时候
    t.on(rigXian,'mouseout',function(ev) {
        var target = ev.target;
        if(target.nodeName == 'DIV'||target.nodeName == 'SPAN'||target.nodeName == 'P' ){
            target = ev.target.parentNode;
        }
        if(target.nodeName == 'LI'){
            if(!target.classList.contains('noWenJ')){
                if(!target.firstElementChild.classList.contains('gou')){
                    target.classList.remove('LiYIRu');
                    target.firstElementChild.classList.remove('kuang');
                }
            }
        }
    })
    //----------------------全选-----------------------------
    var quanx = document.getElementById('quanx');
    quanx.index = true;//未点击
    quanx.onclick = function () {
        if(ps.length>0){
            if(this.index){
                this.className = 'onQuanx';
                this.index = false;
                for(var i = 0; i < ps.length; i++){
                    ps[i].className = 'gou';
                    ps[i].parentNode.classList.add('LiYIRu');
                }
            }else{
                for(var i = 0; i < ps.length; i++){
                    ps[i].className = '';
                    ps[i].parentNode.classList.remove('LiYIRu');
                }
                this.className = 'quanx';
                this.index = true;
            }
        }      
    } 
    //全选按钮
    function fnQuan(){
        var n = 0;
        //判断全选按钮
        for(var i = 0; i < ps.length; i++){
            if(ps[i].classList.contains('gou')){
                n++;
            }
        }
        if(n == ps.length){
            quanx.className = 'onQuanx';
            quanx.index = false;
        }else{
            quanx.className = 'quanx';
            quanx.index = true;
        }
    }
    //---------------------框选------------------------------
    //是否需要框选
    var kuangXuan = true;//可以进行框选
    document.onmousedown = function (ev){
        if(!kuangXuan){
            return;
        }
        var parentX = fn(rigXian).left;
        var parentY = fn(rigXian).top;
        var lis = rigXian.getElementsByTagName('li');
        //生成div
        var div = document.createElement('div');
        //
        var x = ev.clientX  - parentX;
        var y = ev.clientY  - parentY;
        document.onmousemove = function (ev){
            if(Math.abs(ev.clientX  - parentX  - x) > 50 || Math.abs(ev.clientY  - parentY - y) >50){
                rigXian.appendChild(div);
                div.className = 'box';
                div.style.width = 0;
                div.style.height = 0;
                div.style.left = x + 'px';
                div.style.top = y + 'px';
                div.style.width = Math.abs(ev.clientX  - parentX  - x) + 'px';
                div.style.height = Math.abs(ev.clientY  - parentY - y) + 'px';
                div.style.left = Math.min(x,ev.clientX  - parentX) + 'px';
                div.style.top = Math.min(y,ev.clientY - parentY) + 'px';
                //判断是否碰撞
                for( var i = 0; i < lis.length; i++ ){
                    if(peng(div,lis[i])){
                        lis[i].classList.add('LiYIRu');
                        lis[i].firstElementChild.className = 'gou';
                        fnQuan();
                    }else{//重新框选的时候
                        lis[i].className = 'fl';
                        lis[i].firstElementChild.className = '';
                        fnQuan();
                    }
                }
            }
        }
        document.onmouseup = function (){
            document.onmousemove = null;
            div.remove();
        }
        //清除默认行为
        return false;
    }
    //到可视区域的距离
    function fn (el) {
        return el.getBoundingClientRect(); //到可视区域的距离
    }
    //碰撞函数
    function peng(box1,box2) {
        var getdiv = fn(box1);
        var getbox2 = fn(box2);
        if(
            getdiv.right < getbox2.left ||
            getdiv.bottom < getbox2.top ||
            getdiv.left > getbox2.right ||
            getdiv.top > getbox2.bottom
        ){
            return false;
        }else{
            return true;
        }
    }
    var zhezhao = document.getElementById('zhezhao');//遮罩
//----------------------删除----------------------
    var ps = rigXian.getElementsByTagName('p')
    //删除
    var nav = document.getElementById('nav');
    var shanc = nav.querySelector('.shanc');
    //确定按钮
    var suDelete = document.getElementById('suDelete');
    shanc.onclick = function (){
        var m = 0;
        for(var i = 0; i <ps.length; i++){
            if(ps[i].classList.contains('gou')){
                m++;
            }
        }
        if(m == 0){
            alert('请选中要能重命名的文件');
            return;
        }else{
            suDelete.style.display = 'block';
            zhezhao.style.display = 'block';
        }
        
    }
    var qued = suDelete.querySelector('.qued');
    var quxiao = suDelete.querySelector('.quxiao');//取消按钮
    qued.onclick = function (){ //删除对象 delete
        quanx.className = 'quanx';
        quanx.index = true;
        var id = 0;//储存id
        var parentId = '';
        for(var i = 0; i < ps.length; i++){
            if(ps[i].classList.contains('gou')){
                id = ps[i].parentNode.dataset.id;
                for(var j in data){
                    if(data[j].id == id){
                        parentId = data[j].pid;
                    }
                    //删除选中元素和他子级
                    if(data[j].id == id || data[j].pid == id){
                        delete data[j]
                    }
                }
            }  
        }
        suDelete.style.display = 'none';
        zhezhao.style.display = 'none';
        html = '';
        botleft.innerHTML =  fnAdd(data,z,-1)//生成左边树状图
        fnZuoShuTu(spans,divs)//给左边树状图加样式
        shengRigCon(parentId);//调用函数 右边li显示
        shengRigNav(parentId);//调用函数 右边nav显示
        zuoGao(parentId)//左边高亮
    }
    //点击取消
    quxiao.onclick = function (){
        suDelete.style.display = 'none';
        zhezhao.style.display = 'none';
    }
    //点击右上角的x
    var gbanN = suDelete.querySelector('.gbanN');//取消按钮
    gbanN.onclick = function (){
        suDelete.style.display = 'none';
        zhezhao.style.display = 'none';
    }
    //---------------------重命名----------------
    var chongmmm = nav.querySelector('.chongmmm');
    chongmmm.onclick = function () {
        kuangXuan = false;
        var lis = rigXian.querySelectorAll('li')
        var inps = rigXian.getElementsByTagName('input')
        var m = 0;//记录选了几个
        var PsiId = ''; //记录选的第几个
        for(var i = 0; i <ps.length; i++){
            if(ps[i].classList.contains('gou')){
                m++;
            }
        }
        if(m == 0){
            alert('请选中要能重命名的文件');
            kuangXuan = true;
            return;
        }else if(m > 1){
            alert('不能重命名多个文件');
            for(var i = 0; i < ps.length; i++){
                if(ps[i].classList.contains('gou')){
                    PsiId = i;
                    i = ps.length;
                }
            }
            //清空li的选中状态
            for(var b = 0; b <lis.length; b++){
                lis[b].className = 'fl';
                ps[b].className = '';
            }
            //全选清空
            quanx.className = 'quanx';
            quanx.index = true;
        }else{
            for(var i = 0; i < ps.length; i++){
                if(ps[i].classList.contains('gou')){
                    PsiId = i;
                    i = ps.length;
                }
            }
        }
        inps[PsiId].style.display = 'block';
        inps[PsiId].value = inps[PsiId].previousElementSibling.innerHTML;
        inps[PsiId].select();
        ps[PsiId].className = '';
        inps[PsiId].parentNode.className = 'fl';
        rigXian.onclick = function (ev){
            var target = ev.target;
            if(target.nodeName == 'INPUT'){
                inps[PsiId].focus();
                return;
            }else{
                for(var i in data){
                    if(data[i].id == inps[PsiId].dataset.id){
                        if(inps[PsiId].value != ''){
                            data[i].title = inps[PsiId].value;
                            shengRigCon(data[i].pid);//生成右边内容
                            html = '';
                            botleft.innerHTML =  fnAdd(data,z,-1);//重新生成左边树状图
                            fnZuoShuTu(spans,divs);//给左边加样式
                            kuangXuan= true;
                            rigXian.onclick = null;
                            return false;
                        }else{
                            alert('文件名不能为空')
                            return;
                        }
                    }
                }
            }
            kuangXuan= true;
            rigXian.onclick = null;
            return false;
        }
    }
//-------------------新建文件夹-------------------
    var xinjian = nav.querySelector('.xinjian');
    xinjian.index = true;//可以点
    xinjian.onclick = function (){
        if(!xinjian.index){
            return;
        }
        xinjian.index = false;
        var rigList = rigXian.querySelector('.rigList');
        var span =  rigNav.querySelector('span');
        //获取他父级的id
        var XinPid = '';//存生成元素父级的id
        XinPid = span.dataset.id;
        //点击新建的时候生成结构
        rigList.innerHTML += `
             <li class="fl LiYIRu">
                <p class="gou"></p>
                <div class="rigImg"></div>
                <input id="inp" class="chongM block" type="text">
            </li>
        `
        inp.focus();//把焦点给到inp
       // 事件委托
       rigXian.onclick =function (ev){
            //生成id
            var time = Date.now();
            var arr = [];//存放新生成li的同级
            var inpValue = inp.value;
            var m = 0;
            for(var i in data){
                if(data[i].pid == XinPid){
                    arr.push(data[i]);
                }
            }
            var target = ev.target;
            if(target.nodeName == 'INPUT'){
                inp.focus();
                return;
            }else if(target.nodeName == 'DIV'){
                target = ev.target.parentNode;
            }
            if(target.nodeName == 'LI'){
               
                return;
            }else{
                if(inpValue){
                    for(var i = 0; i < arr.length; i++){
                        if(arr[i].title == inpValue){
                            m++
                        }
                    }
                    if ( m > 0){
                        alert('名字已存在，请重新输入')
                        shengRigCon(XinPid);//重新渲染 右侧显示区域；
                        xinjian.index = true;
                        return;
                    }else{
                        data[time] = {id:time,pid:XinPid,title:inpValue}
                        shengRigCon(XinPid);//重新渲染 右侧显示区域；
                        html = '';//清空左边
                        botleft.innerHTML =  fnAdd(data,z,-1);//重新渲染左侧树状图
                        fnZuoShuTu(spans,divs);//左边高亮
                        xinjian.index = true;
                        rigXian.onclick = null;
                    }
                }else{
                    alert('名字不能为空')
                    rigXian.onclick = null;
                    shengRigCon(XinPid);//重新渲染 右侧显示区域；
                    xinjian.index = true;
                }
            } 
       }
    }
    //-----------------移动到-----------
  var yidongd = document.querySelector('.yidongd');
  var stoLoc = document.getElementById('stoLoc');
  yidongd.onclick = function () {
      kuangXuan = false;
      var stoCon = stoLoc.querySelector('.stoCon');
      var m = 0;
      var spanR = stoCon.getElementsByTagName('span');
      var divR = stoCon.getElementsByTagName('div');
      var stoQueD = stoLoc.querySelector('.stoQueD');//确定按钮
      stoQueD.index = true;//可以点
      var stoQuXiao = stoLoc.querySelector('.stoQuXiao');//取消按钮
      var stoGuan = stoLoc.querySelector('.stoGuan');//x 关闭
      var psID = 0;//存放div中间显示的文件夹的pid
      var PpsId = 0;//存放中间div的pid
      var rigID = 0;//存放右边的腰移动到的文件夹的id
      var psIDarr = [];//存放所有选中的文件夹的id；
      for(var i = 0; i < ps.length; i++){
          if(ps[i].classList.contains('gou')){
              m++;
              psID = ps[i].parentNode.dataset.id;
              i = ps.length;
          }
      }
      if(m > 0){
          //找到选中文件的pid
        for(var v in data){
            if(data[v].id == psID){
                PpsId = data[v].pid;
                v = data.length;
            }
        }
        //找到所有选中元素的id；
        for(var i = 0; i < ps.length; i++){
            if(ps[i].classList.contains('gou')){
                psIDarr.push(ps[i].parentNode.dataset.id);
            }
        }
        //判断是不是他本身和子级
        function fnpsIDarr(data) {
            for(var c= 0; c < psIDarr.length; c++){
                if(psIDarr[c] == data.id){
                    alert('不能将文件移动到自身或其子文件夹下');
                    stoQueD.index = false;
                    return;
                }
            }
        }
        stoLoc.style.display = 'block';
        zhezhao.style.display = 'block';
        html = '';
        stoCon.innerHTML = fnAdd(data,z,-1);
      }else{
          alert('请选择文件');
          return;
      }
      //给span加样式
      for(var i = 0; i < spanR.length; i++){
          if(divR[i].nextElementSibling){
            spanR[i].className = 'stoConText stoConYouMeiN';//有内容 没点开
          }else{
            spanR[i].className = 'stoConText stoConMeiNeiM';//没内容
          }
      }
      //给div 加点击和高亮；
      for(var i = 0; i < divR.length; i++){
         divR[i].onclick = function (){
            stoQueD.index = true;
            for(var z = 0; z <divR.length; z++){
                divR[z].className = '';
            }
            this .className = 'gaoL';
            rigID = this.dataset.id;
            var arrPaCh = getParentsId(rigID);//存放显示区域的本身和他父级；
            i = divR.length;
            if(PpsId == rigID){//判断父级
                alert('文件已经在该文件夹下');
                stoQueD.index = false;
                return;
            }else{
                for(var j = 0; j < arrPaCh.length;j++){
                    //判判断是否是本身或子级
                    fnpsIDarr(arrPaCh[j]);
                }
            }
        }
     }
     //点击确定按钮
     stoQueD.onclick = function () {
        if(!stoQueD.index){
            alert('文件已经在该文件夹下，或不能将文件移动到自身或其子文件夹下，请重新选择')
            return;
        }
        for(var j = 0; j < ps.length; j++){
            if(ps[j].classList.contains('gou')){
                data[ps[j].parentNode.dataset.id].pid = rigID;
            }
        }         
        shengRigNav(rigID)//生成右边nav
        shengRigCon(rigID)//生成右边li结构
        //生成左边树状图
        html = '';
        botleft.innerHTML =  fnAdd(data,z,-1);
        fnZuoShuTu(spans,divs);//左侧树状图样式
        zuoGao(rigID)//左侧高亮
        stoLoc.style.display = 'none';
        zhezhao.style.display = 'none';
        //移动完了之后全选的状态
        quanx.className = 'quanx';
        quanx.index = true;
        kuangXuan = true;
     }
     stoGuan.onclick = function (){
        stoLoc.style.display = 'none';
        zhezhao.style.display = 'none';
        kuangXuan = true;
     }
     stoQuXiao.onclick = function(){
        stoLoc.style.display = 'none';
        zhezhao.style.display = 'none';
        kuangXuan = true;
     }
  }