// Global namespace events
var events = (function($) {
    // Encapsulated variables
    var currentEventsList = document.getElementById("current-events-list");
    var pastEventsList = document.getElementById("past-events-list");

    // Register event listeners
    $('#refresh-button').on('click', refreshEvents);


    function refreshEvents() {
	$('#refresh-button').prop("disabled",true);
	loadJsonData('barley_legal_events_proxy.php?ble_path=getevent.aspx', 
		     currentEventsList, pastEventsList);
	$('#refresh-timestamp').html(new Date());
	$('#refresh-button').prop("disabled",false);
    }


    function loadJsonData(dataUrl, currentList, pastList) {
	var xhr = new XMLHttpRequest();
	xhr.overrideMimeType("application/json");
	xhr.open('GET', dataUrl, true);
	xhr.onreadystatechange = function() {
  	    if (xhr.readyState == 4) {
		if((xhr.status >=200 && xhr.status <300) ||
                   xhr.status===304){
  		    parseAndDisplayJsonResponse(xhr.responseText, 
						currentList, 
						pastList);
  		} else {
		    var errorText = '<p class="error">' 
			+ 'Error getting events: ' + xhr.statusText 
			+ ", code " + xhr.status + "</p>";
		    $('#footer-container').html(errorText);
		    
  		}
  	    }
	}
	xhr.send();
    }


    dateTimeReviver = function (key, value) {
	var a;
	if (typeof value === 'string') {
	    if (value.indexOf('\/Date(') != -1) {
		var myDate = new Date(parseInt(value.replace
			(/\/+Date\(([\d+-]+)\)\/+/, '$1')));
		return myDate;
            }
	}
	return value;
    }


    function formatEventDate(dateObject) {
	var monthAbbrs = new Array("Jan.", "Feb.", "Mar.", "Apr.", "May", 
				   "June", "July", "Aug.", "Sep.", "Oct.", 
				   "Nov.", "Dec.");
	var date = dateObject.getDate();
	var month = dateObject.getMonth();
	var year = dateObject.getFullYear();
	var formattedDate = monthAbbrs[month] + ' ' + date + ', ' + year;
	return formattedDate;
    }


    function parseAndDisplayJsonResponse(jsonResponseText, currentList,
					 pastList) {
	var now = new Date();
	currentList.innerHTML = "";
	pastList.innerHTML = "";
        var jsonData = JSON.parse(jsonResponseText, dateTimeReviver);

        var line = '';
        for(var i= 0; i < jsonData.length; i++) {
	    if ( jsonData[i].Active == true && jsonData[i].Deleted == false ) {
		eventDate = jsonData[i].EventDate;
		line = '<tr><td>'
		    + formatEventDate(eventDate)
		    + '</td><td> '
		    + '<a href="http://misdb.com/barleylegalapp/'
		    + 'getbeersforevent.aspx?id=' 
		    + jsonData[i].ID + '">'
		    + jsonData[i].EventName
		    + '</a></td></tr>';
		if (eventDate >= now) {
		    currentList.innerHTML = line + currentList.innerHTML;
		} else {
		    pastList.innerHTML += line;
		}
	    }
        }
    }

    refreshEvents();
})(jQuery);
