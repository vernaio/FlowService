//----------------------------------------------------------------------
//-------------------------TABLE receivedLayouttasks----------------------
//----------------------------------------------------------------------

var layouttasks = new MyDataTable(
    $('#wrapper-received-layouttasks'), //parent wrapper element
    [
        {
            label : locale.layouttask[lan],
            key : "id",
            type: "ORDER",
            sortAs : "STRING",
            align : "left",
            initWidth : "18%"
        },       
        {
            label : locale.job[lan],
            key : "jobId",
            type: "STRING",
            sortAs : "STRING",
            align : "left",
            initWidth : "18%"
        },       
        {
            label : locale.workspace[lan],
            key : "wsId",
            type: "STRING",
            sortAs : "STRING",
            align : "left",
            initWidth : "18%"
        },                      
        {
            label : locale.receivedon[lan],
            key : "receivedOn",
            type: "TIME",
            sortAs : "NUMBER",
            align : "left",
            initWidth : "18%"
        },
        {
            label : locale.status[lan],
            key : "status",
            type: "STATUS",
            sortAs : "STRING",
            align : "left",
            initWidth : "15%"
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
                var thisDataEntry = layouttasks.getDataEntry(dataIndex);
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
                            $.delete('/controller/layouttasks/id/' + thisId);
                            layouttasks.deleteRow(dataIndex);
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

// load layouttasks
function updateLayouttasks(){
    $.get('/controller/layouttasks')
    .done(
        (data) => { 
            layouttasks.unsetError();
            layouttasks.setData(data);
            setTimeout(updateLayouttasks,  1000);              
        }
    )
    .fail(
        (error) => { 
            console.log(error);
            layouttasks.setError();
            setTimeout(updateLayouttasks,  5000);
        }
    )
}

updateLayouttasks();






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
                if(data[i].flow == "layoutTaskProcessor"){
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

var layouttaskLog = new MyDataTable(
    $('#wrapper-layouttask-logs'), //parent wrapper element
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
layouttasks.onEvent(
    "rowSelected", 
    function(tr){
        var thisDataEntry = layouttasks.getDataEntry(tr.attr("dataIndex"));
        layouttaskLog.setData(thisDataEntry.audit);
        $('#layouttaskId').html("'" + thisDataEntry.id + "'");
    }
);

layouttasks.onEvent(
    "rowUnselected", 
    function(){
        layouttaskLog.setData([]);
        $('#layouttaskId').html("-");
    }
);

layouttasks.onEvent(
    "dataChangedOnSelectedRow", 
    function(tr){
        var thisDataEntry = layouttasks.getDataEntry(tr.attr("dataIndex"));
        layouttaskLog.setData(thisDataEntry.audit);
        $('#layouttaskId').html("'" + thisDataEntry.id + "'");
    }
);






//----------------------------------------------------------------------
//-------------------------------GENERAL--------------------------------
//----------------------------------------------------------------------


//On window resize: rebuild table
window.onresize = function(){
    layouttasks.resize();
    logs.resize();
    layouttaskLog.resize();
}   

$('#delete-pending-layouttasks').click(function(){
    if(confirm(locale.confirm.forgetPendingLayouttasks[lan])){
        $.delete('/controller/layouttasks/status/pending')
        layouttasks.removeSelection();
    }
})

$('#delete-canceled-layouttasks').click(function(){
    if(confirm(locale.confirm.forgetCanceledLayouttasks[lan])){
        $.delete('/controller/layouttasks/status/error')
        layouttasks.removeSelection();
    }
})

$('#delete-success-layouttasks').click(function(){
    if(confirm(locale.confirm.forgetSuccessLayouttasks[lan])){
        $.delete('/controller/layouttasks/status/success')
        layouttasks.removeSelection();
    }
})


$('#reset-download-log').click(function(){
    if(confirm(locale.confirm.clearLog[lan])){
        $.delete('/controller/messages/layoutTaskProcessor')
    }
});
