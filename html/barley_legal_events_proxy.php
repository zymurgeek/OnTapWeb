<?php
// Barley Legal Events Proxy
// 
// Adapted from php_proxy_simple.php
// See: http://developer.yahoo.com/javascript/howto-proxy.html

// Responds to both HTTP GET and POST requests
// Author: Jason Levitt
// December 7th, 2005

// Allowed hostname
define ('HOSTNAME', 'http://misdb.com/barleylegalapp/');
// Beta server:  http://misdb.com/barleylegalapp/
// Production server:  http://barleylegalevents.com/barleylegal/

// Get the REST call path from the AJAX application
// Is it a POST or a GET?
$path = (isset($_POST['ble_path'])) ? $_POST['ble_path'] : $_GET['ble_path'];
$url = HOSTNAME.$path;

// Open the Curl session
$session = curl_init($url);

// If it's a POST, put the POST data in the body
if (isset($_POST['ble_path'])) {
	$postvars = '';
	while ($element = current($_POST)) {
		$postvars .= urlencode(key($_POST)).'='.urlencode($element).'&';
		next($_POST);
	}
	curl_setopt ($session, CURLOPT_POST, true);
	curl_setopt ($session, CURLOPT_POSTFIELDS, $postvars);
}

// Don't return HTTP headers. Do return the contents of the call
curl_setopt($session, CURLOPT_HEADER, false);
curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

// Make the call
$xml = curl_exec($session);

// The web service returns XML. Set the Content-Type appropriately
header("Content-Type: text/xml");

echo $xml;
curl_close($session);

?>
