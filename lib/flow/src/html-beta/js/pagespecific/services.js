$.get('/version')
.done(function(data){
    $('#service-flow-name').html(data.flow.name);
    $('#service-flow-version').html(data.flow.version);
    $('#service-flow-description').html(data.flow.description);
    $('#service-flow-status').html("online");
});

//check impositioner
$.get('/controller/imposition')
.done(function(data){
    if(data.status.toLowerCase() == "online"){
        $('#service-imposition-version').html(data.version);
        $('#service-imposition-status').html(data.status.toLowerCase());
        $('#service-imposition-description').html("Imposition Service (PIB)");
        $('#service-imposition-revision').html(data.revision);    
    }
})


/*function evalConnections(connections){
    //check flow

    if(connections.flow == true){
        //flow is OK
        $('#service-flow-status').html("online");

        //check impositioner
        if(connections.impositioner == true){
            $('#service-imposition-version').html(data.version);
            $('#service-imposition-status').html(data.status.toLowerCase());
            $('#service-imposition-description').html("Imposition Service (PIB)");
            $('#service-imposition-revision').html(data.revision);    
            msgBar.clear("error");					

        }

        //impositioner is running
        else{
            $('#service-imposition-version').html(data.version);
            $('#service-imposition-status').html(data.status.toLowerCase());
            $('#service-imposition-description').html("Imposition Service (PIB)");
            $('#service-imposition-revision').html(data.revision);
            msgBar.error("Uuuups..! PIB Imposition kann nicht erreicht werden.")
        }
    }

    else {
        //flow is not running
        msgBar.error("Uuuups..! Die Server-Verbindung zu PIB Flow ist unterbrochen.")
        $('#service-flow-status').html("offline");

    }
}*/