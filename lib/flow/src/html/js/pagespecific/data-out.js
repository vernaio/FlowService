//----------------------------------------------------------------------
//-------------------------TABLE receivedPrintjobs----------------------
//----------------------------------------------------------------------

var printjobs = new MyDataTable(
    $('#wrapper-received-printjobs'), //parent wrapper element
    [
        {
            label : locale.id[lan],
            key : "id",
            type: "ORDER",
            sortAs : "STRING",
            align : "left",
            initWidth : "30%"
        },        
        {
            label : locale.readon[lan],
            key : "receivedOn",
            type: "TIME",
            sortAs : "NUMBER",
            align : "left",
            initWidth : "25%"
        },
        {
            label : locale.status[lan],
            key : "status",
            type: "STATUS",
            sortAs : "STRING",
            align : "left",
            initWidth : "30%"
        },
        {
            label : locale.action[lan],
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
                        button.attr("title", locale.forget[lan]);
                        button.addClass("delete");
                        td.attr("sortValue", "delete");
                    }else{
                        button.attr("title", locale.forget[lan]);
                        button.addClass("reset");
                        td.attr("sortValue", "reset");
                    }

                    button.click(function(){
                        if(confirm(locale.confirm.deleteOrder[lan])){
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
            label : locale.time[lan],
            key : "on",
            type: "LOGTIME",
            sortAs : "NUMBER",
            align : "left",
            unit : null,
            initWidth : "15%"
        },        
        {
            label : locale.type[lan],
            key : "type",
            type: "LOG",
            sortAs : "STRING",
            align : "left",
            initWidth : "15%"
        },             
        {
            label : locale.event[lan],
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
            label : locale.time[lan],
            key : "on",
            type: "LOGTIME",
            sortAs : "NUMBER",
            align : "left",
            unit : null,
            initWidth : "15%"
        },        
        {
            label : locale.type[lan],
            key : "type",
            type: "LOG",
            sortAs : "STRING",
            align : "left",
            initWidth : "15%"
        },             
        {
            label : locale.event[lan],
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
    if(confirm(locale.confirm.forgetPendingPrintjobs[lan])){
        $.delete('/controller/printjobs/status/pending')
        printjobs.removeSelection();
    }
})

$('#delete-canceled-printjobs').click(function(){
    if(confirm(locale.confirm.forgetCanceledPrintjobs[lan])){
        $.delete('/controller/printjobs/status/error')
        printjobs.removeSelection();
    }
})

$('#delete-success-printjobs').click(function(){
    if(confirm(locale.confirm.forgetSuccessPrintjobs[lan])){
        $.delete('/controller/printjobs/status/success')
        printjobs.removeSelection();
    }
})


$('#reset-download-log').click(function(){
    if(confirm(locale.confirm.clearLog[lan])){
        $.delete('/controller/messages/download')
    }
});
