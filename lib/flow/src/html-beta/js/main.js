//read language from URL
var pathname = window.location.pathname;
var lan = pathname.split("/")[1];
var target = pathname.split("/")[2];

$(document).ready(function(){

	//Load header
	$('header').load('/modules/header.html', function(){

		//remove all "wrong-language" items from header. E.g. if lan==de, remove all lan=en items.
		$(this).find("*").each(function(){
			var attr = $(this).attr('lan');
			if (typeof attr !== typeof undefined && attr !== false)
				if(attr != lan)
					$(this).remove();
		})

		//insert the right url in language changer to stay on same side when changin language
		$('.header-menu-language-changer a').attr("href", $('.header-menu-language-changer a').attr("href").replace("placeholder", target));

		// Get URL for main menu link "console"
		$.get('/controller/spo-settings')
			.done(
				(data) => {
					urlConsole = "https://" + data.url.split("web-apps.")[1] + "/sPrint.one.cockpit.v2.webClient/current";

					$('.console-link').attr("href", urlConsole);

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
			
					//load page specific JS
					if(target !== undefined){
						$.get("/js/pagespecific/" + target + ".js")
						.done( 
							(data) => { eval(data) }
						)
						.fail(
							(error) => { console.log(error) }
						);
					}
				});
	})

	//Load footer
	$('footer').load('/modules/footer.html', function(){});
});