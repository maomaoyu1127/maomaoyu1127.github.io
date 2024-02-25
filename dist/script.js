// The value for 'accessToken' begins with 'pk...'
mapboxgl.accessToken =
  "pk.eyJ1IjoibWFvbWFveXUxMTI3IiwiYSI6ImNscjZlaDF5djIzb3Iya3A4Njl6cDJlZ2wifQ.AtydDqm_Y7tFeZcz98S5Ig";
 
// Define a map object by initialising a Map from Mapbox
const map = new mapboxgl.Map({
  container: "map",
  // Replace YOUR_STYLE_URL with your style URL.
  style: "mapbox://styles/maomaoyu1127/clsw7g6i3007y01poelc9aaj5",
  center: [-4.25,55.861111],
  zoom: 11
});

// This part links to the mapbox dataset
const dataset_url = "https://api.mapbox.com/datasets/v1/maomaoyu1127/clswlxsru04du1nocwa53blzz/features?access_token=pk.eyJ1IjoibWFvbWFveXUxMTI3IiwiYSI6ImNscjZlaDF5djIzb3Iya3A4Njl6cDJlZ2wifQ.AtydDqm_Y7tFeZcz98S5Ig"

const primaryCheckbox = document.getElementById('primaryCheckbox');
const secondaryCheckbox = document.getElementById('secondaryCheckbox');
const specialCheckbox = document.getElementById('specialCheckbox');

// Add the following code to the map.on('load', ...) event handler with the following code

map.on('load', () => {
  // ...

  // Adding layers and data sources
  map.addSource("schools", {
    type: "geojson",
    data: dataset_url,
  });

  map.addLayer({
  id: "school-layer",
  type: "circle",
  source: "schools",
  paint: {
    "circle-radius": 5,
    "circle-color": [
      "match",
      ["get", "SchoolType"],
      "Primary", "#f2ef31",
      "Secondary", "#e21212",
      "Special", "#144eeb",
      "#888888" // Default colour
    ],
    "circle-opacity": 1,
    "circle-stroke-color": "black", // Set the border colour
    "circle-stroke-width": 1, // Set the border width
  },
});

  // Adding a checkbox change event listener
  primaryCheckbox.addEventListener('change', updateFilter);
  secondaryCheckbox.addEventListener('change', updateFilter);
  specialCheckbox.addEventListener('change', updateFilter);

  //  Updating Filter Functions
  function updateFilter() {
    const filter = ["any"];

    if (primaryCheckbox.checked) {
      filter.push(["==", "SchoolType", "Primary"]);
    }
    if (secondaryCheckbox.checked) {
      filter.push(["==", "SchoolType", "Secondary"]);
    }
    if (specialCheckbox.checked) {
      filter.push(["==", "SchoolType", "Special"]);
    }

    // Updating Filter Functions
    map.setFilter("school-layer", filter);

    // Show or hide data points
    const visibility = filter.length > 1 ? 'visible' : 'none';
    map.setLayoutProperty("school-layer", 'visibility', visibility);
  }
});
 
//  Mouse hover events
map.on("mousemove", (event) => {
  const dzone = map.queryRenderedFeatures(event.point, {
    layers: ["glasgow-school-3ir28y"]
  });
  
 // Update the contents of the info panel
  document.getElementById("pd").innerHTML = dzone.length
    ? `<h3>${dzone[0].properties.SchoolName}</h3><p>Post Code: <strong>${dzone[0].properties.PostCode}</strong></p><p>Phone Number: <strong>${dzone[0].properties.PhoneNumbe}</strong></p> `
    : `<p>Hover over a data point!</p>`;
  
 // Update hover layer data
  map.getSource("hover").setData({
    type: "FeatureCollection",
    features: dzone.map(function (f) {
      return { type: "Feature", geometry: f.geometry };
    })
  });
});

// Actions performed when the map is loaded
map.on('load', () => {     
  const layers = [
    "Primary",
    "Secondary",
    "Special"
  ];
  const colors = [
    "#f2ef31",
    "#e21212",
    "#144eeb"
  ];
 
// create legend
const legend = document.getElementById('legend');
 
layers.forEach((layer, i) => {
const color = colors[i];
const item = document.createElement('div');
const key = document.createElement('span');
key.className = 'legend-key';
key.style.backgroundColor = color;
 
const value = document.createElement('span');
value.innerHTML = `${layer}`;
item.appendChild(key);
item.appendChild(value);
legend.appendChild(item);
});

  // Add a hover layer
  map.addSource("hover", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] }
  });

  map.addLayer({
    id: "dz-hover",
    type: "circle",  
    source: "hover",
    paint: {
      "circle-color": "black", 
      "circle-radius": 12  
    }
  });
});

// Add geocoding controls
const geocoder = new MapboxGeocoder({
  // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: "Search for places in Glasgow", // Placeholder text for the search bar
  proximity: {
    longitude: 55.8642,
    latitude: 4.2518
  } // Coordinates of Glasgow center
});
map.addControl(geocoder, "top-left");

// Add geocoding controls
map.addControl(new mapboxgl.NavigationControl(), "top-left");
// Add geolocation controls
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
  }),
  "top-left"
);

// Add a fullscreen control
map.addControl(new mapboxgl.FullscreenControl(), "top-left");

// Add a scale control
map.addControl(new mapboxgl.ScaleControl(), "bottom-right");