google.load("feeds", "1"); //Load Google Ajax Feed API (version 1)		
var geocoder;
var map;
var address;
var contentString;
var cycle;
var markers = new Array();
var newsItems = new Array();
google.maps.visualRefresh = true;

function initialize() {
    geocoder = new google.maps.Geocoder();
    var mapOptions = {
        center: new google.maps.LatLng(29, 69),
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    //			var strictBounds = new google.maps.LatLngBounds(
    //			new google.maps.LatLng(85, -180),
    //		new google.maps.LatLng(-85, 180)
    //);
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}

function codeAddress() {
	address = newsItems.shift()
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            // contentString = whatever you want in the popup
            var contentString = '<div id="content">' +
                '<div id="siteNotice">' +
                '</div>' +
                '<h1 id="firstHeading" class="firstHeading">TEST					</h1>' +
                '<div id="bodyContent">' +
                '</div>' +
                '</div>';

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                animation: google.maps.Animation.DROP
            });

            markers.push(marker);
            var flag = 1;
            google.maps.event.addListener(marker, 'click', function () {
                if (flag == 1) {
                    infowindow.open(map, marker);
                    map.setCenter(map.center);
                    title: address;
                    flag = 0;
                } else {
                    infowindow.close(map, marker);
                    map.setCenter(map.center);
                    flag = 1;
                }
            });
        } else if (status == google.maps.GeocodeStatus.ZERO_RESULTS){
            clearInterval(cycle);
        } else if (status == google.maps.GeocodeStatus.OVER_QUERY_LIMIT){
			
		}
    });
}

google.maps.event.addDomListener(window, 'load', initialize);



var feedcontainer = document.getElementById("feeddiv")
var feedurl = "http://feeds.reuters.com/Reuters/worldNews"
var feedlimit = 25
var rssoutput = "<b>Latest World News</b><br /><ul>"

    function rssfeedsetup() {
        var feedpointer = new google.feeds.Feed(feedurl) //Google Feed API method
        feedpointer.setNumEntries(feedlimit) //Google Feed API method
        feedpointer.load(displayfeed) //Google Feed API method
    }

    function displayfeed(result) {
        if (!result.error) {

            var thefeeds = result.feed.entries
            for (var i = 0; i < thefeeds.length; i++){
			address = thefeeds[i].content.substr(0, thefeeds[i].content.indexOf("(Reuters)") - 1);
			newsItems.push(address);
                rssoutput += "<li><a href='" + thefeeds[i].link + "'>" + thefeeds[i].title + " - " + thefeeds[i].content.substr(0, thefeeds[i].content.indexOf("(Reuters)") - 1) + "</a></li>"
            feedcontainer.innerHTML = rssoutput
			}
			cycle = setInterval(codeAddress, 600);
			            rssoutput += "</ul>"
			        } else
            alert("Error fetching feeds!")
    }

window.onload = function () {
    rssfeedsetup()
}


$("nav a").addClass("selected");
$("nav a").click(function() {
    $(this).toggleClass("selected");
    console.log($(this).attr("id") + " - " + ($(this).hasClass("selected") ? "enabled" : "disabled"));
});