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
        buffer: 10
    }

    var sorting = {
        colIndex : 0,
        ascending : true,
        type : "STRING"
    }

    var headerWrapper, bodyWrapper, colResizeActive, tbodyData, placeholder, scrollbarWidth, id;
    var data = {};
    var colResizeActive = false;
       
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
    
        rows.sort(function(a, b) {
            var A,B;
    
            if(sorting.type == "STRING"){
                var A = $(a).children('td').eq(sorting.colIndex).text().toUpperCase();
                var B = $(b).children('td').eq(sorting.colIndex).text().toUpperCase();
            }
            else if (sorting.type == "NUMBER"){
                var A = parseFloat($(a).children('td').eq(sorting.colIndex).text().split(".").join(""));
                var B = parseFloat($(b).children('td').eq(sorting.colIndex).text().split(".").join(""));
            }else{
                console.log("error: wrong type "+ sorting.type);
            }
        
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
        sorting.type = th.attr("type");
        sortDataTable();
    }
    
    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }    

    function createRawTable(){
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
                sorting.type = columnConf.type
            }

            //sort event
            th.click(function(){
                if(colResizeActive) return;
                sortingTriggered($(this));
            })            
        })

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

    function setData(dataIn){
        parent.removeClass("error");

        //detect change
        if(JSON.stringify(dataIn) == JSON.stringify(data)) return;

        //set loading border
        parent.addClass("loading");
        setInterval(function(){parent.removeClass("loading");}, 1000);

        data = dataIn;
        var scrollTop = bodyWrapper.scrollTop();
        tbodyData.empty();
        data.forEach(function(dataEntry, index){
            var tr = $('<tr></tr>');
            tbodyData.append(tr);
            configuration.forEach(function(columnConf, index){
                var td = $('<td></td>');
                tr.append(td);
                td.css("text-align", columnConf.align);
                td.width(headerWrapper.find('table tr th:nth-child(' + (index + 1) +')').width());
                td.html(columnConf.type == "NUMBER" ? formatNumber(dataEntry[columnConf.key]) : dataEntry[columnConf.key]);
            });
        });
        bodyWrapper.scrollTop(scrollTop);
        updateWidths();

        //initial sorting
        sortDataTable();
    }

    function buildTable(){
                //prepare parent
                parent.empty();
                parent.addClass("MyDataTable-parent");
                parent.css('height', options.height);
                parent.css('width', options.width);
                parent.css('min-width', options.minWidth);
                createRawTable();
                updateWidths();
                var dataIn = data;
                data = {};
                setData(dataIn);
    }

    function init(){
        //merge options
        Object.keys(optionsIn).forEach(function(key) {
            if(options.hasOwnProperty(key)){
                options[key] = optionsIn[key];
            }
            else{
                console.warn("Wrong options key for MyDataTable: " + key);
            }
        });

        //detect scrollbar width
        detectScrollbarWidth();

        //build table
        buildTable();
    }
    
    init();
    
    this.setData = function(dataIn){ //data as array of json object, each of which contains key-value-pairs, one for every column
        setData(dataIn);
    }

    this.setError = function(){
        parent.addClass("error");
    }

    this.resize = function(){
        clearTimeout(id);
        id = setTimeout(function(){
            buildTable();
        }, 500);
    }
}