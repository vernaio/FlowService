//----------------------------------------------------------------------
//-----------------------------TABLE dataInput--------------------------
//----------------------------------------------------------------------
var dataInput = new MyDataTable(
    $('#wrapper-files-input'), //parent wrapper element
    [
        {
            label : locale.filename[lan],
            key : "name",
            type: "FILENAME",
            sortAs : "STRING",
            align : "left",
            initWidth : "70%"
        },
        {
            label : locale.type[lan],
            key : "type",
            type: "STRING",
            sortAs : "STRING",
            align : "left",
            initWidth : "15%"
        },
        {
            label : locale.size[lan],
            key : "size",
            type: "FILESIZE",
            sortAs : "NUMBER",
            align : "right",
            initWidth : "15%"
        }                              
    ],
    {
        height: "300px",
        width: "100%",
        minWidth : "400px",
        selectable : false,
        sorting : {
            colIndex : 0,
            ascending : true
        }
    }
);

// load files data in
function updateFilesInput(){
    $.get('/controller/files/data-in')
    .done(
        (data) => { 
            dataInput.unsetError();
            dataInput.setData(data);
            setTimeout(updateFilesInput,  2000);              
        }
    )
    .fail(
        (error) => { 
            console.log(error);
            dataInput.setError();
            setTimeout(updateFilesInput,  5000);
        }
    )
}

updateFilesInput();






//----------------------------------------------------------------------
//-----------------------------TABLE processedJobs----------------------
//----------------------------------------------------------------------

var processedJobs = new MyDataTable(
    $('#wrapper-processed-orders'), //parent wrapper element
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
            key : "startedOn",
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
                var thisDataEntry = processedJobs.getDataEntry(td.parent().attr("dataIndex"));
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
                        //delete
                        if(confirm(locale.confirm.deleteOrder[lan])){
                            $.delete('/controller/processed-jobs/id/' + thisId);
                            processedJobs.deleteRow(thisDataEntry);
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

// load processed jobs
function updateProcessedJobs(){
    $.get('/controller/processed-jobs')
    .done(
        (data) => { 
            processedJobs.unsetError();
            processedJobs.setData(data);
            setTimeout(updateProcessedJobs,  1000);              
        }
    )
    .fail(
        (error) => { 
            console.log(error);
            processedJobs.setError();
            setTimeout(updateProcessedJobs,  5000);
        }
    )
}

updateProcessedJobs();






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
                if(data[i].flow == "upload"){
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

var orderLogs = new MyDataTable(
    $('#wrapper-order-logs'), //parent wrapper element
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
processedJobs.onEvent(
    "rowSelected", 
    function(tr){
        var thisDataEntry = processedJobs.getDataEntry(tr.attr("dataIndex"));
        orderLogs.setData(thisDataEntry.audit);
        $('#orderId').html("'" + thisDataEntry.id + "'");
    }
);
processedJobs.onEvent(
    "rowUnselected", 
    function(){
        orderLogs.setData([]);
        $('#orderId').html("-");
    }
);

processedJobs.onEvent(
    "dataChangedOnSelectedRow", 
    function(tr){
        var thisDataEntry = processedJobs.getDataEntry(tr.attr("dataIndex"));
        orderLogs.setData(thisDataEntry.audit);
        $('#orderId').html("'" + thisDataEntry.id + "'");
    }
);





//----------------------------------------------------------------------
//-------------------------------GENERAL--------------------------------
//----------------------------------------------------------------------


//On window resize: rebuild table
window.onresize = function(){
    dataInput.resize();
    processedJobs.resize();
    logs.resize();
    orderLogs.resize();
}   

$('#fetch-jobs').click(function(){
    $.post('/controller/files/scan');
})

$('#delete-pending-orders').click(function(){
    if(confirm(locale.confirm.forgetPendingOrders[lan])){
        $.delete('/controller/processed-jobs/status/pending')
        processedJobs.removeSelection();
    }
})

$('#delete-canceled-orders').click(function(){
    if(confirm(locale.confirm.forgetCanceledOrders[lan])){
        $.delete('/controller/processed-jobs/status/error')
        processedJobs.removeSelection();
    }
})

$('#delete-success-orders').click(function(){
    if(confirm(locale.confirm.forgetSuccessOrders[lan])){
        $.delete('/controller/processed-jobs/status/success')
        processedJobs.removeSelection();
    }
})

$('#reset-upload-log').click(function(){
    if(confirm(locale.confirm.clearLog[lan])){
        $.delete('/controller/messages/upload')
    }
});
