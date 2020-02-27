//read language from URL
var pathname = window.location.pathname;
var lan = pathname.split("/")[1];
var target = pathname.split("/")[2];
var msgBar;
var flowConf;
var currentServicePriority = 1;
var expectedServices = [];
var services = {
	pib : {
		title : 'PIB Flow',
		endpoint : '/version',
		name : null,
		status : "offline",
		version : null,
		description : null,
		location : "localhost",
		eval : function(response){
			return true;
		},
		setStatus : function(online){
			return;
		}
	},	
	websocket : {
		title : 'PIB Websocket',
		endpoint : '/controller/websocket',
		name : null,
		status : "offline",
		version : null,
		description : null,
		location : "localhost",
		eval : function(response){
			return response.status === "online";
		},
		setStatus : function(status){
			$('#webservice-connection').html(status.toUpperCase());
			return;
		}
	},
	imposition : {
		title : 'Imposition Service',
		endpoint : '/controller/imposition',
		name : null,
		status : "offline",
		version : null,
		description : null,
		location : "localhost",
		eval : function(response){
			return response.name === "ImpositionService" && response.status === "online";
		},
		setStatus : function(online){
			return;
		}
	},
	multipleLayoutTasksService : {
		title : 'Multiple LayoutTasks Service',
		endpoint : '/controller/multipleLayoutTasksService',
		name : null,
		status : "offline",
		version : null,
		description : null,
		location : "localhost",
		eval : function(response){
			return response.status === "online";
		},
		setStatus : function(online){
			return;
		}
	},
	jdfJobTicketGenerator : {
		title : 'JDF Jobticket Generator',
		endpoint : '/controller/jdfJobTicketGenerator',
		name : null,
		status : "offline",
		version : null,
		description : null,
		location : "localhost",
		eval : function(response){
			return response.name === "jdf-job-ticket-generator" && response.status === "online";
		},
		setStatus : function(online){
			return;
		}
	},
	pdfJobTicketGenerator : {
		title : 'PDF Jobticket Generator',
		endpoint : '/controller/pdfJobTicketGenerator',
		name : null,
		status : "offline",
		version : null,
		description : null,
		location : "localhost",
		eval : function(response){
			return response.name === "pdf-job-ticket-generator" && response.status === "online";
		},
		setStatus : function(online){
			return;
		}
	}			
}

function chekPIBconnection(){
	var service = services.pib;
	$.get(services.pib.endpoint)
	.done(
		function(response){
			if(service.status === "offline"){
				msgBar.clear("error");		
			}
			service.status = "online";

			//initial filling of data
			if(service.name == null){
				service.name = response.flow.name;
				service.version = response.flow.version;
				service.description = response.flow.description;
			}
		}
	)
	.fail(function(response){
		service.status = "offline";
		msgBar.error('Uuuups..! Die Verbindung zur PIB ist unterbrochen! Bitte kurz warten oder die Logs checken.');
	})
	.always(function(){
		setTimeout(chekPIBconnection,  1500);
	});
}

function checkServices(expectedServices, index){

	//if pib is  offline, ignore other services
	if(services.pib.status === "offline"){
		setTimeout(function(){
			checkConnections(expectedServices, 0);
		},  1500);
	}

	//no other services expected
	else if(expectedServices.length == 0){
		return;
	}
		
	else{
		var service = services[expectedServices[index]];
		$.get(service.endpoint)
		.done(
			function(response){
				if(service.eval(response) === true){
					service.status = "online";

					//initial filling of data
					if(service.name === null){
						service.name = response.name;
						service.version = response.version;
						service.description = response.description;
						service.location = response.location;
					}
				}
				else{
					service.status = "offline";
					service.location = response.location;
				}
				service.setStatus(service.status);
			}
		)
		.fail(function(error){
			//ignore
		})
		.always(function(){
			expectedServices.forEach(key => {
				if(services[key].status === "offline" && target != "services"){
					msgBar.error('Uuuups..! Mindestens ein Service ist nicht erreichbar: <a style="padding:0 2px; " href="/' + lan + '/services">siehe hier!</a>');
				}else{
					msgBar.clear("error");
				}
			});
			setTimeout(function(){
				index = (index + 1) > (expectedServices.length - 1) ? 0 : (index + 1);
				checkServices(expectedServices, index);
			},  1000);		
		});
	}
}

function checkConnections(expectedServices){
	chekPIBconnection();
	setTimeout(function(){
		checkServices(expectedServices, 0);
	},  500);
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
						flowConf.services.forEach(service => {
							expectedServices.push(service.name);
						});
						checkConnections(expectedServices);
					}
				);
			}
		);						
	})

	//Load footer
	$('footer').load('/modules/footer.html', function(){});
});