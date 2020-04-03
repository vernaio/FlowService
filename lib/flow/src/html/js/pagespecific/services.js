var rows = (lan === "de") ? ["Name", "URL (dev)", "Typ", "Status", "Version", "Beschreibung"] : ["Name", "URL (dev)", "Type", "Status", "Version", "Description"];
var keys = ["name", "location", "type", "status", "version", "description"];

function create(){
    $('#services-wrapper').empty();
    var serviceCache = pibConnection.getServiceCache();

    //if no services
    if(Object.keys(serviceCache).length == 0){
        $('#services-wrapper').html(lan == "de" ? "Keine Dienste angebunden." : "No services expected.");
        return;
    }

    for(var key in serviceCache){
        var service = serviceCache[key];

        var serviceWrapper = $('<div></div>');
        serviceWrapper.addClass('service-wrapper');
        serviceWrapper.attr('id', 'service-wrapper-' + key);
        $('#services-wrapper').append(serviceWrapper);
        
        var title = $('<h3></h3>');
        title.html(service.title);
        serviceWrapper.append(title);

        var serviceStateWrapper = $('<div></div>');
        serviceStateWrapper.addClass('service-state-wrapper');
        serviceWrapper.append(serviceStateWrapper);

        var table = $('<table></table>');
        serviceStateWrapper.append(table);
        
        rows.forEach((row, index) => {
            var tr = $('<tr></tr>');
            table.append(tr);
        
            var td = $('<td></td>');
            td.html(row);
            tr.append(td);

            var td = $('<td></td>');
            td.html(service[keys[index]] || "-");
            tr.append(td);        

            switch(keys[index]){
                case "status":
                    
                        serviceWrapper.addClass(service.status);
                    
                    break;
                
                case "location":
                    if(service[keys[index]] != null){
                        td.html('<a href="' + service.location + '" target="_blank">' + service.location + '</a>');
                    }
                    
                default:
                    break;
            }

        });
    }
}

pibConnection.setListener("serviceCacheWasUpdated", function(){
    create();
});