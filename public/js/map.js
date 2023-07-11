
var click = false;
var y;
var z = false;


 function initAutocomplete() {

    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -37.8136, lng: 144.9631 },
      zoom: 16,
      mapTypeId: "roadmap",
    });
    // Create the search box and link it to the UI element.
    const input = document.getElementById("pac-input");
    const searchBox = new google.maps.places.SearchBox(input);
    
    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });
    var lat1 =document.getElementById("latlng").value;
    var zz = JSON.parse(lat1)
    console.log(zz)
    var latlng;
    for (let i = 0; i< zz.length;i++){
      latlng= {lat:parseFloat(zz[i][0]), lng:parseFloat(zz[i][1])};
      marker = new google.maps.Marker({
        position: latlng,
        map: map,
    });
    marker.addListener("click", function(event) {
      map.setZoom(20);
      map.setCenter(event.latLng);
      var lat = event.latLng.lat().toString()
      var lng = event.latLng.lng().toString()
      var latlng = lat+", "+lng
      console.log(event)
      if(document.getElementById(latlng).style.display== "inline"){
        document.getElementById(latlng).style.display= "none"
      }else{
        document.getElementById(latlng).style.display= "inline";
      }
      
    });
    }

    let markers = [];
  
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
  
      if (places.length == 0) {
        return;
      }

  
      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
  
      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }
  
        const icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };
        
        // Create a marker for each place.
        markers.push(
          new google.maps.Marker({
            map,
            icon,
            title: place.name,
            position: place.geometry.location,
          })
        );
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
    map.setTilt(45);
    
    y = map;
    bindDataLayerListeners(map.data);

    //load saved data

  }
  
  window.initAutocomplete = initAutocomplete;

function mmarker(){

document.getElementById("map").addEventListener("mouseover", function(event){
  event.target.style.cursor = "url('../img/marker.png') 16 45, auto";

});

google.maps.event.addListenerOnce(map,'click', function(e) {
  placeMarker(e.latLng, map);
  document.getElementById("map").addEventListener("mouseover", function(event){
    event.target.style.cursor = "";

  });

  document.getElementById("coord").value = e.latLng;
  const arr = (document.getElementById("coord").value).replace(/[{()}]/g, '').split(",");

  document.getElementById("lat").value = arr[0];
  document.getElementById("lng").value = arr[1];
});

document.getElementById("add").style.display = "none";
}


function placeMarker(position, map) {

  var marker = new google.maps.Marker({
      position: position,
      map: map,
  });
  
  var infowindow = new google.maps.InfoWindow({
      content: 'Latitude: ' + position.lat() + '<br>Longitude: ' + position.lng()
  });
  infowindow.open(map, marker);

  //place marker info
  map.data.add(new google.maps.Data.Feature({properties:{},geometry:new google.maps.Data.Point(position)})); 

  z = true;
}



function saveMarker() {
  y.data.toGeoJson(function (json) {
      localStorage.setItem('geoData', JSON.stringify(json));
  });
}


function clearMarkers() {
  y.data.forEach(function (f) {
      y.data.remove(f);
  });
}

function loadMarkers(map) {
  var data = JSON.parse(localStorage.getItem('geoData'));
  map.data.addGeoJson(data);
}

function bindDataLayerListeners(dataLayer) {
  dataLayer.addListener('addfeature', saveMarker);
  dataLayer.addListener('removefeature', saveMarker);
  //dataLayer.addListener('setgeometry', saveMarker);
}

function movepage(page) {
  window.location.href = '/' + page
}









function uncheck(){
  document.querySelectorAll('input[type=radio]').forEach(el => el.checked = false);
}
function closeall(){
  for ( const s of document.getElementsByClassName("infobox")){
    s.style.display = "none";
  }
  console.log("xd")
}