var packageJSON = require('./../package.json');

var services = {
	flow : {
		title : 'PIB Flow',
		name : packageJSON.name,
		version : packageJSON.version,
		description : packageJSON.description
    },	
    
    integration : {
        title : 'PIB Integration',
        name : process.env.INTEGRATION_NAME,
        location : process.env.INTEGRATION_LOCATION,
        status : null,
        version : null,
        description : null,
    },

    pibServices : {
        websocket : {
            title : 'PIB Websocket',
            name : 'websocket',
            status : null,
            version : null,
            description : 'Websocket for receiving notifications from sPrint One Webservice, e.g. when a print job was approved.',
        }
    },

    pibWebServices : {
        imposition : {
            title : 'Imposition Service',
            name : 'ImpositionService',
            location : process.env.IMPOSITION_URL,
            status : null,
            version : null,
            description : null
        },

        multipleLayoutTasksService : {
            title : 'Multiple LayoutTasks Service',
            name : 'multiple-layouttasks-service',
            location : process.env.MULTI_LAYOUTTASKS_SERVICE_URL,
            status : null,
            version : null,
            description : null,
            isCalculationService : true
        },

        jdfJobTicketGenerator : {
            title : 'JDF Jobticket Generator',
            name : "jdf-job-ticket-generator",
            location : process.env.JDF_JOBTICKET_GENERATOR_URL,
            status : null,
            version : null,
            description : null
        },

        pdfJobTicketGenerator : {
            title : 'PDF Jobticket Generator',
            name : 'pdf-job-ticket-generator',
            location : process.env.PDF_JOBTICKET_GENERATOR_URL,
            status : null,
            version : null,
            description : null
        }			
    },

    extWebServices : {
        spocv2 : {
            title : 'sPrint One Cockpit',
            name : 'spocv2',
            location : 'https://' + process.env.SPO_URL.replace("spo-v3.web-apps.","") + '/sPrint.one.cockpit.v2.webClient/current',
            needsCredentials : true,
            isCalculationService : true
        }
    }
};

exports.get = function(){
    return services;
}

exports.getService = function(serviceKey){
    var service;
    if(serviceKey === "flow" || serviceKey === "integration"){
        service = services[serviceKey];
        service["type"] = serviceKey;
    }
    
    else if(services.pibServices.hasOwnProperty(serviceKey)){
        service = services.pibServices[serviceKey];
        service["type"] = "pibService";
    } 

    else if(services.pibWebServices.hasOwnProperty(serviceKey)){
        service = services.pibWebServices[serviceKey];
        service["type"] = "pibWebService";
    }

    else if(services.extWebServices.hasOwnProperty(serviceKey)){
        service = services.extWebServices[serviceKey];
        service["type"] = "extWebService";
    }

    else{
        throw new Error("Service key " + serviceKey + " could not be found.");
    }
    return service;
}