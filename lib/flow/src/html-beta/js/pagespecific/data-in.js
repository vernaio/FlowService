var dataInput = new MyDataTable(
    $('#wrapper-files-input'), //parent wrapper element
    [
        {
            label : "Name",
            key : "name",
            type: "STRING",
            align : "left",
            unit : null,
            initWidth : "80%"
        },
        {
            label : "Type",
            key : "type",
            type: "STRING",
            align : "left",
            unit : null,
            initWidth : "10%"
        },
        {
            label : "Size",
            key : "size",
            type: "NUMBER",
            align : "right",
            unit : "KB",
            initWidth : "10%"
        }                              
    ],
    {
        height: "300px",
        width: "100%",
        minWidth : "400px"
    }
);

// load files data in
function updateFilesInput(){
    $.get('/controller/files/data-in')
    .done(
        (data) => { 
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


var processedJobs = new MyDataTable(
    $('#wrapper-processed-orders'), //parent wrapper element
    [
        {
            label : "Bestellung",
            key : "id",
            type: "STRING",
            align : "left",
            unit : null,
            initWidth : "25%"
        },        
        {
            label : "Eingelesen",
            key : "startedOn",
            type: "STRING",
            align : "left",
            unit : null,
            initWidth : "25%"
        },
        {
            label : "Fortschritt",
            key : "progress",
            type: "STRING",
            align : "left",
            unit : null,
            initWidth : "25%"
        },
        {
            label : "Fehler",
            key : "error",
            type: "NUMBER",
            align : "right",
            unit : null,
            initWidth : "25%"
        }                              
    ],
    {
        height: "300px",
        width: "100%",
        minWidth : "400px"
    }
);

// load processed jobs
function updateProcessedJobs(){
    $.get('/controller/processed-jobs')
    .done(
        (data) => { 
            processedJobs.setData(data);
            setTimeout(updateProcessedJobs,  2000);              
        }
    )
    .fail(
        (error) => { 
            console.log(error);
            processedJobs.setError();
            setTimeout(updateProcessedJobs,  5000);
        }
    )

    //TESTING
    $.get('/controller/active-jobs')
    .done(
        (data) => { 
            //console.log(data);
        }
    )
    .fail(
        (error) => { 
            console.log(error);
        }
    )
}

updateProcessedJobs();

var logs = new MyDataTable(
    $('#wrapper-logs'), //parent wrapper element
    [
        {
            label : "Zeit",
            key : "on",
            type: "NUMBER",
            align : "left",
            unit : null,
            initWidth : "10%"
        },        
        {
            label : "Ereignis",
            key : "msg",
            type: "STRING",
            align : "left",
            unit : null,
            initWidth : "90%"
        }                            
    ],
    {
        height: "230px",
        width: "100%",
        minWidth : "400px",
        reverse : true
    }
);


// load processed jobs
function updateLogs(){
    $.get('/controller/messages')
    .done(
        (data) => { 
            logs.setData(data);
            setTimeout(updateLogs,  500);              
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

//On window resize: rebuild table
window.onresize = function(){
    dataInput.resize();
    processedJobs.resize();
}   

$('#fetch-jobs').click(function(){
    $.post('/controller/files/scan');
})

$('#reset-active-jobs').click(function(){
    $.ajax({
        url: '/controller/active-jobs',
        type: 'DELETE',
        success: function(response) {
          //...
        }
     });
})
