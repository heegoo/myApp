import $ from 'dom7';
import Framework7 from 'framework7/bundle';

// Import F7 Styles
import 'framework7/css/bundle';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';

window.currentGeoLoc = window.currentGeoLoc || {};
window.currentGeoLoc = { //GeolocationPosition
  coords: { // GeolocationCoordinates //default : 카카오 제주
    latitude: 33.450701, 
    longitude: 126.570667
  }
};
console.log('default currentGeoLoc',window.currentGeoLoc)

function getCurrentLocation () {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          console.log('currentGeoLoc',position)
          window.currentGeoLoc = position;
        }, 
        function() {
          console.log('get geoError currentGeoLoc unchanged')
        }
      );
    } else {
      console.log('GPS를 지원하지 않습니다')
    }
  }

getCurrentLocation();


// Import Routes
import routes from './routes.js';
// Import Store
import store from './store.js';

// Import main app component
import App from '../app.f7';


var app = new Framework7({
  name: 'My App', // App name
  theme: 'auto', // Automatic theme detection


  el: '#app', // App root element
  component: App, // App main component
  // App store
  store: store,
  // App routes
  routes: routes,

  // Register service worker (only on production build)
  serviceWorker: process.env.NODE_ENV ==='production' ? {
    path: '/service-worker.js',
  } : {},
});