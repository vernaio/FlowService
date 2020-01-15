var Cookie = {   

	Create: function (name, value, days) {
 
		var expires = "";
 
		 if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toGMTString();
		}
 
		document.cookie = name + "=" + value + expires + "; path=/";
	},
 
	Read: function (name) {
 
		 var nameEQ = name + "=";
		 var ca = document.cookie.split(";");
 
		 for (var i = 0; i < ca.length; i++) {
			 var c = ca[i];
			 while (c.charAt(0) == " ") c = c.substring(1, c.length);
			 if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		 }
 
		 return null;
	 },
 
	 Erase: function (name) {
 
		 Cookie.create(name, "", -1);
	 }
 
 };

 function buildTable(parent, headers, dataprops, id, classes, data){
    parent.empty();
    
    var table = $('<table></table>');
    if(id != null) table.attr("id", id);
    if(classes != null) {
        classes.forEach(element => {
            table.addClass(element);
        });
    }
    parent.append(table);

    var thead = $('<thead></thead>');
    table.append(thead);

    var tr = $('<tr></tr>');
    thead.append(tr);

    headers.forEach(function(element, i){
        var th = $('<th></th>');
        tr.append(th);
        th.html(element);
        th.attr("data-prop", dataprops[i])
    });
        
    var tbody = $('<tbody></tbody>');
    table.append(tbody);

    /*data.forEach(row => {
        var tr = $('<tr></tr>');
        tbody.append(tr);

        row.forEach(element => {
            var td = $('<td></td>');
            tr.append(td);
            td.html(element);
        });
    });*/
    console.log(data);

    let myTable = table.tableScroller("init",{
        "data": data,
        "options": {
          "tbodyHeight": "200px"
        }
    });
    /*table.DataTable(
		{
			paging: false,
			scrollY: 300,
			searching: false,
			select: true,
			responsive: true
		}
	);*/
}

var List = function(title, data){
    
}