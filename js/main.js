google.load("feeds", "1"); //Load Google Ajax Feed API (version 1)		
var geocoder;
var map;
var address;
var contentString;
var cycle;
var resolution;
var index=0;
var infowindow;
var markers = new Array();
var newsItems = new Array();
var newsTitles = new Array();
google.maps.visualRefresh = true;

function initialize() {
    geocoder = new google.maps.Geocoder();
	if ((screen.availWidth >= 1920) || (screen.availHeight >= 1080)) {
		resolution = 3;
	}
	else if ((screen.availWidth >= 1280) || (screen.availHeight >= 720)) {
		resolution = 2;
	}
	else {
		resolution = 1;
	}
    var mapOptions = {
        center: new google.maps.LatLng(29, 69),
        zoom: resolution,
		mapTypeControl: false,
		zoomControl: true,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.LARGE,
			position: google.maps.ControlPosition.LEFT_CENTER
		},
		panControl: true,
		panControlOptions: {
			position: google.maps.ControlPosition.LEFT_CENTER	
		},
		streetViewControl: false
    };

    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	infowindow = new google.maps.InfoWindow();
	map.setOptions({minZoom:2});
}

function codeAddress() {
	address = newsItems.shift()
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                animation: google.maps.Animation.DROP,
				pos: index, //index of marker in array
				add: address
            });
            markers.push(marker);
			
			markers.sort(function(a,b){a.add<b.add});
			for (var i =0;i<markers.length-1;i++){
				if (markers[i].add==markers[i+1].add){
					newsTitles[i]+= "<br>"+newsTitles[i+1];
					markers.splice(i+1,1);
					i--;
				}
			}
			
            google.maps.event.addListener(marker, 'click', function () {
				infowindow.setContent(newsTitles[this.pos]);
				infowindow.open(map, this);
				map.setCenter(map.center);
				title: address;
            });
			index++;
        } else if (status == google.maps.GeocodeStatus.ZERO_RESULTS){
            clearInterval(cycle);
        } else if (status == google.maps.GeocodeStatus.OVER_QUERY_LIMIT){
			
		}
    });
}

google.maps.event.addDomListener(window, 'load', initialize);



var feedcontainer = document.getElementById("feeddiv")
var feedurl = "http://feeds.reuters.com/Reuters/worldNews"
var feedlimit = 50
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
				contentString = "<li><a href='" + thefeeds[i].link + "'>" + thefeeds[i].title + " - " + thefeeds[i].content.substr(0, thefeeds[i].content.indexOf("(Reuters)") - 1) + "</a></li>"
				newsTitles.push(contentString);
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