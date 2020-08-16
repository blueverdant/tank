var playerA = new Object
var ev = jQuery.Event("keydown");//模拟一个键盘bai事du件
var evfireA = jQuery.Event("keydown");//模拟一个键盘bai事du件
var lasttime = (new Date()).valueOf()
evfireA.keyCode = 32
playerA.land = function()
{
    $('#Player1Name').text("playerA")
    document.onkeydown(evfireA)
    var cur = (new Date()).valueOf();
    if (cur-lasttime > 200){
        lasttime = cur
        var rand = parseInt(Math.random() * (4 - 1 + 1) + 1);
        switch(rand)
        {
            case 1:
                ev.keyCode = 87
            break;
            case 2:
                ev.keyCode = 83
            break;
            case 3:
                ev.keyCode = 68
            break;
            case 4:
                ev.keyCode = 65
            break;
        }
    
        document.onkeydown(ev)
    }

    
    
    console.log("echo playerA",ev.keyCode,evfireA)
}
playerA.leave = function(){
    document.onkeyup(evfireA)
    document.onkeyup(ev)
    
}
