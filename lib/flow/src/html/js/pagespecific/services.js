/*$.get('/version')
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
})*/

var rows = ["Name", "URL", "Status", "Version", "Description"];
if(lan === "de") rows = ["Name", "URL", "Status", "Version", "Beschreibung"];
var keys = ["name", "location", "status", "version", "description"];
var pibArr = ["pib"];
var expServ = pibArr.concat(expectedServices);

expServ.forEach(key => {
    var service = services[key];

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
        td.attr("id", "val-" + key + "-" + keys[index]);
        td.html("bitte warten...");
        tr.append(td);        
    });
});

function updateValues(){
    expServ.forEach(key => {
        rows.forEach((row, index) => {
            var target = $("#val-" + key + "-" + keys[index]);
            target.html(services[key][keys[index]]);
        })
        var serviceWrapper = $('#service-wrapper-' + key);
        var status = services[key].status;
        if(!serviceWrapper.hasClass(status)){
            serviceWrapper.addClass(status).removeClass(status === "online" ? "offline" : "online");
        }
    })
    setTimeout(updateValues,  2000);		
}

setTimeout(updateValues,  1000);		