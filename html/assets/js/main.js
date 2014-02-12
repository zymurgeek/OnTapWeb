// Global namespace events
var events = (function() {
    // Encapsulated variables

    var footerContainer = document.getElementById("ontap-container");
    var refreshButton = document.getElementById("refresh-button");
    var eventsList = document.getElementById("events-list");

    // Register event listeners
    refreshButton.addEventListener('click', refreshEvents, false);

    function refreshEvents() {
	loadJsonData('http://localhost:8000/data/events.json', eventsList);
    }

    function loadJsonData(dataUrl, target) {
	var xhr = new XMLHttpRequest();
	xhr.overrideMimeType("application/json");
	xhr.open('GET', dataUrl, true);
	xhr.onreadystatechange = function() {
  	    if (xhr.readyState == 4) {
		if((xhr.status >=200 && xhr.status <300) ||
                   xhr.status===304){
  		    loadJsonResponse(xhr.responseText, target);
  		} else {
		    footerContainer.innerHTML += '<p class="error">Error getting ' +
			target.name + ": "+ xhr.statusText + ", code "+
			xhr.status + "</p>";
  		}
  	    }
	}
	xhr.send();
    }

    function loadJsonResponse(jsonResponseText, target) {
	target.innerHTML = "";
        var jsonData = JSON.parse(jsonResponseText);

        var line = '';
        for(var i= 0; i < jsonData.length; i++) {
	    if ( jsonData[i].Active == true && jsonData[i].Deleted == false ) {
		line = '<p><a href="http://misdb.com/barleylegalapp/getbeersforevent.aspx?id=' 
		    + jsonData[i].ID + '">' + jsonData[i].EventName + '</a></p>';
		target.innerHTML += line;
	    }
        }
    }

    refreshEvents();
})();
