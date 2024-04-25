let lattext = document.getElementById("lat");
let longtext = document.getElementById("long");
let nearestDistance = document.getElementById("dist");
let userLocationMarker;
let action = document.getElementById("action");
let playedPoints = new Set();


let polylineCoords = [
  [41.92809632, 42.0306927],
  [41.92760941, 42.03096092],
  [41.92524266, 42.02552676],
  [41.92302749, 42.01927722],
  [41.92245673, 42.02060759],
  [41.92022949, 42.02306986],
  [41.91965072, 42.02350438],
  [41.91962677, 42.02216327],
  [41.9189003, 42.01848328],
  [41.91902004, 42.01603711],
  [41.91897614, 42.01449215],
  [41.9194232, 42.01378405],
  [41.91995407, 42.01336026],
  [41.91960681, 42.00984657],
  [41.91934736, 42.00903118],
  [41.91977046, 42.00662792],
  [41.92019357, 42.00616658],
  [41.92114754, 42.00589836],
  [41.92161853, 42.00626314],
  [41.92179415, 42.00598419],
  [41.92159857, 42.0056355],
  [41.92118745, 42.00541019],
  [41.92113556, 42.00242758],
  [41.91776667, 42.00235784],
  [41.91739544, 42.00105429],
  [41.91720783, 42.00099528],
  [41.91662503, 42.00176775],
  [41.91653322, 42.00279236],
  [41.91679668, 42.00300694],
  [41.91724775, 42.00249195],
  [41.91997802, 42.00261533],
  [41.92103977, 42.00254023],
  [41.92113157, 42.00567842],
  [41.92149878, 42.0062685],
  [41.9222372, 42.00586081],
  [41.92254454, 42.00587153],
  [41.92227711, 42.00765789],
  [41.92382975, 42.00748622],
  [41.92364615, 42.00557649],
  [41.92312329, 42.00560331],
  [41.92316719, 42.00200915],
  [41.92353439, 42.00186431],
  [41.92423686, 42.00107038],
  [41.92535441, 42.0024544],
  [41.92543025, 42.00330734],
  [41.92662361, 42.0031625],
  [41.92717438, 42.00473428],
  [41.92724622, 42.00526536],
  [41.92547814, 42.00540483],
  [41.92390559, 42.00551748],
  [41.9214469, 42.00573742],
  [41.92138303, 42.00593054],
  [41.92146685, 42.00655818],
  [41.92080427, 42.00893998],
  [41.92140299, 42.01248586],
  [41.92252059, 42.01198161],
  [41.92404129, 42.01547384],
  [41.92519077, 42.01906264],
  [41.92315123, 42.01985121],
  [41.92416502, 42.02294111],
  [41.92529055, 42.02575743],
  [41.92756551, 42.03107893],
  [41.92802847, 42.03081608]
];


let checkpoints = [
    [41.9251748, 42.0127916],
    [41.9252227, 42.0129365],
    [41.9252506, 42.0130599],
    [41.9252945, 42.0131832],
    [41.9253225, 42.0133173],
    [41.9253664, 42.0134300],
    [41.9254103, 42.0135748],
    [41.9254422, 42.0137036],
    [41.9254861, 42.0138162],
    [41.9255141, 42.0139289]
  ];
  


// Define the audio files for each option
const audioFiles = {
  "100left": "audio/100left.mp3",
  "100right": "audio/100right.mp3",
  "left": "audio/left.mp3",
  "right": "audio/right.mp3",
  "start": "audio/start.mp3"
};


// Define the options list
const options = ["start", "right", "left", "100right", "100left","right", "left", "100right", "100left", "left"]; // Example options list


let sumLat = polylineCoords.reduce((acc, val) => acc + val[0], 0);
let sumLng = polylineCoords.reduce((acc, val) => acc + val[1], 0);

let avgLat = sumLat / polylineCoords.length;
let avgLng = sumLng / polylineCoords.length;

// let map = L.map('map').setView([avgLat, avgLng], 16.3);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
// }).addTo(map);

// Existing map setup code
let map = L.map('map').setView([avgLat, avgLng], 17.2);

// Define the default and satellite layers
let defaultLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '©OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
}).addTo(map);


let satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

// Add functionality to toggle button
document.getElementById('toggleMap').addEventListener('click', function() {
    if (map.hasLayer(defaultLayer)) {
        map.removeLayer(defaultLayer);
        map.addLayer(satelliteLayer);
        this.textContent = 'Toggle Default View'; // Change button text accordingly
    } else {
        map.removeLayer(satelliteLayer);
        map.addLayer(defaultLayer);
        this.textContent = 'Toggle Satellite View'; // Reset button text
    }
});








let checkpointMarkers = []; // Initialize an empty array to store checkpoint markers

