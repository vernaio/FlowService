/*
*	This script segment determines or validates the language and target and sets the url
* 	after this code segment we have valid variables 'lan' and 'target'
*/
function init(){
    allowedLanguages = ["de", "en"];
    allowedTargets = ["home", "config", "services", "data-in", "data-out", "data-out-lt"];

    //get the language and target from URL
    var urlParams =  {
        getLan : function(){
            return window.location.pathname.split("/")[1] || null;
        },
        getTarget : function(){
            return window.location.pathname.split("/")[2] || null;
        }
    };

    function determineLanguage(){
        //check cookie for language
        var cookieLanguage = Cookie.Read("language");
        if(allowedLanguages.includes(cookieLanguage)){
            return cookieLanguage;
        }

        //check browser language
        var browserLan = (navigator.language || navigator.userLanguage).substr(0,2);
        if(allowedLanguages.includes(browserLan)){
            return browserLan;
        }

        return null;
    }

    function changeURL(url, title) {
        var new_url = '/' + url;
        window.history.pushState('data', 'Title', new_url);
        document.title = title;
    }

    //determine language and target
    lan = urlParams.getLan();
    target = null;
    if(!allowedLanguages.includes(lan)){
        lan = null;
    }
    if(lan === null){
        lan = determineLanguage() || "de"; //default language
        target = "home";
        urlPath = lan + "/" + "home";
        changeURL(urlPath, "home");
    }

    //determine target, if not yet set by language (lan is valid for sure)
    if(target === null){

        //if no target set -> home
        if(urlParams.getTarget() === null){
            target = "home";
            urlPath = lan + "/" + "home";
            changeURL(urlPath, "home");
        } 

        //target set and valid
        else if(allowedTargets.includes(urlParams.getTarget())){
            target = urlParams.getTarget();
        }

        //404
        else{
            target = "404";
        }
    }
}

//we now have vars 'lan' and 'target' validated