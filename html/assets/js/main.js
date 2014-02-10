// Global namespace events
var events = (function() {
	// Encapsulated variables

	var refreshButton = document.getElementById("refresh-button");

	// Register event listeners
    	refreshButton.addEventListener('click', refreshEvents, false);

	function refreshEvents()
    	{
		alert("Query server for events from main.js.");
	}

})();
