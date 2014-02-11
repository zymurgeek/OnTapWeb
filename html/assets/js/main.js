// Global namespace events
var events = (function() {
    // Encapsulated variables

    var refreshButton = document.getElementById("refresh-button");
    var eventsList = document.getElementById("events-list");

    // Register event listeners
    refreshButton.addEventListener('click', refreshEvents, false);

    function refreshEvents() {
	alert("Query server for events from main.js.");
	loadData('http://localhost:8000/data/events.html', eventsList);
    }

    function loadData(dataUrl, target) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', dataUrl, true);
	xhr.onreadystatechange = function() {
  	    if (xhr.readyState == 4) {
		if((xhr.status >=200 && xhr.status <300) ||
                   xhr.status===304){

  		    target.innerHTML += xhr.responseText;
  		} else {
  		    console.log(xhr.statusText);
  		}
  	    }
	}
	xhr.send();
    }

})();
