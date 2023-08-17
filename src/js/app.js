import $ from 'dom7';
import Framework7, {Dom7, getDevice, createStore, utils, getSupport} from 'framework7/bundle';

var $$ = Dom7;
// Import F7 Styles
import 'framework7/css/bundle';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';

window.currentGeoLoc = undefined;
// window.currentGeoLoc = window.currentGeoLoc || {};
// window.currentGeoLoc = { //GeolocationPosition
//   coords: { // GeolocationCoordinates //default : 카카오 제주
//     latitude: 33.450701, 
//     longitude: 126.570667
//   }
// };
//console.log('default currentGeoLoc',window.currentGeoLoc)


// Import Routes
import routes from './routes.js';
// Import Store
import store from './store.js';

// Import main app component
import App from '../app.f7';

var ro = new ResizeObserver(entries => {
  for (let entry of entries) {
    const cr = entry.contentRect;     // this
    console.log('Element:', entry.target);
    console.log(`Element size: ${cr.width}px x ${cr.height}px`);
    console.log(`Element padding: ${cr.top}px ; ${cr.left}px`);
  }
});

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