polylineCoords.forEach((coord, index) => {
    let color = 'cyan';
    if (index === 0) color = 'red'; // Start point
    else if (index === polylineCoords.length - 1) color = 'black'; // End point

    let circleMarker = L.circleMarker(coord, {
        color: color,
        fillColor: 'blue',
        fillOpacity: 1,
        radius:5
    }).addTo(map);

    //animateBreathing(circleMarker); // Apply breathing animation to each marker

    // Store the marker and its index or any other relevant info
    checkpointMarkers.push({
        marker: circleMarker,
        index: index,
        coordinates: coord,
        description: `Checkpoint ${index + 1}`
    });
});


let polyline = L.polyline(polylineCoords, {color: '#028ffa', weight: 7, dashArray: '12, 12'}).addTo(map);


// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radius of the Earth in meters
  const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  return distance;
}



function playAudio(audioKey) {
  if (audioFiles.hasOwnProperty(audioKey)) {
      let audio = new Audio(audioFiles[audioKey]);
      audio.play().then(() => {
          console.log("Audio playing successfully");
      }).catch(error => {
          console.error("Error playing audio:", error);
      });
  } else {
      console.error("Audio file not found for key:", audioKey);
  }
}


// Define a variable to track the index of the current checkpoint
let currentCheckpointIndex = 0;

let distanceToNextCheckpoint;
// Start watching the user's location with higher accuracy and faster updates
navigator.geolocation.watchPosition((position) => {
    
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    updateUserLocation(lat, lng); // Update the location on the map
    

    // Get the current checkpoint and the next checkpoint
    let currentCheckpoint = checkpoints[currentCheckpointIndex];
    let nextCheckpoint = checkpoints[currentCheckpointIndex + 1];

   // Calculate the distance from the current location to the next checkpoint

if (nextCheckpoint) {
    distanceToNextCheckpoint = calculateDistance(lat, lng, nextCheckpoint[0], nextCheckpoint[1]);
} else {
    // Handle the case where there is no next checkpoint
    console.log("You have reached the end of the route.");
    return; // Exit the function or add further logic as needed
}



// Play audio if the distance to the next checkpoint is less than a threshold and the current checkpoint has not been played
if (distanceToNextCheckpoint < 100 && !playedPoints.has(currentCheckpointIndex)) {
    const currentOption = options[currentCheckpointIndex];
    playAudio(currentOption);
    playedPoints.add(currentCheckpointIndex); // Add the current index to the set
    
console.log(playedPoints);

    currentCheckpointIndex++; // Move to the next checkpoint
    console.log(`You have passed checkpoint ${currentCheckpointIndex}`);
}

//lattext.innerHTML = `Checkpoint index: ${currentCheckpointIndex}`; // Update the checkpoint index text
longtext.innerHTML = `Distance to the checkpoint ${currentCheckpointIndex}: ${distanceToNextCheckpoint.toFixed(0)} meters`; // Update the distance text


    // Print the real-time distance from the current location to the next checkpoint
    console.log(`Real-time distance to next checkpoint: ${distanceToNextCheckpoint} meters`);
}, (err) => {
    console.error("Error getting the position - ", err);
}, {
    enableHighAccuracy: true, // Enable high accuracy mode for better accuracy
    maximumAge: 100, // Reduce the maximum age to get fresher location updates
    timeout: 5000 // Reduce the timeout to get faster updates
});

// Add checkpoint markers to the map
checkpoints.forEach((checkpoint, index) => {
  L.marker(checkpoint).addTo(map).bindPopup(`Checkpoint ${index + 1}`); // Add a marker for each checkpoint
});

// =====================================================================================
// Function to update the user's location marker on the map
function updateUserLocation(lat, lng) {
  // Remove the previous user location marker if it exists
  if (userLocationMarker) {
      map.removeLayer(userLocationMarker);
  }

  // Define custom marker icon options
  var customIcon = L.icon({
    iconUrl: 'icons/location.png', // URL to the custom icon image
    iconSize: [37, 37], // Size of the icon
    iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
  });

  // Create a new marker for the user's location with custom icon
  userLocationMarker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
}


//Reset

document.addEventListener('DOMContentLoaded', function() {
    var startButton = document.getElementById('startNavigation');
    var startAudio = document.getElementById('audioStart');

    // Check if the audio should play immediately after reloading
    if (localStorage.getItem('playAudioAfterReload') === 'true') {
        startAudio.play().then(() => {
            console.log("Audio is playing after reload."); // Success log
        }).catch(error => {
            console.error("Error playing audio after reload:", error); // Error log
        });

        // Clear the flag so audio doesn't play again on next load unless explicitly set
        localStorage.removeItem('playAudioAfterReload');
    }

    startButton.addEventListener('click', function() {
        console.log('Button clicked, reloading page...'); // Debug log

        // Set flag to play audio after reload
        localStorage.setItem('playAudioAfterReload', 'true');

        // Refresh the page
        location.reload();
    });
});

