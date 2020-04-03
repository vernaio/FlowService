function initHTML(parent){

    //remove all elements with a 'lan'-attribute where the value is not lan, e.g. lan=de
    for(var i = 0; i < allowedLanguages.length; i++){
        var thisLan = allowedLanguages[i];
        if(thisLan !== lan) parent.find('*[lan=' + thisLan + ']').remove();
    }

    //change all links
    parent.find('a').each(function(){
        var link = $(this).attr("href");
        if(link.length > 3 && link[0] === "/"){
            var newLink = "/" + lan + link.substr(3);
            $(this).attr("href", newLink);
        }
    });

    //set document title
    document.title = "PIB Flow - " + parent.find('h1').html();
}