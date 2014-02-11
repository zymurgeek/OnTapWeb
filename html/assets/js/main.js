// Global namespace events
var events = (function() {
    // Encapsulated variables

    var footerContainer = document.getElementById("ontap-container");
    var refreshButton = document.getElementById("refresh-button");
    var eventsList = document.getElementById("events-list");

    // Register event listeners
    refreshButton.addEventListener('click', refreshEvents, false);

    function refreshEvents() {
	loadData('http://localhost:8000/data/events.html', eventsList);
    }

    function loadData(dataUrl, target) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', dataUrl, true);
	xhr.onreadystatechange = function() {
  	    if (xhr.readyState == 4) {
		if((xhr.status >=200 && xhr.status <300) ||
                   xhr.status===304){

  		    target.innerHTML = xhr.responseText;
  		} else {
		    footerContainer.innerHTML += '<p class="error">Error getting ' +
			target.name + ": "+ xhr.statusText + ", code "+
			xhr.status + "</p>";
  		}
  	    }
	}
	xhr.send();
    }

})();
