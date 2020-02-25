function MyDataTable(
    parent, //parent wrapper element (will be emtied and table will be appended)
    configuration, //array of json objects, one per column. Each json obj contains following keys: 'label' (of column) , 'key' (key in data table), 'type' [STRING, NUMBER] (for sorting), 'align' can be right or left, 'unit' any String (may be null), 'initWidth' percentage
    optionsIn //json obj with keys: 'height' with value in pixels
){
    var options  = {
        height: "300px",
        width: "600px",
        minWidth: "400px",
        minColWidth: 50,
        buffer: 10,
        selectable : true,
        fixedSorting : false,
        sorting : {
            colIndex : 0,       //the index of the column, which is currently sorted by
            ascending : true    //if sorting should be ascending or descending
        }
    }

    var events = {
        rowSelected : function(el){
            return;
        },
        rowUnselected : function(el){
            return;
        },
        dataChangedOnSelectedRow : function(el){
            return;
        }        
    }

    //this holds the information about the current sorting
    var sorting = {
        //is being filled by init
    }

    var data = {}; //the table data
    var colResizeActive = false; //to prevent triggering a sorting when resizing the table columns
    var selectedDataIndex = null;
    var headerWrapper, bodyWrapper, tbodyData, placeholder, scrollbarWidth, onResizeTimeout;
       
    function setColumnResizeGrabbers(grabber){
         var pageX,curCol,nxtCol,curColWidth,nxtColWidth,nxtColIndex,curColIndex;
         var active = false;
       
        function paddingDiff(col){
            function getStyleVal(elm,css){
                return (window.getComputedStyle(elm, null).getPropertyValue(css))
            }

            if (getStyleVal(col,'box-sizing') == 'border-box'){
             return 0;
            }
           
            var padLeft = getStyleVal(col,'padding-left');
            var padRight = getStyleVal(col,'padding-right');
            return (parseInt(padLeft) + parseInt(padRight));
        }
          
        function stop(){
            active = false; 
            setTimeout(function(){ colResizeActive = false; }, 100); //to not sort
            document.body.style.cursor='default';
            curCol = undefined;
            nxtCol = undefined;
            pageX = undefined;
            nxtColWidth = undefined;
            curColWidth = undefined;
            nxtColIndex = undefined;
            curColIndex = undefined;
        }

        grabber.addEventListener('mousedown', function (e) {
            active = true; colResizeActive = true;
            document.body.style.cursor='col-resize';
            curCol = e.target.parentElement;
            curColIndex = $(curCol).index();
            nxtCol = curCol.nextElementSibling;
            nxtColIndex = $(nxtCol).index();

            pageX = e.pageX; 
            var padding = paddingDiff(curCol);
            curColWidth = curCol.offsetWidth - padding;
            if (nxtCol)
            nxtColWidth = nxtCol.offsetWidth - padding;
        });
       
        document.addEventListener('mousemove', function (e) {
          if (active && curCol) {
           var diffX = e.pageX - pageX;
        
           if (nxtCol)
            var newNxtColWidth = nxtColWidth - diffX;
            var newCurColWidth = curColWidth + diffX;

            //check if minimum width is not reached
            var minNxtColWidth = Math.max($(nxtCol).find('div.MyDataTable-header-label').width() + options.buffer, options.minColWidth);
            var minCurColWidth = Math.max($(curCol).find('div.MyDataTable-header-label').width() + options.buffer, options.minColWidth);

            if(newNxtColWidth >= minNxtColWidth && newCurColWidth >= minCurColWidth){
                nxtCol.style.width = newNxtColWidth +'px';
                curCol.style.width = newCurColWidth +'px';
                bodyWrapper.find('table tr td:nth-child(' + (nxtColIndex + 1) + ')').width( newNxtColWidth);
                bodyWrapper.find('table tr td:nth-child(' + (curColIndex + 1) + ')').width( newCurColWidth);                
            }
          }
        });
       
        document.addEventListener('mouseup', function (e) { 
            stop();
         });
    }
        
    function updateWidths(){
        headerWrapper.find('table').width(parent.width() - scrollbarWidth);
        bodyWrapper.find('table').width(parent.width() - scrollbarWidth);
    }

    function detectScrollbarWidth(){
        var outer = $('<div id="outter" style="width: 200px; overflow-y: scroll;"></div>');
        var inner = $('<div id="inner" style="height: 0px;"></div>');
        outer.append(inner);
        parent.append(outer);
        scrollbarWidth = outer[0].offsetWidth - inner[0].offsetWidth + 2;
        inner.remove();
        outer.remove();
    }

    function sortDataTable(){
        var table = bodyWrapper.find('table');
        var rows = table.find('tr').get();
        var sortAs = configuration[sorting.colIndex].sortAs || "STRING";
    
        rows.sort(function(a, b) {
            var A,B;

            //Prepare sorting values for comparison
            switch(sortAs){
                case "NUMBER":
                    var A = parseFloat($(a).children('td').eq(sorting.colIndex).attr("sortvalue"));
                    var B = parseFloat($(b).children('td').eq(sorting.colIndex).attr("sortvalue"));
                    break;

                default:
                    var A = $(a).children('td').eq(sorting.colIndex).attr("sortvalue") + "a"; //+a because if pure number, force comparison as String
                    var B = $(b).children('td').eq(sorting.colIndex).attr("sortvalue") + "a";
                    break;
            }
        
            //Comparison
            if(A < B) {
                return (sorting.ascending ? -1 : 1);
            }
        
            if(A > B) {
                return (sorting.ascending ? 1 : -1);
            }
        
            return 0;
        });
      
        $.each(rows, function(index, row) {
          table.children('tbody').append(row);
        });
    }

    function sortingTriggered(th){
        th.parent().children().each(function(){
            $(this).removeClass("sorted_asc").removeClass("sorted_desc");
        });

        if(sorting.ascending){
            sorting.ascending = false;
            th.addClass("sorted_desc");
        }else{
            sorting.ascending = true;
            th.addClass("sorted_asc");
        }
        sorting.colIndex = th.index();
        sortDataTable();
    }   

    function prepareParent(){
        parent.empty();
        parent.addClass("MyDataTable-parent");
        parent.css('height', options.height);
        parent.css('width', options.width);
        parent.css('min-width', options.minWidth);
    }

    function createHeader(){
        //create header table wrapper
        headerWrapper = $('<div></div>');
        headerWrapper.addClass("MyDataTable-headerWrapper");
        parent.append(headerWrapper);    

        //create header table
        var tableHeader = $('<table></table>');
        tableHeader.addClass("MyDataTable-header");
        tableHeader.attr("border", "0");
        tableHeader.attr("cellpadding", "0");
        tableHeader.attr("cellspacing", "0");
        headerWrapper.append(tableHeader);

        //create header
        var thead = $('<thead></thead>');
        tableHeader.append(thead);
        var rowHeader = $('<tr></tr>');
        thead.append(rowHeader);
        configuration.forEach(function(columnConf, index){
            var th = $('<th></th>');
            rowHeader.append(th);
            if(columnConf.initWidth != null) th.width(columnConf.initWidth);
            th.css("min-width", options.minColWidth + "px");
            th.attr("type", columnConf.type);

            //create label wrapper
            var labelWrapper = $('<div></div>');
            th.append(labelWrapper);
            labelWrapper.addClass("MyDataTable-header-label");
            labelWrapper.html(columnConf.label);
            
            //grabber
            if(index < configuration.length -1){
                var grabber = $('<div></div>');
                th.append(grabber);
                grabber.addClass("MyDataTable-header-grabber");
                setColumnResizeGrabbers(grabber[0]);
            }

            //initial sorting
            if(index == sorting.colIndex){
                th.addClass(sorting.ascending ? "sorted_asc" : "sorted_desc");
            }

            //sort event
            if(!options.fixedSorting){
                th.click(function(){
                    if(colResizeActive) return;
                    sortingTriggered($(this));
                }) 
            }           
        })
    }

    function addZeros(number){
        return number <= 9 ? "0" + number : number;
    }

    var format = {
        number : function(num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        },

        time : function(ms){
            var d = new Date(ms);
            return addZeros(d.getHours()) + ":" + addZeros(d.getMinutes());
        },


        logtime : function(ms){
            var d = new Date(ms);
            return addZeros(d.getHours()) + ":" + addZeros(d.getMinutes()) + ":" + addZeros(d.getSeconds());// + " [" + d.getMilliseconds() + "]";
        },

        filename : function(filename){
            return filename;
        }
    } 

    function createBody(){
        //create body table-wrapper
        bodyWrapper = $('<div></div>');
        bodyWrapper.addClass("MyDataTable-bodyWrapper");
        parent.append(bodyWrapper);

        //create body table
        var tableBody = $('<table></table>');
        tableBody.addClass("MyDataTable-body");
        tableBody.attr("border", "0");
        tableBody.attr("cellpadding", "0");
        tableBody.attr("cellspacing", "0");
        bodyWrapper.append(tableBody);

        //create body
        tbodyData = $('<tbody></tbody>');
        tableBody.append(tbodyData);    
    }

    function insertCellContent(
        columnConf, //the column configuration
        dataEntry,  //the data entry from data
        td,          //the table cell to fill weith content
        index
        ){

        //this fills the content into td
        if(columnConf.key != null){  
            //insert sorting value
            td.attr("sortValue", dataEntry[columnConf.key]);

            //insert content
            var dataType = columnConf.type;
            if(dataType != "BUTTON"){
                switch(dataType){
                    case "NUMBER":
                        td.html(format.number(dataEntry[columnConf.key]));
                        break;

                    case "TIME":
                        td.html(format.time(dataEntry[columnConf.key]));
                        break;       
                        
                    case "STRING":
                        td.html(dataEntry[columnConf.key]);
                        break;                           

                    case "LOGTIME":
                        td.html(format.logtime(dataEntry[columnConf.key]));
                        break;                          
                    
                    case "FILENAME":
                        td.html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + format.filename(dataEntry[columnConf.key]));
                        var arr = dataEntry[columnConf.key].split(".");
                        td.addClass("filename").addClass(arr[arr.length - 1].toLowerCase());
                        break;

                    case "ORDER":
                        td.html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + format.filename(dataEntry[columnConf.key]));
                        td.addClass("order");
                        break;            

                    case "LOG":
                        td.html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + format.filename(dataEntry[columnConf.key]));
                        td.addClass("log").addClass(dataEntry[columnConf.key]);
                        break;                           
                        
                    case "STATUS":
                        td.html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + format.filename(dataEntry[columnConf.key]));
                        td.addClass("status").addClass(dataEntry[columnConf.key]);
                        break;                         

                    case "FILESIZE":
                        td.html(format.number(dataEntry[columnConf.key]) + " KB");
                        break;

                    default: 
                        td.html(dataEntry[columnConf.key]);
                        break;
                }

                td.attr("title", td.html().split("&nbsp;").join(""));
            }
        }

        //td is filled by custom, external function
        else{
            columnConf.setContent(td);
        }
    }

    function resetData(){
        parent.removeClass("error");

        //set loading border
        parent.addClass("loading");
        setInterval(function(){parent.removeClass("loading");}, 1000);

        //prepare body
        var scrollTop = bodyWrapper.scrollTop();
        tbodyData.empty();

        //iterate through data
        for(var index = 0; index < data.length; index++){
            var dataEntry = data[index];
            var tr = $('<tr></tr>');
            tr.attr("dataIndex", index);
            if(selectedDataIndex == index){
                tr.addClass("selected");
                events.dataChangedOnSelectedRow(tr);
            }
            if(options.selectable){
                tr.click(function(){
                    if($(this).hasClass("selected")){
                        $(this).removeClass("selected");
                        selectedDataIndex = null;
                        events.rowUnselected();
                    }else{
                        $(this).parent().find('tr').removeClass("selected");
                        $(this).addClass("selected");
                        selectedDataIndex = $(this).attr("dataIndex");
                        events.rowSelected($(this));
                    }
                });
            }

            tbodyData.append(tr);
            configuration.forEach(function(columnConf, index){
                var td = $('<td></td>');
                tr.append(td);
                td.css("text-align", columnConf.align);

                //insert data
                insertCellContent(columnConf, dataEntry, td, index);

                td.width(headerWrapper.find('table tr th:nth-child(' + (index + 1) +')').width());
            });
        }

        //on finish
        bodyWrapper.scrollTop(scrollTop);
        updateWidths();
        sortDataTable();
    }

    function buildRawTable(){
        prepareParent();
        createHeader();
        createBody();
        updateWidths();
    }

    function evaluateNewData(dataNew){
        //sets the new data only, if forced or a change of dataIn compared to global data is detected
        if(JSON.stringify(dataNew) != JSON.stringify(data)){
            //dataNew is actually new
            data = dataNew;
            resetData();
        }
    }

    function onResize(){
        //after resize finished: create completer new table and fill with current data
        clearTimeout(onResizeTimeout);
        onResizeTimeout = setTimeout(function(){
            buildRawTable();
            resetData();
        }, 500);
    }



    //-----------------------INIT-----------------------
    //merge options
    Object.keys(optionsIn).forEach(function(key) {
        if(options.hasOwnProperty(key)){
            options[key] = optionsIn[key];
        }
        else{
            console.warn("Wrong options key for MyDataTable: " + key);
        }
    });

    sorting = options.sorting;
    
    detectScrollbarWidth();
    buildRawTable(); //just build empty table, no data yet available
    


    
    //---------------------INTERFACE---------------------
    this.setData = function(dataNew){ //data as array of json object, each of which contains key-value-pairs, one for every column
        evaluateNewData(dataNew);
    }

    this.setError = function(){
        parent.addClass("error");
    }

    this.unsetError = function(){
        parent.removeClass("error");
    }

    this.resize = function(){
        onResize();
    }

    this.getDataEntry = function(index){
        return data[index];
    }

    this.onEvent = function(key, fct){
        events[key] = fct;
    }

    this.deleteRow = function(dataIndex){
        //check if selected row is deleted
        if(dataIndex = selectedDataIndex){
            events.rowUnselected();
            selectedDataIndex = null;
        }
    }

    this.removeSelection = function(){
        events.rowUnselected();
        selectedDataIndex = null;
    }
}