$(function () {
    var index = 0;
    //设置ul的宽度
    $('#imgList').css('width',$('#imgList li').width() * $('#imgList li').length);


    function next(){
        if(index == $('#imgList li').length){
            index = 0;
        }else if(index == -1){
            index = $('#imgList li').length - 1;
        }
        $('#descList').find('li').eq(index).siblings().removeClass('active');
        $('#descList').find('li').eq(index).addClass('active');
        $('#imgList').css('left',-$('#imgList li').width()*index);
    }

    var timer = setInterval(function () {
          index++;
          next();

    },3000)


    //点击小圆点切换图片
    $('#descList').find('li').on('click',function(){
        console.log($(this).index());
        index = $(this).index();
        next();
    })

    $('#box').hover(function () {
        $('.left').css('display','block');
        $('.right').css('display','block');
        clearInterval(timer);
    },function(){
        $('.left').css('display','none');
        $('.right').css('display','none');
        timer = setInterval(function () {
            index++;
            next();
        },3000)
    })


    $('.left').on('click',function(){
        index--;
        next();
    })

    $('.right').on('click',function(){
        index++;
        next();
    })


})