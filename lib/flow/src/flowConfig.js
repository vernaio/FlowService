var flowConfig = {
    flows : {
        binderySignatureUpload : {
            enabled : true,
            options : {

                uploadToWorkspace : {
                    enabled : true,
                    params : {},
                    services : {
                        spocv2 : {
                            params : {}
                        }
                    }
                },

                createMultipleLayoutTasks : {
                    enabled : false,
                    params : {},
                    services : {
                        multipleLayoutTasksService : {
                            params : {}
                        }
                    }          
                }
            }
        },

        notificationListener : {
            enabled : true,
            options : { 

                websocket : {
                    enabled : true,
                    params : {},
                    services : {
                        websocket : {
                            params : {}
                        }
                    }
                },          
                
                writeGangJobEventJSON : {
                    enabled : true,
                    params : {},
                    services : {}
                },                

                writeGangJobEventXML : {
                    enabled : false,
                    params : {},
                    services : {}
                },

                impose : {
                    enabled : true,
                    params : {},
                    services : {
                        imposition : {
                            params : {}
                        }
                    }
                },

                generateJdfJobTicket : {
                    enabled : false,
                    params : {},
                    services : {
                        jdfJobTicketGenerator : {
                            params : {}
                        }
                    }
                },

                generatePdfJobTicket : {
                    enabled : false,
                    params : {},
                    services : {
                        pdfJobTicketGenerator : {
                            params : {}
                        }
                    }
                }                  
            }
        },

        layoutTaskProcessor : {
            enabled : false,
            options : {
                writeLayoutTaskJSON: {
                    enabled : true,
                    params : {
                        urlParams : "" //has to be enabled first in Flow
                    },
                    services : {}
                },

                writeLayoutTaskXML : {
                    enabled : true,
                    params : {
                        urlParams : "" //has to be enabled first in Flow
                    },
                    services : {}
                },

                writeReport : {
                    enabled : true,
                    params : {},
                    services : {}
                },

                writeApogeeJDF : {
                    enabled : true,
                    params : {
                        urlParams : "?jdfIdStrategy=FIRST_ORDER_REF&jdfBinderySignatureIdStrategy=LABEL"
                    },
                    services : {}
                }
            }
        }
    }
}


exports.getFlowEnabled = function(flowKey){
	if(flowConfig.flows.hasOwnProperty(flowKey)){
		return flowConfig.flows[flowKey].enabled;  
	}else{
		throw new Error("Error in flowConf, 'getFlowEnabled': Wrong flow key '" + flowKey + "'");
	}
}

exports.getFlowOption = function(flowKey, optionKey){
	if(flowConfig.flows.hasOwnProperty(flowKey)){
		if(flowConfig.flows[flowKey].enabled === true){
			var flow = flowConfig.flows[flowKey];

			if(flow.options.hasOwnProperty(optionKey)){
				return flow.options[optionKey];
			}else{
				throw new Error("Configuration error in flowConf, 'getOption': Flow '" + flowKey + "' has no option key '" + optionKey + "'.");
			}

		}else{
			throw new Error("Configuration error in flowConf, 'getOption': A disabled flow was called for an option.");
		}
	}else{
		throw new Error("Error in flowConf, 'getOption': Wrong flowKey '" + flowKey + "'");
	}
}

exports.getExpectedFlows = function(){
    var expectedFlows = [];

	//iterate flows, check if enabled
	for(var flowKey in flowConfig.flows){
		if(flowConfig.flows[flowKey].enabled === true){
            expectedFlows.push(flowKey);
        }
    }
    return expectedFlows;
}

exports.getExpectedServices = function(){
    var expectedServices = [];
	var flows = flowConfig.flows;

	//iterate flows, check if enabled
	for(var flowKey in flows){
		if(flows[flowKey].enabled === true){
			var flow = flows[flowKey];

			//iterate options: check if enabled
			for(var optionKey in flow.options){
				if(flow.options[optionKey].enabled === true){
                    var services = flow.options[optionKey].services;
					for(var serviceKey in services){
                        if(!expectedServices.includes(serviceKey)) expectedServices.push(serviceKey);
                    }
				}
			}
		}
	}
	return expectedServices;
}

exports.getServiceParams = function(flowKey, optionKey, serviceKey){
    try{
        return flowConfig[flowKey].options[optionKey].services[serviceKey].params;
    }catch(e){
        throw new Error('Error in function "getServiceParams": Could not findparams for ' + flowKey + '->' + optionKey + '->' + serviceKey + '.');
    }
}

/*exports.getServicesAndFlows = function(){
	var payload = {
		"services" : [],
		"flows" : []
	}
	var flows = [];
	var flows = flowConfig.flows;

	//iterate flows, check if enabled
	for(var flowKey in flows){
		if(flows[flowKey].enabled === true){
			var flow = flows[flowKey];
			payload.flows.push(flowKey);

			//iterate options: check if enabled
			for(var optionKey in flow.options){
				if(flow.options[optionKey].enabled === true){
                    var option = flow.options[optionKey];
					payload.services.push(option.services[serviceKey]);
				}
			}
		}
	}
	return payload;
}*/

exports.set = function(customFlowConfig){
    for(var flowKey in flowConfig.flows){
        //set flow enabled
        flowConfig.flows[flowKey].enabled = customFlowConfig.flows[flowKey].enabled;

        //set options
        for(var optionKey in flowConfig.flows[flowKey].options){
            flowConfig.flows[flowKey].options[optionKey].enabled = customFlowConfig.flows[flowKey].options[optionKey].enabled;
        }
    }
}