// Global namespace events
var events = (function($) {
    // Register event listeners
    $('#refresh-button').on('click', refreshEvents);


    function refreshEvents() {
	$('#refresh-button').prop("disabled",true);
	loadJsonData('barley_legal_events_proxy.php?ble_path=getevent.aspx', 
		     $('#current-events-list'), $('#past-events-list'));
	$('#refresh-timestamp').html(new Date());
	$('#refresh-button').prop("disabled",false);
    }


    function isValidObject(objToTest) {
	if (null == objToTest) return false;
	if ("undefined" == typeof(objToTest)) return false;
	return true;
    }


    $.ajaxSetup({
	converters: {
            "json jsonevents": function(data) {
		if (isValidObject(data)) {
                    $.each(data, function(i,o){
			if (o.EventDate) {
                            data[i].EventDate = dateTimeReviver(null, o.EventDate);
			}
                    });
                    return data;
		} else {
                    throw exceptionObject;
		}
            }
	}
    });


    function loadJsonData(dataUrl, currentList, pastList) {
	$.ajax({
	    url: dataUrl,
	    type: 'GET',
	    dataType: 'jsonevents'
	}).done(function(data){
	    parseAndDisplayJsonResponse(data, currentList, pastList);
	}).fail(function(jqXHR, textStatus, error) {
		    var errorText = '<p class="error">' 
			+ 'Error getting events: ' + error 
			+ ", code " + jqXHR.status + "</p>";
		    $('#footer-container').html(errorText);
	});
    }


    function jsonWithDateParser (data, type) {
	parsedData = JSON.parse(data, dateTimeReviver);
	return parsedData;
    }


    dateTimeReviver = function (key, value) {
	var a;
	if (typeof value === 'string') {
	    if (value.indexOf('\/Date(') != -1) {
		var dateInt1 = value.replace
		(/\/+Date\(([\d+-]+)\)\/+/, '$1');
		var dateInt2 = dateInt1.replace
		(/(\d+)[+-]?\d*/, '$1');
		var dateInt = parseInt(dateInt2);
		var myDate = new Date(dateInt);
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


    function parseAndDisplayJsonResponse(jsonData, currentList,
					 pastList) {
	var now = new Date();
	var currentListHtml = "";
	var pastListHtml = "";

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
		    currentListHtml = line + currentListHtml;
		} else {
		    pastListHtml += line;
		}
	    }
        }
	currentList.html(currentListHtml);
	pastList.html(pastListHtml);
    }

    refreshEvents();
})(jQuery);
