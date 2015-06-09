
  var map;
    function init(){
  // initiate leaflet map
  map = new L.Map('map', { 
    center: [35,-35],
    zoom: 3
  });

  
  var osmLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

maxZoom: 18
}).addTo(map);

var ggl = new L.Google();
var ggl2 = new L.Google('TERRAIN');


var layerUrl = 'https://kbarrios05.cartodb.com/api/v2/viz/e0f6f98c-f5d4-11e4-a2d0-0e4fddd5de28/viz.json';

    //Añadimos un control de escala
    L.control.scale().addTo(map);
    
    //control de zoom
    var control = L.control.zoomBox({
    modal: true,  // If false (default), it deactivates after each use.  
                  // If true, zoomBox control stays active until you click on the control to deactivate.
    // position: "topleft",                  
    // className: "customClass"  // Class to use to provide icon instead of Font Awesome
});
map.addControl(control);


 var leaflet = L.tileLayer('https://dnv9my2eseobd.cloudfront.net/v3/cartodb.map-4xtxp73f/{z}/{x}/{y}.png', {
    
  });

  
  var sublayers = [];

  var cartoLayer = cartodb.createLayer(map, layerUrl);
  cartoLayer.on('done', function(layer) {
    // change the query for the first layer
    var subLayerOptions = {
      sql: "SELECT * FROM ufo3",
      cartocss: "#ufo3{ marker-file: url(https://s3.amazonaws.com/com.cartodb.users-assets.production/production/kbarrios05/assets/20150519095633ufo.png); marker-fill-opacity: 0.5; marker-line-color: #000000;marker-line-width: 1; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-width: 20.5; marker-fill: #A53ED5; marker-allow-overlap: true;}"
  
  }

    var sublayer = layer.getSubLayer(0);

    sublayer.set(subLayerOptions);

    sublayers.push(sublayer);
  }).on('error', function() {
    //log the error
  });

  //we define the queries that will be performed when we click on the buttons, by modifying the SQL of our layer
  var LayerActions = {
    all: function(){
      sublayers[0].setSQL("SELECT * FROM ufo3");
      return true;
    },
    menor: function(){
      sublayers[0].setSQL("SELECT * FROM ufo3 WHERE duration_them < 299 ORDER BY  duration_them DESC");
      return true;
    },
  
   hora: function(){
      sublayers[0].setSQL("SELECT * FROM ufo3  WHERE duration_them > 3600 ORDER BY  duration_them DESC");
      return true;
    },
  
  min45: function(){
      sublayers[0].setSQL("SELECT * FROM ufo3 WHERE duration_them BETWEEN 2700 AND 3599");
      return true;
    },
  
  min30: function(){
      sublayers[0].setSQL("SELECT * FROM ufo3 WHERE duration_them BETWEEN 1800 AND 2699");
      return true;
    },
  
  min15: function(){
      sublayers[0].setSQL("SELECT * FROM ufo3 WHERE duration_them BETWEEN 900 AND 1799");
      return true;
    },
  
  min5: function(){
      sublayers[0].setSQL("SELECT * FROM ufo3 WHERE duration_them BETWEEN 300 AND 899");
      return true;
    },
  
  
    mayor: function() {
      sublayers[0].set({
        sql: "SELECT * FROM ufo3  WHERE duration_them < 1000 ORDER BY  duration_them DESC",
       




     //as it is said, you can also add some CartoCSS code to make your points look like you want for the different queries
       // cartocss: "#ne_10m_populated_places_simple{ marker-fill: black; }"
      });
      return true;
    }
  };

  $('.button').click(function() {
    $('.button').removeClass('selected');
    $(this).addClass('selected');
    //this gets the id of the different buttons and calls to LayerActions which responds according to the selected id
    LayerActions[$(this).attr('id')]();
  });
  
  
  var baseMaps = {
    "OpenStreetMaps": osmLayer,
    "Mapbox": leaflet,
  "Satélite": ggl,
  "Tierra": ggl2
  };
  
  var overlayMaps = {
    "CartoDB": sublayers   
};
  
  
L.control.layers(baseMaps).addTo(map);
osmLayer.bringToBack();
leaflet.setZIndex(-1);
cartoLayer.addTo(map);



}