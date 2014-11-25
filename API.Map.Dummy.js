/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */
//TODO: poner las constantes a mano
(function () {
	
	"use strict";
	
	var Map = function Map(){
								
		var _allowedEventsData = {
			"map": {
				"click": {
					"asIs": ["clicksource", "latitude", "longitude", "subtitle", "title"],
					"id": ["annotation"]
				}, 
				"complete": {
					"asIs": [],
					"id": []
				},
				"longclick": {
					"asIs": ["latitude", "longitude"],
					"id": []
				},
				"regionchanged": {
					"asIs": ["animated", "latitude", "latitudeDelta", "longitude", "longitudeDelta"],
					"id": []
				},
				"postlayout": {
					"asIs": [],
					"id": []
				}
			},
			"polygon": {
				"click": {
					"asIs": ["latitude", "longitude", "type"],
					"id": ["source"]
				}
			},
			"annotation": {
				"click": {
					"asIs": ["latitude", "longitude", "type", "clicksource"],
					"id": ["source"]
				}
			}
		};
		
		/*
		 * CONSTANTS
		 */
		this.PRIORITY_BALANCED_POWER_ACCURACY = 102;
		this.PRIORITY_HIGH_ACCURACY = 100;
		this.PRIORITY_LOW_POWER = 104;
		this.PRIORITY_NO_POWER = 105;
		this.PRIORITY_UNDEFINED = -1;
		
		this.NORMAL_TYPE = 1;
		this.TERRAIN_TYPE = 3;
		this.SATELLITE_TYPE = 2;
		this.HYBRID_TYPE = 4;
		
		this.ANNOTATION_AZURE = 210.0;
		this.ANNOTATION_BLUE = 240.0;
		this.ANNOTATION_CYAN = 180.0;
		this.ANNOTATION_GREEN = 120.0;
		this.ANNOTATION_MAGENTA = 300.0;
		this.ANNOTATION_ORANGE = 30.0;
		this.ANNOTATION_RED = 0.0;
		this.ANNOTATION_ROSE = 330.0;
		this.ANNOTATION_VIOLET = 270.0;
		this.ANNOTATION_YELLOW = 60.0;
		
		this.LAYER_TYPE_WMS_1_1_1 = 1;
		this.LAYER_TYPE_WMS_1_3_0 = 2;
		this.FORMAT_PNG = 1;
		this.FORMAT_JPEG = 2;
		
		/**
		 * Check if there is support for the map.
		 * @param {callback} Function that receives a boolean. True if the map can be used.	
		 */
		this.isMapAvailable = function(callback){
			_genericMethodHandler.call(this, callback, 'API.SW.Map.isMapAvailable', [], null);
		};
		
		/**
		 * Creates a new map view.
		 * @param {Object} options. See http://docs.appcelerator.com/titanium/3.0/#!/api/Modules.Map.View
		 * @param {callback} Function that receives a MapView object. 	
		 */
		this.createMap = function(options, callback){
			var handleCreateMap = function(callback, mapId){
				callback(new MapView(mapId));
			}.bind(null, callback);
			_genericMethodHandler.call(this, handleCreateMap, 'API.SW.Map.createMap', [], options);
		};
		
		
		/**
		 * Creates an Annotation. 
		 * @param {Object} Options. See http://docs.appcelerator.com/titanium/3.0/#!/api/Modules.Map.Annotation
		 * @param {callback} Function that receives a Annotation object. 	
		 */
		this.createAnnotation = function(options, callback){
			var handleCreateAnnotation = function(callback, annotationId){
				if(annotationId != null)
					callback(new Annotation(annotationId));
			}.bind(null, callback);
			_genericMethodHandler.call(this, handleCreateAnnotation, 'API.SW.Map.createAnnotation', [], options);
		};
		
		
		/**
		 * Creates a Route. 
		 * @param {Object} Options. See http://docs.appcelerator.com/titanium/3.0/#!/api/Modules.Map.Route
		 * @param {callback} Function that receives a Route object. 	
		 */
		this.createRoute = function(options, callback){
			var handleCreateRoute = function(callback, routeId){
				if(routeId != null)
					callback(new Route(routeId));
			}.bind(null, callback);
			_genericMethodHandler.call(this, handleCreateRoute, 'API.SW.Map.createRoute', [], options);
		};
		
		
		/**
		 * Creates a Layer.
		 * @param {options} 
		 * 		- baseUrl: String with the url of the service
		 * 		- type: Type of service (Map.LAYER_TYPE_WMS_1_1_1 | Map.LAYER_TYPE_WMS_1_3_0)
		 * 		- name: String with the name of the layer.
		 * 		- srs: String with the srs of the layer.
		 * 		- visible: Boolean 
		 * 		- zIndex: Number ZIndex of the layer.
		 * 		- opacity: Number Percentage of opacity [0 - 100].
		 * 		- format: Tipe of image of the tiles (Map.FORMAT_PNG | Map.FORMAT_JPEG)
		 * @param {callback} Function that receives a Layer object. 
		 */
		this.createLayer = function(options, callback){
			var handleCreateLayer = function(callback, layerId){
				if(layerId != null)
					callback(new Layer(layerId));
			}.bind(null, callback);
			_genericMethodHandler.call(this, handleCreateLayer, 'API.SW.Map.createLayer', [], options);
		};
		
		
		/**
		 * Creates a Polygon. 
		 * @param {options} 
		 * 		- points: Array of points ({latitude: Number, longitude: Number})
		 * 		- holePoints: Array with holes. A hole is an array of points.
		 * 		- fillColor: Color
		 * 		- strokeColor: Color
		 * 		- strokeWidth: Number
		 * 		- annotation: Object (same properties of the createAnnotation method)
		 * @param {callback} Function that receives a Polygon object. 		
		 */
		this.createPolygon = function(options, callback){
			var handleCreatePolygon = function(callback, polygonId){
				if(polygonId != null)
					callback(new Polygon(polygonId));
			}.bind(null, callback);
			_genericMethodHandler.call(this, handleCreatePolygon, 'API.SW.Map.createPolygon', [], options);
		};
		
		
		/**
		 * Parses a given KML string  and returns an object with the polygons and routes of the file.
		 * @param {String} Data. The KML string to parse
		 * @param {callback} Called when the object with the results is ready and has it as argument.
		 * @return {Object}. Object with the format {polygons: array, routes: array}. Null if there was an exception while parsing the KML string .
		 */
		this.getShapesFromKml = function(data, callback){
			var handleGetShapes = function(callback, shapes){
				callback(shapes);
			}.bind(null, callback);
			_genericMethodHandler.call(this, handleGetShapes, 'API.SW.Map.getShapesFromKml', [data], null);
		};
		
		
		/**
		 * Parses a given WKT string  and returns an object with the polygons and routes.
		 * @param {data} The WKT string to parse
		 * @param {callback} Called when the object with the results is ready and has it as argument.
		 * @return {Object}. Object with the format {polygons: array, routes: array}. Null if there was an exception while parsing the WKT string .
		 */
		this.getShapesFromWkt = function(data, callback){
			var handleGetShapes = function(callback, shapes){
				callback(shapes);
			}.bind(null, callback);
			_genericMethodHandler.call(this, handleGetShapes, 'API.SW.Map.getShapesFromWkt', [data], null);
		};
		
		
		/**
		 * Parses a given GeoJson string  and returns an object with the polygons and routes of the file.
		 * @param {data} The GeoJson string to parse
		 * @param {callback} Called when the object with the results is ready and has it as argument.
		 * @return {Object}. Object with the format {polygons: array, routes: array}. Null if there was an exception while parsing the GeoJson string .
		 */
		this.getShapesFromGeoJson = function(data, callback){
			var handleGetShapes = function(callback, shapes){
				callback(shapes);
			}.bind(null, callback);
			_genericMethodHandler.call(this, handleGetShapes, 'API.SW.Map.getShapesFromGeoJson', [data], null);
		};
		
		
		
		var voidCallback = function(){ /*This callback is void*/};
		var events = {};
		
		//Create the event listener
		Ti.App.addEventListener("API_MAP_EVENT", function(eventInfo){
			
			var event = eventInfo.event;
			var elementId = eventInfo.elementId;
			var data = eventInfo.data;
			var elementType = eventInfo.elementType;
			
			if(events[elementType] != null && events[elementType][event] != null && events[elementType][event][elementId] != null){
				for(var index in events[elementType][event][elementId]){
					events[elementType][event][elementId][index](_filterEventData(elementType, event, data));
				}
			}
			
		});
		
		var _filterEventData = function(elementType, event, data){
			var newData = {};
			if(_allowedEventsData[elementType] != null && _allowedEventsData[elementType][event] != null){
				var asIs = _allowedEventsData[elementType][event]["asIs"];
				var id = _allowedEventsData[elementType][event]["id"];
				if(asIs != null){
					for(var x = 0; x < asIs.length; x++){
						var propertyType = asIs[x];
						newData[propertyType] = data[propertyType];
					}
				}
				if(id != null){
					for(var x = 0; x < id.length; x++){
						var propertyType = id[x];
						if(data[propertyType] != null){
							newData[propertyType] = _convertToElement(data[propertyType], elementType);
						}
							
					}
				}
			}
			
			return newData;
			
		};
		
		var _registerEventHandler = function(event, callback){
			
			if(event != null && event != "" && this.type != null && this.type != ""){
				
				var alreadyExists = false;
				if(events[this.type] != null && events[this.type][event] != null && events[this.type][event][this.id] != null)
					alreadyExists = true;
				else{
					if(events[this.type] == null)
						events[this.type] = {};
					if(events[this.type][event] == null)
						events[this.type][event] = {};
					events[this.type][event][this.id] = [];
				}
				
				events[this.type][event][this.id].push(callback);
				
				if(!alreadyExists){
					Ti.App.fireEvent("API_MAP_EDIT_EVENT", { action: "add", event: event, elementId: this.id, elementType: this.type });
				}
			}
			
		};
		
		var _removeEventHandler = function(event, callback){
			
			if(event != null && event != "" && this.type != null && this.type != "" && events[this.type] != null && events[this.type][event] != null && events[this.type][event][this.id] != null){
				
				var index = events[this.type][event][this.id].indexOf(callback);
				if(index != -1){
					events[this.type][event][this.id].splice(index, 1);
					Ti.App.fireEvent("API_MAP_EDIT_EVENT", {action: "remove", event: event, elementId: this.id, elementType: this.type });
				}
					
			}
			
		};
		
		var MapView = function MapView(id){
		
			this.id = id;
			this.type = "map";
			
			
			/**
			 * Adds the map view to a view.
			 * @param {String} The id of the view.
			 * @param {Object} Options. Top, left, right, bottom, height, width.
			 */
			this.addBound = function(options){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.addBound', [this.id, id], options);
			};
			
			
			/**
			 * Sets the bounds of the map view.
			 * @param {String} The id of the view.
			 * @param {Object} Options. Top, left, right, bottom, height, width.
			 */
			this.setBound = function(viewId, options){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.setBound', [this.id, viewId], options);
			};
			
			
			/**
		     * Removes the map from the view that contains it
		     */
			this.removeBound = function(){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.removeBound', [this.id], null);
			};
			
			
			/**
		  	 * Zooms in or out by specifying a relative zoom level. 
		  	 * @param {Number} delta. A positive value increases the current zoom level and a negative value decreases the zoom level. 
		  	 */
			this.zoom = function(delta){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.getShapesFromGeoJson', [this.id, delta]);
			};
			
			
			/**
			 * Set how the map should follow the location of the device.
			 * @param {Boolean} followLocation. True if the map camera must follow the location of the device. 
			 * @param {Boolean} followBearing. True if the map camera must follow the bearing of the device.
			 * @param {Object} options:
			 * 		- {interval} LocationRequest desired interval in milliseconds. Must be > 0; otherwise, default value is 1000.
			 * 		- {priority} LocationRequest priority (PRIORITY_BALANCED_POWER_ACCURACY, PRIORITY_HIGH_ACCURACY, PRIORITY_LOW_POWER, PRIORITY_NO_POWER, PRIORITY_UNDEFINED).
			 */
			this.followLocation = function(followLocation, followBearing, options){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.followLocation', [this.id, followLocation, followBearing], options);
			};
			
			
			/**
		     * Gets the value of a property of the map.
		     * @param {String} propertyName. String with the name of the property or array with a list of properties.
		     * @param {callback} Callback function to invoke with the value of the property, or a hashmap of properties and values.
		     */
			this.getProperty = function(propertyName, callback){
				
				var _callback = function(_res){
					
					var _processProperty = function(_propValue){
						var _newValue = null;
						if(propertyName === "annotations")
							return _convertToElementsArray(_propValue, 'annotation');
						else if(propertyName === "polygons")
							return _convertToElementsArray(_propValue, 'polygon');
						else if(propertyName === "routes")
							return _convertToElementsArray(_propValue, 'route');
						else if(propertyName === "layers")
							return _convertToElementsArray(_propValue, 'layer');
						else
							return _propValue;
					};
					
					if(propertyName instanceof Array){
        		
		        		var _newRes = {};
		        		
		        		for(var _propName in _res){
		        			var val = _processProperty(_res[_propName]);
		        			if(typeof(val) !== 'undefined'){
		        				_newRes[_propName] = val;
		        			}
		        		}
		        		
		        		callback(_newRes);
		        		
		        	} else {
						callback(_processProperty(_res));
					}
						
				};
				
				_genericMethodHandler.call(this, _callback, 'API.SW.Map.getMapProperty', [this.id, propertyName]);
			};
			
			/**
		     * Gets all the properties of the map.
		     * @param {callback} Callback function to invoke with the hashmap of properties and values.
		     */
			this.getAllProperties = function(callback){
				this.getProperty(["userLocation", "userLocationButton", "mapType", "region", "animate", "traffic", "enableZoomControls", 
									"rect", "region", "zoom", "annotations", "polygons", "layers", "routes"], callback);
			};
			
			
			/**
		     * Sets the value of a property of the map.
		     * @param {String} propertyName. String with the name of the property.
		     * @param {Object} propertyValue. The value to be set for the property.
		     */
			this.setProperty = function(propertyName, propertyValue){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.setMapProperty', [this.id, propertyName, propertyValue]);
			};
			
			
			/**
			 * Add an annotation to the map.
			 * @param {Object} annotation. The Annotation object.
			 */
			this.addAnnotation = function(annotation){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.addAnnotation', [this.id, annotation.id]);
			};
			
			
			/**
			 * Selects an annotation in the map.
			 * @param {Object} annotation. The Annotation object.
			 */
			this.selectAnnotation = function(annotation){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.selectAnnotation', [this.id, annotation.id]);
			};
			
			
			/**
			 * Deselects an annotation in the map.
			 * @param {Object} annotation. The Annotation object.
			 */
			this.deselectAnnotation = function(annotation){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.deselectAnnotation', [this.id, annotation.id]);
			};
			
			
			/**
			 * Removes an annotation from the map.
			 * @param {Object} annotation. The Annotation object.
			 */
			this.removeAnnotation = function(annotation){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.removeAnnotation', [this.id, annotation.id]);
			};
			
			
			/**
			 * Removes multiple annotations from the map.
			 * @param {Array} annotations. Array of Annotation objects.
			 */
			this.removeAnnotations = function(annotations){
				var ids = [];
				for(var i in annotations){
					if(annotations[i].id != null)
						ids.push(annotations[i].id);
				}
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.removeAnnotations', [this.id, ids]);
			};
			
			
			/**
			 * Removes all the annotations from a map.
			 */
			this.removeAllAnnotations = function(){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.removeAllAnnotations', [this.id]);
			};
			
			
			 /**
			 * Add a route to the map.
			 * @param {Object} route. The Route object to add.
			 */
			this.addRoute = function(route){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.addRoute', [this.id, route.id]);
			};
			
			
			/**
			 * Removes a route from the map.
			 * @param {Object} route. The Route object to add.
			 */
			this.removeRoute = function(route){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.removeRoute', [this.id, route.id]);
			};
			
			
			/**
			 * Removes multiple routes from the map.
			 * @param {Array} routes. Array of Routes objects.
			 */
			this.removeRoutes = function(routes){
				var ids = [];
				for(var i in routes){
					if(routes[i].id != null)
						ids.push(routes[i].id);
				}
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.removeRoutes', [this.id, ids]);
			};
			
			
			/**
			 * Removes all the routes from the map.
			 */
			this.removeAllRoutes = function(){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.removeAllRoutes', [this.id]);
			};
			
			
			/**
			 * Add a polygon to the map.
			 * @param {Object} polygon. The Polygon object.
			 */
			this.addPolygon = function(polygon){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.addPolygon', [this.id, polygon.id]);
			};
			
			
			/**
			 * Removes a polygon from the map.
			 * @param {Object} polygon. The Polygon object.
			 */
			this.removePolygon = function(polygon){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.removePolygon', [this.id, polygon.id]);
			};
			
			
			/**
			 * Removes multiple polygons from the map.
			 * @param {Array} polygons. Array of Polygon objects.
			 */
			this.removePolygons = function(polygons){
				var ids = [];
				for(var i in polygons){
					if(polygons[i].id != null)
						ids.push(polygons[i].id);
				}
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.removePolygons', [this.id, ids]);
			};
			
			
			/**
			 * Removes all the polygons from the map.
			 */
			this.removeAllPolygons = function(){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.removeAllPolygons', [this.id]);
			};
			
			
			/**
			 * Add a layer to the map.
			 * @param {Object} layer. The Layer object.
			 */
			this.addLayer = function(layer){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.addLayer', [this.id, layer.id]);
			};
			
			
			/**
			 * Removes a layer from the map.
			 * @param {Object} layer. The Layer object.
			 */
			this.removeLayer = function(layer){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.removeLayer', [this.id, layer.id]);
			};
			
			
			/**
			 * Removes multiple layers from the map.
			 * @param {Array} layers. Array of Layer objects.
			 */
			this.removeLayers = function(layers){
				var ids = [];
				for(var i in layers){
					if(layers[i].id != null)
						ids.push(layers[i].id);
				}
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.removeLayers', [this.id, ids]);
			};
			
			
			/**
			 * Removes all the layers from the map.
			 */
			this.removeAllLayers = function(){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.removeAllLayers', [this.id]);
			};
			
			/**
		     * Gets the base layer 
		     * @param {callback} Callback function to invoke the base layer (can be a layer id (String) or a google layer id (Integer)).
		     */
			this.getBaseLayer = function(callback){
				_genericMethodHandler.call(this, callback, 'API.SW.Map.getBaseLayer', [this.id]);
			};
			
			
			/**
		     * Set the base layer of the map.
		 	 * @param {Object} layer  A layer object or the constant of a Google Layer.
		     */
			this.setBaseLayer = function(layer){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.setBaseLayer', [this.id, (layer.id != null ? layer.id : layer)]);
			};
			
			
			/**
			 * Adds the specified callback as an event listener for the named event.
			 * @param {event} Name of the event. Allowed events: ["click", "complete", "longclick", "regionchanged", "postlayout"]
			 * @param {callback} Callback function to invoke when the event is fired.
			 */
			this.addEventListener = function(event, callback){
				if(_allowedEventsData[this.type][event] != null)
					_registerEventHandler.call(this, event, callback);
			};
			
			
			/**
			 * Removes the specified callback as an event listener for the named event.
			 * Multiple listeners can be registered for the same event, so the callback parameter is used to determine which listener to remove. 
			 * @param {event} Name of the event. Allowed events: ["click", "complete", "longclick", "regionchanged", "postlayout"]
			 * @param {callback} Callback function to invoke when the event is fired.
			 */
			this.removeEventListener = function(event, callback){
				if(_allowedEventsData[this.type][event] != null)
					_removeEventHandler.call(this, event, callback);
			};
				
			
		};
		
		var Annotation = function Annotation(id){
			this.id = id;
			this.type = "annotation";
			
			
			/**
		     * Gets the value of a property of the annotation.
		     * @param {String} propertyName. String with the name of the property.
		     * @param {callback} Callback function to invoke with the value of the property, or a hashmap of properties and values.
		     */
			this.getProperty = function(propertyName, callback){
				_genericMethodHandler.call(this, callback, 'API.SW.Map.getAnnotationProperty', [this.id, propertyName]);
			};
			
			
			/**
		     * Gets all the properties of the annotation.
		     * @param {callback} Callback function to invoke with the hashmap of properties and values.
		     */
			this.getAllProperties = function(callback){
				this.getProperty(["id", "subtitle", "subtitleid", "title", "titleid", "latitude", "longitude", "draggable", 
									"image", "pincolor", "customView", "leftButton", "leftView", "rightButton", "rightView", 
									"showInfoWindow", "visible"], callback);
			};
			
			
			/**
		     * Sets the value of a property of the annotation.
		     * @param {String} propertyName. String with the name of the property.
		     * @param {propertyValue} The value to be set for the property.
		     */
			this.setProperty = function(propertyName, propertyValue){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.setAnnotationProperty', [this.id, propertyName, propertyValue]);
			};
			
			/**
			 * Adds the specified callback as an event listener for the named event.
			 * @param {event} Name of the event.
			 * @param {callback} Callback function to invoke when the event is fired.
			 */
			this.addEventListener = function(event, callback){
				if(_allowedEventsData[this.type][event] != null)
					_registerEventHandler.call(this, event, callback);
			};
			
			
			/**
			 * Removes the specified callback as an event listener for the named event.
			 * Multiple listeners can be registered for the same event, so the callback parameter is used to determine which listener to remove. 
			 * @param {event} Name of the event.
			 * @param {callback} Callback function to invoke when the event is fired.
			 */
			this.removeEventListener = function(event, callback){
				if(_allowedEventsData[this.type][event] != null)
					_removeEventHandler.call(this, event, callback);
			};
		};
		
		var Polygon = function Polygon(id){
			this.id = id;
			this.type = "polygon";
			
			/**
		     * Gets the value of a property of the polygon.
		     * @param {String} propertyName. String with the name of the property.
		     * @param {callback} Callback function to invoke with the value of the property, or a hashmap of properties and values.
		     */
			this.getProperty = function(propertyName, callback){
				_genericMethodHandler.call(this, callback, 'API.SW.Map.getPolygonProperty', [this.id, propertyName]);
			};
			
			
			/**
		     * Gets all the properties of the polygon.
		     * @param {callback} Callback function to invoke with the hashmap of properties and values.
		     */
			this.getAllProperties = function(callback){
				this.getProperty(["id", "points", "holePoints", "strokeWidth", "strokeColor", "fillColor", "annotation", "zIndex"], callback);
			};
			
			
			/**
		     * Sets the value of a property of the polygon.
		     * @param {String} propertyName. String with the name of the property.
		     * @param {Object} propertyValue. The value to be set for the property.
		     */
			this.setProperty = function(propertyName, propertyValue){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.setPolygonProperty', [this.id, propertyName, propertyValue]);
			};
			
			
			/**
			 * Adds the specified callback as an event listener for the named event.
			 * @param {event} Name of the event.
			 * @param {callback} Callback function to invoke when the event is fired.
			 */
			this.addEventListener = function(event, callback){
				if(_allowedEventsData[this.type][event] != null)
					_registerEventHandler.call(this, event, callback);
			};
			
			
			/**
			 * Removes the specified callback as an event listener for the named event.
			 * Multiple listeners can be registered for the same event, so the callback parameter is used to determine which listener to remove. 
			 * @param {event} Name of the event.
			 * @param {callback} Callback function to invoke when the event is fired.
			 */
			this.removeEventListener = function(event, callback){
				if(_allowedEventsData[this.type][event] != null)
					_removeEventHandler.call(this, event, callback);
			};
		};
		
		
		var Route = function Route(id){
			this.id = id;
			this.type = "route";
			
			
			/**
		     * Gets the value of a property of the route.
		     * @param {String} propertyName. String with the name of the property.
		     * @param {callback} Callback function to invoke with the value of the property, or a hashmap of properties and values.
		     */		
			this.getProperty = function(propertyName, callback){
				_genericMethodHandler.call(this, callback, 'API.SW.Map.getRouteProperty', [this.id, propertyName]);
			};
			
			
			/**
		     * Gets all the properties of the route.
		     * @param {callback} Callback function to invoke with the hashmap of properties and values.
		     */
			this.getAllProperties = function(callback){
				this.getProperty(["id", "points", "width", "color"], callback);
			};
			
			
			/**
		     * Sets the value of a property of the route.
		     * @param {String}propertyName.  String with the name of the property.
		     * @param {Object} propertyValue. The value to be set for the property.
		     */
			this.setProperty = function(propertyName, propertyValue){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.setRouteProperty', [this.id, propertyName, propertyValue]);
			};
			
		};
		
		var Layer = function Layer(id){
			this.id = id;
			this.type = "layer";
			
			
			/**
		     * Gets the value of a property of the layer.
		     * @param {String} propertyName. String with the name of the property.
		     * @param {callback} Callback function to invoke with the value of the property, or a hashmap of properties and values.
		     */
			this.getProperty = function(propertyName, callback){
				_genericMethodHandler.call(this, callback, 'API.SW.Map.getLayerProperty', [this.id, propertyName]);
			};
			
			
			/**
		     * Gets all the properties of the layer.
		     * @param {callback} Callback function to invoke with the hashmap of properties and values.
		     */
			this.getAllProperties = function(callback){
				this.getProperty(["id", "baseUrl", "type", "name", "srs", "visible", "zIndex", "opacity", "format", "style", "tyleMatrixSet"], callback);
			};
			
			
			/**
		     * Sets the value of a property of the layer.
		     * @param {String} propertyName. String with the name of the property.
		     * @param {Object} propertyValue. The value to be set for the property.
		     */
			this.setProperty = function(propertyName, propertyValue){
				_genericMethodHandler.call(this, voidCallback, 'API.SW.Map.setLayerProperty', [this.id, propertyName, propertyValue]);
			};
			
		};
		
		
		/**
		 * Converts an array of ids to an array of elements (maps, polygons, etc) with those ids.
		 * @param {Object} _idsArray
		 * @param {Object} _type: annotation | polygon | route | map
		 */
		var _convertToElementsArray = function _convertToElementsArray(_idsArray, _type){
			var _resArray = [];
			
			for(var x = 0; x < _idsArray.length; x++){
				var _id = _idsArray[x];
				if(_id != null){
					_resArray.push(_convertToElement(_id, _type));
				}
			}
			
			return _resArray;
		};
		
		/**
		 * Converts an id to an element (maps, polygons, etc) with that id.
		 * @param {Object} _idsArray
		 * @param {Object} _type: annotation | polygon | route | map
		 */
		var _convertToElement = function _convertToElement(_id, _type){
			if(_type === "annotation")
				return new Annotation(_id);
			else if(_type === "polygon")
				return new Polygon(_id);
			else if(_type === "route")
				return new Route(_id);
			else if(_type === "layer")
				return new Layer(_id);
			else if(_type === "map")
				return new MapView(_id);
		};
		
	}; //End of Map object
	

	return new Map();
}());