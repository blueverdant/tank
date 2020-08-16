var playerB = new Object
var ev = jQuery.Event("keydown");//模拟一个键盘bai事du件
var evfireB = jQuery.Event("keydown");//模拟一个键盘bai事du件
var lasttime = (new Date()).valueOf()
evfireB.keyCode = 8
playerB.land = function()
{
    $('#Player2Name').text("playerB")
    document.onkeydown(evfireB)
    var cur = (new Date()).valueOf();
    if (cur-lasttime > 200){
        lasttime = cur
        var rand = parseInt(Math.random() * (4 - 1 + 1) + 1);
        switch(rand)
        {
            case 1:
                ev.keyCode = 37
            break;
            case 2:
                ev.keyCode = 38
            break;
            case 3:
                ev.keyCode = 39
            break;
            case 4:
                ev.keyCode = 40
            break;
        }
    
        document.onkeydown(ev)
    }

    
    
    console.log("echo playerB",ev.keyCode,evfireB)
}
playerB.leave = function(){
    document.onkeyup(evfireB)
    document.onkeyup(ev)
    
}