var myDataTable = new MyDataTable(
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
            label : "Size [kb]",
            key : "size",
            type: "NUMBER",
            align : "right",
            unit : "KB",
            initWidth : "10%"
        }                              
    ],
    {
        height: "300px",
        width: "50%",
        minWidth : "400px"
    }
);

// load files data in
function updateFilesInput(){
    $.get('/controller/files/data-in')
    .done(
        (data) => { 
            myDataTable.setData(data);
            setTimeout(updateFilesInput,  2000);              
        }
    )
    .fail(
        (error) => { 
            console.log(error);
            myDataTable.setError();
        }
    )
}

updateFilesInput();


    