function MsgBar(parent){
    var lastMsg = null;

    function show(type, msg, hideAfterMS){
        function toggleOut(){
            parent.removeClass("info").removeClass("warning").removeClass("error");
            msgArea.html(msg);
            parent.addClass(type);
            parent.addClass("out");
            if(hideAfterMS !== undefined){
                setTimeout(function(){parent.removeClass("out")}, hideAfterMS);
            }
        }
        if(msg == lastMsg) return;
        lastMsg = msg;

        if(parent.hasClass("out)")){
            parent.removeClass("out");
            setTimeout(function(){toggleOut();}, 1000);
        }
        else{
            toggleOut();
        }
    }

    function clear(type){
        if(parent.hasClass("out") && parent.hasClass(type)){
            parent.removeClass("out");
            lastMsg = null;
        }
    }

    //----init-----
    parent.empty();

    var wrapper = $('<div></div>');
    parent.append(wrapper);
    wrapper.addClass("wrapper");

    var innerArea = $('<div></div>');
    wrapper.append(innerArea);
    innerArea.addClass("innerArea");

    var msgArea = $('<div></div>');
    innerArea.append(msgArea);
    msgArea.addClass("msgArea");

    var closer = $('<div></div>');
    wrapper.append(closer);
    closer.addClass("closer");
    closer.click(function(){
        parent.removeClass("out");
        lastMsg = null;
    });

    //----interface----
    this.info = function(msg, hideAfterMS){
        show("info", msg, hideAfterMS);
    }
    
    this.warning = function(msg, hideAfterMS){
        show("warning", msg, hideAfterMS);
    }
    
    this.error = function(msg, hideAfterMS){
        show("error", msg, hideAfterMS);
    }

    this.clear = function(type){
        clear(type);
    }
};