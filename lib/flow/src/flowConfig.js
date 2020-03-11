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
                    enabled : false,
                    params : {
                        urlParams : "" //has to be enabled first in Flow
                    },
                    services : {}
                },

                writeReport : {
                    enabled : true,
                    params : {
                        urlParams : ""
                    },
                    services : {}
                },

                writeApogeeJDF : {
                    enabled : false,
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

exports.set = function(customFlowConfig){
    //ceck custom flowConfig and copy values
    if(customFlowConfig.hasOwnProperty("flows")){
        for(var flowKey in customFlowConfig.flows){
            if(flowConfig.flows.hasOwnProperty(flowKey)){
                var customFlow = customFlowConfig.flows[flowKey];
                if(customFlow.hasOwnProperty("enabled")){
                    flowConfig.flows[flowKey].enabled = customFlow.enabled; //set value
                    if(customFlow.hasOwnProperty("options")){
                        //look for options in customFlow
                        for(var optionKey in customFlow.options){
                            if(flowConfig.flows[flowKey].options.hasOwnProperty(optionKey)){
                                var customOption =  customFlow.options[optionKey];
                                if(customOption.hasOwnProperty("enabled")){
                                    flowConfig.flows[flowKey].options[optionKey].enabled = customOption.enabled; //set value
                                    //look for params (optional)
                                    if(customOption.hasOwnProperty("params")){
                                        for(var paramKey in customOption.params){
                                            if(flowConfig.flows[flowKey].options[optionKey].params.hasOwnProperty(paramKey)){
                                                flowConfig.flows[flowKey].options[optionKey].params[paramKey] = customOption.params[paramKey]; //set value
                                            }else{ throw new Error("Config error: Found wrong parameter key '" + paramKey + "' in received 'flowConfig/flows/" + flowKey + "/options/" + optionKey + "/params'.") }
                                        }
                                    }
                                }else{ throw new Error("Config error: Found no key 'enabled' in received 'flowConfig/flows/" + flowKey + "/options'.") }
                            }else{ throw new Error("Config error: Found wrong key '" + optionKey + "' in received 'flowConfig/flows/" + flowKey + "/options'.") }
                        }
                    }else{ throw new Error("Config error: Found no key 'options' in received 'flowConfig/flows/" + flowKey + "'.") }
                }else{ throw new Error("Config error: Found no key 'enabled' in received 'flowConfig/flows/" + flowKey + "'.") }
            }else{ throw new Error("Config error: Found wrong key '" + flowKey + "' in received 'flowConfig/flows'."); }
        }
    }else{ throw new Error("Config error: Found no key 'flows' in received flow config."); }

    //validate new flowConfig
    var tempSum = flowConfig.flows.notificationListener.enabled + flowConfig.flows.layoutTaskProcessor.enabled;
    if(tempSum != 1) throw new Error("Config error: Either flow 'notificationListener' OR flow 'layoutTaskProcessor' has to be enabled.");
    if(!flowConfig.flows.binderySignatureUpload.enabled) throw new Error("Config error: Flow 'binderySignatureUpload' has to be enabled.");
    tempSum = flowConfig.flows.binderySignatureUpload.options.uploadToWorkspace.enabled + flowConfig.flows.binderySignatureUpload.options.createMultipleLayoutTasks.enabled;
    if(tempSum != 1) throw new Error("Config error: In flow 'binderySignatureUpload', either option 'uploadToWorkspace' OR options 'createMultipleLayoutTasks' has to be enabled.");
    return;
}

exports.getAll = function(){
    return flowConfig;
}