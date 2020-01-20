//read language from URL
var pathname = window.location.pathname;
var lan = pathname.split("/")[1];
var target = pathname.split("/")[2];
var msgBar;

function checkConnections(){

	//check impositioner
	$.get('/controller/websocket')
	.done(
		function(data){
			if(data.status == true){
				$('#webservice-connection').html("online");
				$.get('/controller/imposition')
				.done(function(data){
					if(data.status.toLowerCase() != "online"){
						msgBar.error("Uuuups..! Der PIB Imposition Service kann nicht erreicht werden.")
					}else{
						msgBar.clear("error");
					}
				})				
			}else{
				msgBar.error("Uuuups..! Die Websocketverbindung ist unterbrochen.")
			}
			
		}
	)
	.fail(function(data){
		msgBar.error("Uuuups..! Die Server-Verbindung zu PIB Flow ist unterbrochen.")
	})
	.always(function(){
		setTimeout(checkConnections,  2000);
	})

	

}


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

		//init msgBar
		msgBar = new MsgBar($('#msgBar'));
		//setTimeout(function(){msgBar.info("Willkommen bei  der PIB. Los gehts!", 5000)}, 1000);
		

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
							(data) => {}
						)
						.fail(
							(error) => { console.log(error) }
						);
					}

					checkConnections();
				});
	})

	//Load footer
	$('footer').load('/modules/footer.html', function(){});
});