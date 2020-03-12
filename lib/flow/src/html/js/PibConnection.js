function PibConnection(){
    //VARIABLES
    var serviceCache;
    var havePibConnection = false;
    var frequency = 1500;
    var listeners = {
        serviceCacheWasUpdated : function(){
            return;
        }
    }

    //FUNCTIONS
    function checkIfAllServicesOnline(){
        for (var key in serviceCache){
            if (serviceCache[key].status === "offline"){
                return false;
            }
        }
        return true;
    }

    function pollPibConnection(){
        $.get("/controller/cacheServices")
        .done(function(response){
            //remove error message
            if(!havePibConnection){
                msgBar.clear("error");
                havePibConnection = true;
            }
    
            //update data and call listener
            serviceCache = response;
            listeners.serviceCacheWasUpdated();
    
            //check if service is not available
            if(!checkIfAllServicesOnline() && target != "services"){
                msgBar.error('Uuuups..! Ein Dienst kann aktuell micht erreicht werden: Siehe <a href="/de/services" style="padding: 0px; text-decoration: underline;">Dienste</a>.');
                havePibConnection = false;
            }
        })
        .fail(function(error){
            msgBar.error('Uuuups..! Die Verbindung zur PIB ist unterbrochen! Bitte kurz warten oder die Logs checken.');
            havePibConnection = false;
        })
        .always(function(){
            setTimeout(pollPibConnection,  frequency);
        });
    }
    //CONSTRUCTOR
    pollPibConnection();

    //INTERFACE
    this.setListener = function(name, fnc){
        listeners[name] = fnc;
    }

    this.getServiceCache = function(){
        return serviceCache;
    }

    this.getWebsocketStatus = function(){
        if(serviceCache){
            if(serviceCache.hasOwnProperty("websocket")){
                return serviceCache.websocket.status === "online";
            }
        }
        return false;
    }
}