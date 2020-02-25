//read language from URL
var pathname = window.location.pathname;
var lan = pathname.split("/")[1];
var target = pathname.split("/")[2];
var msgBar;
var flowConf;
var currentServicePriority = 1;
var services = {
	pib : {
		priority : 0,
		endpoint : '/controller/spo-settings',
		online : false,
		errorMsg : 'Uuuups..! Die Server-Verbindung zur PIB ist unterbrochen.',
		eval : function(response){
			return true;
		}
	},	
	websocket : {
		priority : 1,
		endpoint : '/controller/websocket',
		online : false,
		errorMsg : 'Uuuups..! Die Websocketverbindung ist unterbrochen.',
		eval : function(response){
			return response.status;
		}
	},
	imposition : {
		priority : 2,
		endpoint : '/controller/imposition',
		online : false,
		errorMsg : 'Uuuups..! Der PIB Imposition Service kann nicht erreicht werden.',
		eval : function(response){
			return response.status === "online";
		}
	},
	multipleLayoutTasksService : {
		priority : 3,
		endpoint : '/controller/multipleLayoutTasksService',
		online : false,
		errorMsg : 'Uuuups..! Der MultipleLayoutTasksService kann nicht erreicht werden.',
		eval : function(response){
			return response.status === "online";
		}
	}	
}

function checkConnections(expectedServices, index){

	//check server
	$.get(services.pib.endpoint)
	.done(
		function(response){
			if(services.pib.online === false){
				services.pib.online = true;
				msgBar.clear("error");
			}

			//check next service
			if(expectedServices.length > 0){
				var service = services[expectedServices[index]];
				$.get(service.endpoint)
				.done(
					function(response){
						if(service.eval(response) === true){
							if(service.online === false) msgBar.clear("error");
							service.online = true;
						}
						else{
							service.online = false;
							msgBar.error(service.errorMsg);
						}
						
						setTimeout(function(){
							index = (index + 1) > (expectedServices.length - 1) ? 0 : (index + 1);
							checkConnections(expectedServices, index);
						},  1000);					
						
					}
				)
			}

		}
	)
	.fail(function(response){
		services.pib.online = false;
		msgBar.error(services.pib.errorMsg);
		setTimeout(function(){
			checkConnections(expectedServices, index)
		},  1000);
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

		//Get Flow Configuration
		$.get('/controller/flowConfig')
		.done(
			function(data){
				flowConf = data;
				
				//modify data-out
				if(!flowConf.flows.includes("notificationListener")){
					$('.data-out').remove();
					$('a#mainLinkToDataOut').attr("href", "/" + lan + "/data-out-lt");
				}

				if(!flowConf.flows.includes("layoutTaskProcessor")){
					$('.data-out-lt').remove();
				}
				

				$.get('/controller/spo-settings')
				.done(
					(data) => {
						//urlConsole = "https://" + data.url.split("web-apps.")[1] + "/sPrint.one.cockpit.v2.webClient/current";

						$('.console-link').attr("href", flowConf.calculationUrl	);

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

						//check connections
						var expectedServices = [];
						flowConf.services.forEach(service => {
							expectedServices.push(service.name);
						});
						checkConnections(expectedServices, 0);
					}
				);
			}
		);						
	})

	//Load footer
	$('footer').load('/modules/footer.html', function(){});
});