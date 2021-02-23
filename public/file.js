var Request;

(function() {
	if (window.XMLHttpRequest) {
        Request = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        try {
             Request = new ActiveXObject("Microsoft.XMLHTTP");
        }    
        catch (CatchException) {
             Request = new ActiveXObject("Msxml2.XMLHTTP");
        }
    }
 
    if (!Request)  {
        alert("Невозможно создать XMLHttpRequest");
    }
})()

function SendRequest(method, args, path, handler) {
	if (!Request) {
        return;
    }
    
    Request.onreadystatechange = function() {
        if (Request.readyState == 4)  {
            handler(Request);
        }
    }
    
    if (method.toLowerCase() == "get" && args.length > 0)
    path += "?" + args;
    
    Request.open(method, path, false);
    
    if (method.toLowerCase() == "post") {
        Request.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
        Request.send(args);
    }
    else {
        Request.send(null);
    }
}

function SaveFile(filename, text) {
	console.save(filename, text);
}

function ReadFile(filename, container) {
	var Handler = function(Request) {
		alert('ready');
		container.innerHtml = Request.response;
    }
    
    SendRequest("GET","",filename,Handler);
}

(function(console){

    console.save = function(filename, data){

        if(!data) {
            console.error('Console.save: No data')
            return;
        }

        if(!filename) filename = 'console.json'

        if(typeof data === "object"){
            data = JSON.stringify(data, undefined, 4)
        }

        var blob = new Blob([data], {type: 'text/json'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')

        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
    }
})(console)