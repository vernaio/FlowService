//----------------------------------------------------------------------
//-------------------------TABLE receivedPrintjobs----------------------
//----------------------------------------------------------------------

var printjobs = new MyDataTable(
    $('#wrapper-received-printjobs'), //parent wrapper element
    [
        {
            label : "ID",
            key : "id",
            type: "ORDER",
            sortAs : "STRING",
            align : "left",
            initWidth : "30%"
        },        
        {
            label : "Empfangen",
            key : "receivedOn",
            type: "TIME",
            sortAs : "NUMBER",
            align : "left",
            initWidth : "25%"
        },
        {
            label : "Status",
            key : "status",
            type: "STATUS",
            sortAs : "STRING",
            align : "left",
            initWidth : "30%"
        },
        {
            label : "Aktion",
            key : null,
            type: "BUTTON",
            sortAs : "STRING",
            align : "right",
            initWidth : "15%",
            setContent : function(td){
                var dataIndex = td.parent().attr("dataIndex");
                var thisDataEntry = printjobs.getDataEntry(dataIndex);
                var thisId = thisDataEntry.id;
                var thisStatus = thisDataEntry.status;
                
                if(thisStatus == "success" || thisStatus == "error"){
                    var button = $('<div></div>');
                    td.append(button);
                    button.addClass("button");

                    if(thisStatus == "success"){
                        button.attr("title", "vergessen");
                        button.addClass("delete");
                        td.attr("sortValue", "delete");
                    }else{
                        button.attr("title", "vergessen");
                        button.addClass("reset");
                        td.attr("sortValue", "reset");
                    }

                    button.click(function(){
                        if(confirm("Bestellung '"+ thisId + "' vergessen und aus Liste entfernen?")){
                            $.delete('/controller/printjobs/id/' + thisId);
                            printjobs.deleteRow(dataIndex);
                        }
                    });
                }
            }
        }                          
    ],
    {
        height: "300px",
        width: "100%",
        minWidth : "400px",
        sorting : {
            colIndex : 1,
            ascending : false
        }
    }
);

// load printjobs
function updatePrintjobs(){
    $.get('/controller/printjobs')
    .done(
        (data) => { 
            printjobs.unsetError();
            printjobs.setData(data);
            setTimeout(updatePrintjobs,  1000);              
        }
    )
    .fail(
        (error) => { 
            console.log(error);
            printjobs.setError();
            setTimeout(updatePrintjobs,  5000);
        }
    )
}

updatePrintjobs();






//----------------------------------------------------------------------
//-----------------------------TABLE logs-------------------------------
//----------------------------------------------------------------------

var logs = new MyDataTable(
    $('#wrapper-logs'), //parent wrapper element
    [
        {
            label : "Zeit",
            key : "on",
            type: "LOGTIME",
            sortAs : "NUMBER",
            align : "left",
            unit : null,
            initWidth : "15%"
        },        
        {
            label : "Typ",
            key : "type",
            type: "LOG",
            sortAs : "STRING",
            align : "left",
            initWidth : "15%"
        },             
        {
            label : "Ereignis",
            key : "msg",
            type: "STRING",
            sortAs : "STRING",
            align : "left",
            initWidth : "70%"
        }                            
    ],
    {
        height: "230px",
        width: "100%",
        minWidth : "400px",
        selectable : false,
        fixedSorting : true,
        sorting : {
            colIndex : 0,
            ascending : false
        }       
    }
);


// load logs
function updateLogs(){
    $.get('/controller/messages')
    .done(
        (data) => { 
            logs.unsetError();
            var tempArr = [];
            for(var i = 0; i < data.length; i++){
                if(data[i].flow == "download"){
                    tempArr.push(data[i]);
                }
            }
            logs.setData(tempArr);
            setTimeout(updateLogs,  1000);              
        }
    )
    .fail(
        (error) => { 
            console.log(error);
            logs.setError();
            setTimeout(updateLogs,  5000);
        }
    )
}

updateLogs();







//----------------------------------------------------------------------
//-----------------------------TABLE orderLogs--------------------------
//----------------------------------------------------------------------

var printjobLog = new MyDataTable(
    $('#wrapper-printjob-logs'), //parent wrapper element
    [
        {
            label : "Zeit",
            key : "on",
            type: "LOGTIME",
            sortAs : "NUMBER",
            align : "left",
            unit : null,
            initWidth : "15%"
        },        
        {
            label : "Typ",
            key : "type",
            type: "LOG",
            sortAs : "STRING",
            align : "left",
            initWidth : "15%"
        },             
        {
            label : "Ereignis",
            key : "msg",
            type: "STRING",
            sortAs : "STRING",
            align : "left",
            initWidth : "70%"
        }                            
    ],
    {
        height: "230px",
        width: "100%",
        minWidth : "400px",
        selectable : false,
        fixedSorting : true,
        sorting : {
            colIndex : 0,
            ascending : false
        }
    }
);

//connect orderLogs with processedJobs
printjobs.onEvent(
    "rowSelected", 
    function(tr){
        var thisDataEntry = printjobs.getDataEntry(tr.attr("dataIndex"));
        printjobLog.setData(thisDataEntry.audit);
        $('#printjobId').html("'" + thisDataEntry.id + "'");
    }
);

printjobs.onEvent(
    "rowUnselected", 
    function(){
        printjobLog.setData([]);
        $('#printjobId').html("-");
    }
);

printjobs.onEvent(
    "dataChangedOnSelectedRow", 
    function(tr){
        var thisDataEntry = printjobs.getDataEntry(tr.attr("dataIndex"));
        printjobLog.setData(thisDataEntry.audit);
        $('#printjobId').html("'" + thisDataEntry.id + "'");
    }
);






//----------------------------------------------------------------------
//-------------------------------GENERAL--------------------------------
//----------------------------------------------------------------------


//On window resize: rebuild table
window.onresize = function(){
    printjobs.resize();
    logs.resize();
    printjobLog.resize();
}   

$('#delete-pending-printjobs').click(function(){
    if(confirm("Wirklich alle ausstehenden Druckjobs vergessen und aus der Liste entfernen? Empfehlung: Warten, bis die Bestellungen fertig bearbeitet sind.")){
        $.delete('/controller/printjobs/status/pending')
        printjobs.removeSelection();
    }
})

$('#delete-canceled-printjobs').click(function(){
    if(confirm("Wirklich alle fehlerhaften Druckbestellungen vergessen und aus der Liste entfernen?")){
        $.delete('/controller/printjobs/status/error')
        printjobs.removeSelection();
    }
})

$('#delete-success-printjobs').click(function(){
    if(confirm("Wirklich alle erfolgreichen Druckbestellungen vergessen und aus der Liste entfernen?")){
        $.delete('/controller/printjobs/status/success')
        printjobs.removeSelection();
    }
})


$('#reset-download-log').click(function(){
    if(confirm("Wirklich alle Log-Einträge löschen?")){
        $.delete('/controller/messages/download')
    }
});
