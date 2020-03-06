function initNavigation(el){

    //remove all "wrong-language" items from header. E.g. if lan==de, remove all lan=en items.
    el.find("*").each(function(){
        var attr = $(this).attr('lan');
        if (typeof attr !== typeof undefined && attr !== false)
            if(attr != lan)
                $(this).remove();
    })

    //change link language
    $('#logo-link').attr("href", "/" + lan +  "/home")

    //init msgBar
    msgBar = new MsgBar($('#msgBar'));
    
    //insert the right url in language changer to stay on same side when changin language
    $('.header-menu-language-changer a').attr("href", '/' + lan + '/' + target);

    //get version of flow
    $.get('/version').done(data => {$('.header-title-text > span').html(data.flow.version);$('.header-title-text > span').attr("title", "pib-flow version");})
    
    //set calculation URL
    $.get('/controller/calculationURL')
    .done(calculationURL => {
            $('.console-link').attr("href", calculationURL	);
    });

    //Get Flow Configuration
    $.get('/controller/requiredFlows')
    .done(
        function(requiredFlows){
            
            //modify data-out
            if(!requiredFlows.includes("notificationListener")){
                $('a#mainLinkToDataOut').attr("href", "/" + lan + "/data-out-lt");
                $('.data-out').remove();
                $('.data-out-lt').show();
            }

            if(!requiredFlows.includes("layoutTaskProcessor")){
                $('.data-out-lt').remove();
                $('.data-out').show();
            }
        }
    );    

    
    //Main menu mechanics: Activate
    $('#activate-mainmenu').click(function(){
        $('#menu').addClass("visible");
        $('.header-menu-active-layer').fadeIn(600);
    });

    //Main menu mechanics: Deactivate
    $('#deactivate-mainmenu').click(function(){
        $('#menu').removeClass("visible");
        $('.header-menu-active-layer').fadeOut(600);
    });		

    $('.header-menu-item.' + target + ' a').addClass("selected");
    $('.quick-menu-item.' + target).addClass("selected");
    if(target == undefined) $('#quick-menu').hide();
}