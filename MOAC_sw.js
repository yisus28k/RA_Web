importScripts('js/MOAC_sw-utils.js');
const STATIC_CACHE = 'static-v3';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/TOSK_app.js',
    'js/MOAC_sw-utils.js'
];


const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', e => { //instalar el service worker
    const cacheStatic = caches.open(STATIC_CACHE).then(cache => //guardar en cache los archivos estaticos
        cache.addAll(APP_SHELL)); //agregar al cache los archivos estaticos
    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => //guardar en cache los archivos estaticos
        cache.addAll(APP_SHELL_INMUTABLE)); //agregar al cache los archivos estaticos

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable])); //esperar a que se guarden los archivos en cache

});

self.addEventListener('activate', e => { //Borra las caches viejas  
    const respuesta = caches.keys().then(keys => {// alistar las caches 
        keys.forEach(key => {
            if (key != STATIC_CACHE && key.includes('static')) { // si la cache es diferente a static_cache esta en uno 
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(respuesta);
});

self.addEventListener('fetch', e => {
    const respuesta = caches.match(e.request).then(resp => { //estrategia cache onli 
        if (resp) {
            return resp;
        } else {
            return fetch(e.request).then(newResp => {
                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newResp);
            });
            //console.log(e.request.url);//permite responder a la solicitud con lo guardado en el cache
        }
    });
    e.respondWith(respuesta);
});



