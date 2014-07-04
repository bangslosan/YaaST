/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.2GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

"use strict";


var Cache = function Cache(size){
	
	this._data = {};
	this._maxSize = size;
	this._nextElement = 0;
	
	this.get = function(key){

		if(this._data[key] != null)
			return this._data[key].value;

	};
	
	this.add = function(key, value){
		
		//If is full, remove the oldest
		if(this._nextElement >= this._maxSize){
			var toBeRemoved = this._nextElement - this._maxSize;
			for(var key in this._data){
				if(this._data[key].order == toBeRemoved){
					delete this._data[key];
					break;
				}
			}

			this._nextElement++;
		}
			
		this._data[key] = {
			value: value,
			order: this._nextElement
		};
	};
	
};
	


var Map = (function() {

    var _self = {
        Map: require('ti.map')
    }, mapsId = 0, mapsList = {}, cache = new Cache(20);
    
    var freeElements = {
    	"polygons": {},
    	"layers": {},
    	"routes": {},
    	"annotations": {}
    };
    
    //Start event listener
    var handlers = {};
    var eventHandler = function(event, elementId, e){
    	Ti.App.fireEvent("API_MAP_EVENT", { event: event, elementId: elementId, data: e });
    };
    Ti.App.addEventListener("API_MAP_EDIT_EVENT", function(data){
    	
    	//TODO: check events?
    	
    	var element = getElement(data.elementType, data.elementId);
    	if(element == null)
    		return;
    		
    	if(data.action === "add"){
    		if(handlers[data.elementId] == null){
    			handlers[data.elementId] = {
    				count: 1,
    				handler: eventHandler.bind(null, data.event, data.elementId)
    			};
    			element.addEventListener(data.event, handlers[data.elementId].handler);
    		}else
    			handlers[data.elementId].count++;
    	}else if(data.action === "remove"){
    		
    		if(handlers[data.elementId] != null){
    			if(--handlers[data.elementId].count <= 0){
    				element.removeEventListener(data.event, handlers[data.elementId].handler);
    				handlers[data.elementId].handler = null;
    				delete handlers[data.elementId];
    			}
    		}
    	}
    });


	/*
	 * ------------------------ PRIVATE UTILS -------------------------------
	 */

	var getSetProperty = function(elementType, elementId, propertyName, propertyValue){
		
		var element = getElement(elementType, elementId);
		
		// Check if the element was found
		if(element != null){
			
			//Capitalize the first letter
			propertyName = propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
			
			if(propertyValue === undefined){ //Getter
			
				// Check if the getter method exists
				if(element["get"+ propertyName] != null){
					
					//Call the getter
					return element["get"+ propertyName]();
					
				} else {
					//TODO: Error Getter method not found
					return;
				}
				
			} else { //Setter
				
				// Check if the getter method exists
				if(element["set"+ propertyName] != null){

					//Call the setter
					element["set"+ propertyName](propertyValue);
					
				} else {
					//TODO: Error Getter method not found | Throw error?
					return;
				}
				
			}
			
		} else {
			//TODO: Error Unknown Annotation Id on Map Id
			return;
		}
		
	};
	
	var getElement = function(elementType, elementId){
		
		//If it is a map, it does not need search, just return it
		if(elementType === "map")
			return mapsList[elementId];
		
		
		var element = null;
		
		//First search in the cache
		element = cache.get(elementId);
		
		//If found, return it;  otherwise, find it and add it to the cache
		if(element != null)
			return element;
		
		// Search in the maps
		for(var mapId in mapsList){
			if(elementType === "annotation"){
				element = mapsList[mapId].getAnnotations()[elementId];
			}else if(elementType === "layer"){
				element = mapsList[mapId].getLayers()[elementId];
			}else if(elementType === "polygon"){
				element = mapsList[mapId].getPolygons()[elementId];
			}else if(elementType === "route"){
				element = mapsList[mapId].getRoutes()[elementId];
			}else{
				//TODO: Error Unknown element type
				return;
			}
			
			if(element != null)
				break;
		}
		
		// If not found, get it from the not added elements
		if(element == null){
			if(elementType === "annotation"){
				element = freeElements["annotations"][elementId];
			}else if(elementType === "layer"){
				element = freeElements["layers"][elementId];
			}else if(elementType === "polygon"){
				element = freeElements["polygons"][elementId];
			}else if(elementType === "route"){
				element = freeElements["routes"][elementId];
			}
		}
		
		// If not found and is an annotation, search between the polygon annotations
		if(element == null && elementType === "annotation"){
			element = getAnnotationFromPolygons(elementId);
		}
		
		// Add it to the cache
		if(element != null)
			cache.add(elementId, element);
			
		return element;
		
		
	};
	
	var getProperty = function(elementType, elementId, propertyName){
		getSetProperty(elementType, elementId, propertyName);
	};
	
	var setProperty = function(elementType, elementId, propertyName, propertyValue){
		getSetProperty(elementType, elementId, propertyName, propertyValue);
	};
	
	
	var getAnnotationFromPolygons = function(annoId){
		
		var annotation = null;
		
		for(var mapId in mapsList){
			
			//Search now between the polygon annotations
	    	var polygons = mapsList[mapId].getPolygons();
	    	for(var polyId in polygons){
	    		var poly = polygons[polyId];
	    		if(poly.annotation != null && poly.annotation.getId() == annoId){
	    			return poly.annotation;
	    		}
	    	}
	    }
    	
    	return annotation;
	};
	
	var handleParserResult = function(obj){
		
		if(obj == null)
			return obj;
		
		var result = { "polygons" : [], "routes":  [] };
		
		for(var x in obj.polygons){
			var id = obj.polygons[x].getId();
			freeElements["polygons"][id] = obj.polygons[x];
			result.polygons.push(id);
		}
		for(var x in obj.routes){
			var id = obj.routes[x].getId();
			freeElements["routes"][id] = obj.routes[x];
			result.routes.push(id);
		}
		
		return result;
			
	};
	

	/*
	 * ------------------------ MAP -------------------------------
	 */
	
	// Constants
	/**
	 * 
	 */
	_self.PRIORITY_BALANCED_POWER_ACCURACY = _self.Map.PRIORITY_BALANCED_POWER_ACCURACY;
	_self.PRIORITY_HIGH_ACCURACY = _self.Map.PRIORITY_HIGH_ACCURACY;
	_self.PRIORITY_LOW_POWER = _self.Map.PRIORITY_LOW_POWER;
	_self.PRIORITY_NO_POWER = _self.Map.PRIORITY_NO_POWER;
	_self.PRIORITY_UNDEFINED = -1;
	
	_self.NORMAL_TYPE = _self.Map.NORMAL_TYPE;
	_self.TERRAIN_TYPE = _self.Map.TERRAIN_TYPE;
	_self.SATELLITE_TYPE = _self.Map.SATELLITE_TYPE;
	_self.HYBRID_TYPE = _self.Map.HYBRID_TYPE;
	
	_self.LAYER_TYPE_WMS_1_1_1 = _self.Map.LAYER_TYPE_WMS_1_1_1;
	_self.LAYER_TYPE_WMS_1_3_0 = _self.Map.LAYER_TYPE_WMS_1_3_0;
	_self.LAYER_TYPE_WMTS_1_0_0 = _self.Map.LAYER_TYPE_WMTS_1_0_0;
	_self.FORMAT_PNG = _self.Map.FORMAT_PNG;
	_self.FORMAT_JPEG = _self.Map.FORMAT_JPEG;

	/**
	 * Creates a new map view.
	 * @param {options} See http://docs.appcelerator.com/titanium/3.0/#!/api/Modules.Map.View
	 * @return {String} Id of the Map to be used in the methods of this API.
	 */
    _self.createMap = function createMap(viewId, options){
        mapsId++;
        
        // Size
        if (typeof options.width === 'undefined' || typeof options.height === 'undefined') {
            options.width = parseInt(Ti.App.tabView.rect.width * 0.7);
            options.height = parseInt(Ti.App.tabView.rect.height * 0.5);
            options.top = parseInt((Ti.App.tabView.rect.height * 0.5) / 2);
            options.left = parseInt((Ti.App.tabView.rect.width * 0.3) / 2);
        } else {
            // Position
            if (typeof options.top !== 'undefined' || typeof options.bottom !== 'undefined') {
                if (typeof options.bottom === 'undefined') {
                    options.top = parseInt(options.top + Ti.App.componentPos[viewId].top);
                } else {
                    options.top = parseInt(Ti.App.componentPos[viewId].top + (Ti.App.componentPos[viewId].height - options.bottom));
                }
            }
            if (typeof options.left !== 'undefined' || typeof options.right !== 'undefined') {
                if (typeof options.right === 'undefined') {
                    options.left = parseInt(options.left + Ti.App.componentPos[viewId].left);
                } else {
                    options.left = parseInt(Ti.App.componentPos[viewId].left + (Ti.App.componentPos[viewId].width - options.right));
                }
            }
        }


        mapsList[mapsId] = _self.Map.createView(options);
        Ti.App.tabView.add( mapsList[mapsId]);
        
        return mapsId;
    };
    
    
	/**
	 * Creates an Annotation. 
	 * @param {options} See http://docs.appcelerator.com/titanium/3.0/#!/api/Modules.Map.Annotation
	 * @return {String} Id of the annotation to be used in the methods of this API.
	 */
    _self.createAnnotation = function createAnnotation(options){

        var anon = _self.Map.createAnnotation(options);
        var id = anon.getId();
        freeElements["annotations"][id] = anon;
        return id;

    };
    
    
	/**
	 * Creates a Route. 
	 * @param {options} See http://docs.appcelerator.com/titanium/3.0/#!/api/Modules.Map.Route
	 * @return {String} Id of the route to be used in the methods of this API.
	 */
    _self.createRoute = function createRoute(options){

        var route = _self.Map.createRoute(options);
        var id = route.getId();
        freeElements["routes"][id] = route;
        
        return id;

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
	 * 		
	 * @return {String} Id of the route to be used in the methods of this API.
	 */
    _self.createPolygon = function createPolygon(options){

        var polygon = _self.Map.createPolygon(options);
        var id = polygon.getId();
        freeElements["polygons"][id] = polygon;
        
        return id;
        
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
	 * 		
	 * @return {String} Id of the route to be used in the methods of this API.
	 */
    _self.createLayer = function createLayer(options){

        var layer = _self.Map.createLayer(options);
        var id = layer.getId();
        freeElements["layers"][id] = layer;
        
        return id;

    };
    
    
    /**
	 * Parses a given KML file or string  and returns an object with the polygons and routes of the file.
	 * @param fileObj The KML file or string to parse
	 * @return An object {polygons: array, routes: array}. Null if there was an exception while parsing the KML file or string .
	 */
    _self.getShapesFromKml = function getShapesFromKml(data){
        return handleParserResult(_self.Map.getShapesFromKml(data));
    };
    
    
    /**
	 * Parses a given GeoJson file or string and returns an object with the polygons and routes of the file.
	 * @param fileObj The GeoJson file or string to parse
	 * @return An object {polygons: array, routes: array}. Null if there was an exception while parsing the GeoJson file or string .
	 */
    _self.getShapesFromGeoJson = function getShapesFromGeoJson(data){
        return handleParserResult(_self.Map.getShapesFromGeoJson(data));
    };
    
    
    /**
	 * Parses a given WKT file or string and returns an object with the polygons and routes of the file.
	 * @param fileObj The WKT file or string to parse
	 * @return An object {polygons: array, routes: array}. Null if there was an exception while parsing the WKT file or string .
	 */
    _self.getShapesFromWkt = function getShapesFromWkt(data){
        return handleParserResult(_self.Map.getShapesFromWkt(data));
    };
    
    
    /*
	 * ----------------------------------- MAP VIEW -----------------------------------------------------------------
	 */
	
	_self.setBound = function setBound(mapId, viewId, options) {
        if (videoPlayerList[playerId] == null) {
            //TODO: error. Unknown Video Player ID
            Ti.API.info('[API.Media.setVideoPlayerBound] Unknown Video Player id: ' + playerId);
            return false;
        }
        if (typeof options.width === 'undefined' || typeof options.height === 'undefined') {
            options.width = parseInt(Ti.App.tabView.rect.width * 0.7);
            options.height = parseInt(Ti.App.tabView.rect.height * 0.5);
            options.top = 'undefined';
            options.left = 'undefined';
        } else {
            // Position
            if (typeof options.top !== 'undefined' || typeof options.bottom !== 'undefined') {
                if (typeof options.bottom === 'undefined') {
                    options.top = parseInt(options.top + Ti.App.componentPos[viewId].top);
                } else {
                    options.top = parseInt(Ti.App.componentPos[viewId].top + (Ti.App.componentPos[viewId].height - options.bottom));
                }
            }
            if (typeof options.left !== 'undefined' || typeof options.right !== 'undefined') {
                if (typeof options.right === 'undefined') {
                    options.left = parseInt(options.left + Ti.App.componentPos[viewId].left);
                } else {
                    options.left = parseInt(Ti.App.componentPos[viewId].left + (Ti.App.componentPos[viewId].width - options.right));
                }
            }
        }
        videoPlayerList[playerId].height = options.height;
        videoPlayerList[playerId].width = options.width;
        videoPlayerList[playerId].top = options.top;
        videoPlayerList[playerId].left = options.left;
        Ti.API.info('[API.Media.setVideoPlayerBound] VideoPlayer: ' + playerId);
        return true;
    };
	
  	/**
  	 * Zooms in or out by specifying a relative zoom level. 
  	 * @param {mapId} Map in which execute the action. 
  	 * @param {delta} A positive value increases the current zoom level and a negative value decreases the zoom level. 
  	 */
    _self.zoom = function zoom(mapId, delta){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }

        mapsList[mapId].zoom(delta);

    };
    
    
    /**
     * Changes the location of the map.
     * @param {mapId} Map 
     * @param {location} See http://docs.appcelerator.com/titanium/3.0/#!/api/Modules.Map.View-method-setLocation
     */
    _self.setLocation = function setLocation(mapId, location){ //TODO: move to setProperty??
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }

        mapsList[mapId].setLocation(location);

    };
    
    /**
	 * Set how the map should follow the location of the device.
	 * @param {followLocation} True if the map camera must follow the location of the device. 
	 * @param {followBearing} True if the map camera must follow the bearing of the device.
	 * @param {options}:
	 * 		- {interval} LocationRequest desired interval in milliseconds. Must be > 0; otherwise, default value is 1000.
	 * 		- {priority} LocationRequest priority (PRIORITY_BALANCED_POWER_ACCURACY, PRIORITY_HIGH_ACCURACY, PRIORITY_LOW_POWER, PRIORITY_NO_POWER, PRIORITY_UNDEFINED).
	 */
    _self.followLocation = function followLocation(mapId, followLocation, followBearing, options){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        
        var interval, priority;
        if(options != null){
        	interval = options.interval;
        	priority = options.priority;
        	
        }
        if(interval == null)
        	interval = 1000;
        	
    	if(priority == null)
        	priority = _self.PRIORITY_UNDEFINED;
        
        mapsList[mapId].followLocation(interval, priority, followLocation, followBearing);

    };
    
    /**
     * Gets the value of a property of the map.
     * @param {mapId} The map.
     * @param {propertyName} String with the name of the property.
     * @return {Object} The value of the property.
     */
    _self.getMapProperty = function(mapId, propertyName){
		
		var validProperties = ["userLocation", "userLocationButton", "mapType", "region", 
								"animate", "traffic", "enableZoomControls", "rect", "region", "zoom"];
		var onlyIdProperties = ["annotations", "polygons", "layers", "routes"];
    							
		if(validProperties.indexOf(propertyName) >= 0){
			return getSetProperty("map", mapId, propertyName);
			
		} else if(onlyIdProperties.indexOf(propertyName) >= 0){
			var values = getSetProperty("map", mapId, propertyName);
			var ids = [];
			for(var id in values)
				ids.push(id);
			return ids;
			
		} else {
			//TODO: Error Getter method not found
			return;
		}
		
	};
	
	/**
     * Sets the value of a property of the map.
     * @param {mapId} The map id.
     * @param {propertyName} String with the name of the property.
     * @param {propertyValue} The value to be set for the property.
     */
	_self.setMapProperty = function(mapId, propertyName, propertyValue){
		
		var validProperties = ["userLocation", "userLocationButton", "mapType", "region", 
								"animate", "traffic", "enableZoomControls", "rect", "region"];
    							
		if(validProperties.indexOf(propertyName) >= 0){
			return getSetProperty("map", mapId, propertyName, propertyValue);
		} else {
			//TODO: Error Setter method not found
			return;
		}
	};
	
	/**
	 * Adds a view to the map view.
	 * @param {mapId} The map id where the view should be added.
	 * @param {view} View to be added.
	 */
	_self.add = function(mapId, view){
		if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }

        mapsList[mapId].add(view);
	};
	
	/**
	 * Removes a view from the map view.
	 * @param {mapId} The map id where the view should be remove.
	 * @param {view} View to be removed.
	 */
	_self.remove = function(mapId, view){
		if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }

        mapsList[mapId].remove(view);
	};
	
	/**
	 * Adds the map view into another view.
	 * @param {mapId} The map id whose view should be added to another.
	 * @param {view} View to be added to.
	 */
	_self.addToView = function(mapId, view){
		if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }

        view.add(mapsList[mapId]);
	};
	
	/**
	 * Removes the map view from another view.
	 * @param {mapId} The map id whose view should be removed from another one.
	 * @param {view} View to be removed from.
	 */
	_self.removeFromView = function(mapId, view){
		if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }

        view.remove(mapsList[mapId]);
	};
	
	/**
	 * Adds the specified callback as an event listener for the named event.
	 * @param {mapId} The map id.
	 * @param {event} Name of the event.
	 * @param {func} Callback function to invoke when the event is fired.
	 */
	_self.addEventListener = function(mapId, event, func){
		if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }

        mapsList[mapId].addEventListener(event, func);
	};
	
	/**
	 * Removes the specified callback as an event listener for the named event.
	 * Multiple listeners can be registered for the same event, so the callback parameter is used to determine which listener to remove. 
	 * @param {mapId} The map id.
	 * @param {event} Name of the event.
	 * @param {func} Callback function to invoke when the event is fired.
	 */
	_self.removeEventListener = function(mapId, event, func){
		if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }

        mapsList[mapId].removeEventListener(event, func);
	};



	/*
	 * -------------------- ANNOTATIONS -------------------------------
	 */
    
    /**
	 * Add an annotation to a map.
	 * @param {mapId} The id of the map.
	 * @param {annonId} The id of the annotation.
	 */
    _self.addAnnotation = function addAnnotation(mapId, annonId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        
        if(freeElements["annotations"][annonId] === 'undefined'){
        	//TODO: Error Unknown annotation or already added
            return;
        }

        mapsList[mapId].addAnnotation(freeElements["annotations"][annonId]);
        delete freeElements["annotations"][annonId];

    };
	
	/**
	 * Selects an annotation in a map.
	 * @param {mapId} The id of the map.
	 * @param {annonId} The id of the annotation.
	 */
    _self.selectAnnotation = function selectAnnotation(mapId, annoId){

        if(typeof mapsList[mapId] === 'undefined'){
        	Ti.API.info("Error: Unknown Map Id");
            return;
        }

        var annotation = getElement("annotation", annoId);
        
        if(annotation == null){
            Ti.API.info("Error: Unknown Annotation Id on Map Id");
            return;
		}
        
        mapsList[mapId].selectAnnotation(annotation);
        annotation = null;
        
    };

	/**
	 * Deselects an annotation in a map.
	 * @param {mapId} The id of the map.
	 * @param {annonId} The id of the annotation.
	 */
    _self.deselectAnnotation = function deselectAnnotation(mapId, annoId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        
        var annotation = getElement("annotation", annoId);
        
        if(annotation == null){
            Ti.API.info("Error: Unknown Annotation Id on Map Id");
            return;
		}
        
        mapsList[mapId].deselectAnnotation(annotation);
        annotation = null;
        
    };

	//TODO: allow to remove annotations from polygons?
	/**
	 * Removes an annotation from a map.
	 * @param {mapId} The id of the map.
	 * @param {annonId} The id of the annotation.
	 */
    _self.removeAnnotation = function removeAnnotation(mapId, annoId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        
        var annotation = getElement("annotation", annoId);
        
        if(annotation == null){
            Ti.API.info("Error: Unknown Annotation Id on Map Id");
            return;
		}
        else{
            mapsList[mapId].removeAnnotation(annotation);
            annotation = null;
        }
    };

	/**
	 * Removes multiple annotations from a map.
	 * @param {mapId} The id of the map.
	 * @param {annonId} Array with the ids of the annotations.
	 */
    _self.removeAnnotations = function removeAnnotations(mapId, annotations){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        var annonToRemove = [], i, j;

        while(annotations.length > 0){
            var annId = annotations.pop();
            var annotation = getElement("annotation", annId);
            if(annotation != null){
            	annonToRemove.push(annotation);
            } else {
            	 //TODO: Warning Unknown Annotation Id
            }
        }
        mapsList[mapId].removeAnnotations(annonToRemove);
        annon = null;
        annonToRemove = null;
    };
	
	/**
	 * Removes all the annotations from a map.
	 * @param {mapId} The id of the map.
	 */
    _self.removeAllAnnotations = function removeAllAnnotations(mapId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        mapsList[mapId].removeAllAnnotations();
    };
    
    /**
     * Gets the value of a property of an annotation.
     * @param {annotationId} The annotation id.
     * @param {propertyName} String with the name of the property.
     * @return {Object} The value of the property.
     */
    _self.getAnnotationProperty = function(annotationId, propertyName){
		
		var validProperties = ["id", "subtitle", "subtitleid", "title", "titleid", 
								"latitude","longitude", "draggable", "image","pincolor", 
								"customView", "leftButton", "leftView", "rightButton", 
								"rightView", "showInfoWindow", "visible"];
    							
		if(validProperties.indexOf(propertyName) >= 0){
			return getSetProperty("annotation", annotationId, propertyName);
		} else {
			//TODO: Error Getter method not found
			return;
		}
	};
	
	/**
     * Sets the value of a property of an annotation.
     * @param {annotationId} The annotation id.
     * @param {propertyName} String with the name of the property.
     * @param {propertyValue} The value to be set for the property.
     */
	_self.setAnnotationProperty = function(annotationId, propertyName, propertyValue){
		
		var validProperties = ["subtitle", "subtitleid", "title", "titleid", 
								"latitude","longitude", "draggable", "image","pincolor", 
								"customView", "leftButton", "leftView", "rightButton", 
								"rightView", "showInfoWindow", "visible"];
    							
		if(validProperties.indexOf(propertyName) >= 0){
			return getSetProperty("annotation", annotationId, propertyName, propertyValue);
		} else {
			//TODO: Error Setter method not found
			return;
		}
	};


	/*
	 * -------------------- ROUTES -------------------------------
	 */


    /**
	 * Add a route to a map.
	 * @param {mapId} The id of the map.
	 * @param {routeId} The id of the route.
	 */
    _self.addRoute = function addRoute(mapId, routeId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        
        if(freeElements["routes"][routeId] === 'undefined'){
        	//TODO: Error Unknown annotation or already added
            return;
        }

        mapsList[mapId].addRoute(freeElements["routes"][routeId]);
        delete freeElements["routes"][routeId];

    };
    
    /**
	 * Removes a route from a map.
	 * @param {mapId} The id of the map.
	 * @param {routeId} The id of the route.
	 */
    _self.removeRoute = function removeRoute(mapId, routeId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        
        var route = getElement("routes", routeId);

        if(route == null){
            //TODO: Error Unknown Annotation Id on Map Id
            return;
        }
        else{
            mapsList[mapId].removeRoute(route);
            route = null;
        }
    };
    
    /**
	 * Removes all the routes from a map.
	 * @param {mapId} The id of the map.
	 */
    _self.removeAllRoutes = function removeAllRoutes(mapId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        mapsList[mapId].removeAllRoutes();
    };
    
    /**
     * Gets the value of a property of a route.
     * @param {routeId} The route id.
     * @param {propertyName} String with the name of the property.
     * @return {Object} The value of the property.
     */
    _self.getRouteProperty = function(routeId, propertyName){
    	
    	var validProperties = ["id", "points", "width", "color"];
    							
		if(validProperties.indexOf(propertyName) >= 0){
			return getSetProperty("route", routeId, propertyName);
		} else {
			//TODO: Error Getter method not found
			return;
		}
		
	};
	
	/**
     * Sets the value of a property of a route.
     * @param {routeId} The route id.
     * @param {propertyName} String with the name of the property.
     * @param {propertyValue} The value to be set for the property.
     */
	_self.setRouteProperty = function(routeId, propertyName, propertyValue){
		
		var validProperties = ["points", "width", "color"];
    							
    	if(validProperties.indexOf(propertyName) >= 0){
			getSetProperty("route", routeId, propertyName, propertyValue);
		} else {
			//TODO: Error Setter method not found
			return;
		}
	};
    

	/*
	 * -------------------- POLYGONS -------------------------------
	 */
    
    /**
	 * Add a polygon to a map.
	 * @param {mapId} The id of the map.
	 * @param {polygonId} The id of the polygon.
	 */
    _self.addPolygon = function addPolygon(mapId, polygonId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        
        if(freeElements["polygons"][polygonId] === 'undefined'){
        	//TODO: Error Unknown annotation or already added
            return;
        }

        mapsList[mapId].addPolygon(freeElements["polygons"][polygonId]);
        delete freeElements["polygons"][polygonId];

    };
    
    /**
	 * Removes a polygon from a map.
	 * @param {mapId} The id of the map.
	 * @param {polygonId} The id of the polygon.
	 */
    _self.removePolygon = function removePolygon(mapId, polygonId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        
        var polygon = getElement("polygons", polygonId);
        
        if(polygon == null){
            //TODO: Error Unknown Annotation Id on Map Id
            return;
        }
        else{
            mapsList[mapId].removePolygon(polygon);
            polygon = null;
        }
    };
    
    /**
	 * Removes all the polygons from a map.
	 * @param {mapId} The id of the map.
	 */
    _self.removeAllPolygons = function removeAllPolygons(mapId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        mapsList[mapId].removeAllPolygons();
    };
    
    /**
     * Gets the value of a property of a polygon.
     * @param {polygonId} The polygon id.
     * @param {propertyName} String with the name of the property.
     * @return {Object} The value of the property.
     */
    _self.getPolygonProperty = function(polygonId, propertyName){
    	
    	var validProperties = ["id", "points", "holePoints", "strokeWidth", "strokeColor", 
    							"fillColor", "annotationId", "zIndex"];
    							
		if(validProperties.indexOf(propertyName) >= 0){
			
			if(propertyName === "annotationId"){ //Special case, this is a "virtual" method
				var annotation = getSetProperty("polygon", polygonId, "annotation");
				if(annotation != null){
					return annotation.getId();
				} else {
					return null;
				}
			} else {
				return getSetProperty("polygon", polygonId, propertyName);
			}
			
		} else {
			//TODO: Error Getter method not found
			return;
		}
		
	};
	
	/**
     * Sets the value of a property of a polygon.
     * @param {polygonId} The polygon id.
     * @param {propertyName} String with the name of the property.
     * @param {propertyValue} The value to be set for the property.
     */
	_self.setPolygonProperty = function(polygonId, propertyName, propertyValue){
		
		var validProperties = ["points", "holePoints", "strokeWidth", "strokeColor", 
    							"fillColor", "annotation", "zIndex"];
    							
    	if(validProperties.indexOf(propertyName) >= 0){
			getSetProperty("polygon", polygonId, propertyName, propertyValue);
		} else {
			//TODO: Error Setter method not found
			return;
		}
	};
	
	/**
	 * Adds the specified callback as an event listener for the named event.
	 * @param {polygonId} The polygon id.
	 * @param {event} Name of the event.
	 * @param {func} Callback function to invoke when the event is fired.
	 */
	_self.addPolygonEventListener = function(polygonId, event, func){
        
        var polygon = getElement("polygons", polygonId);
        
        if(polygon == null){
            //TODO: Error Unknown Polygon Id on Map Id
            return;
        }
        else{
            polygon.addEventListener(event, func);
        }

        
	};
	
	/**
	 * Removes the specified callback as an event listener for the named event.
	 * Multiple listeners can be registered for the same event, so the callback parameter is used to determine which listener to remove. 
	 * @param {polygonId} The polygon id.
	 * @param {event} Name of the event.
	 * @param {func} Callback function to invoke when the event is fired.
	 */
	_self.removePolygonEventListener = function(polygonId, event, func){
        
        var polygon = getElement("polygons", polygonId);
        
        if(polygon == null){
            //TODO: Error Unknown Polygon Id on Map Id
            return;
        }
        else{
            polygon.removeEventListener(event, func);
        }
	};

    
    
    /*
	 * -------------------- LAYERS -------------------------------
	 */
  
    /**
	 * Add a layer to a map.
	 * @param {mapId} The id of the map.
	 * @param {layerId} The id of the layer.
	 */
    _self.addLayer = function addLayer(mapId, layerId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        
        if(freeElements["layers"][layerId] === 'undefined'){
        	//TODO: Error Unknown layer or already added
            return;
        }

        mapsList[mapId].addLayer(freeElements["layers"][layerId]);
        delete freeElements["layers"][layerId];

    };
    
    /**
	 * Removes a layer from a map.
	 * @param {mapId} The id of the map.
	 * @param {layerId} The id of the layer.
	 */
    _self.removeLayer = function removeLayer(mapId, layerId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }

 		var layer = getElement("layers", layerId);
        
        if(layer == null){
            //TODO: Error Unknown Annotation Id on Map Id
            return;
        }
        else{
            mapsList[mapId].removeLayer(layer);
            layer = null;
        }
    };
    
    /**
	 * Removes all the layers from a map.
	 * @param {mapId} The id of the map.
	 */
    _self.removeAllLayers = function removeAllLayers(mapId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        mapsList[mapId].removeAllLayers();
    };
    
    
    /**
     * Gets the base layer 
	 * @param {Object} mapId Can be a layer id (String) or a google layer id (Integer).
     */
    _self.getBaseLayer = function getBaseLayer(mapId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }

        return mapsList[mapId].getBaseLayer().getId();

    };
    
    /**
     * Set the base layer of the map.
 	 * @param {Object} mapId The id of the map.
 	 * @param {Object} layerId  The id of the layer or the constant of the Google Layer.
     */
    _self.setBaseLayer = function setBaseLayer(mapId, layerId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }

		if((layerId + "").indexOf("-") != -1){ //It is a layer id
			
        	var layer = getElement("layers", layerId);
	        
	        if(layer == null){
	            //TODO: Error Unknown Annotation Id on Map Id
	            return;
	        }
	        else{
	        	mapsList[mapId].removeLayer(layer);
	            mapsList[mapId].setBaseLayer(layer);
	            layer = null;
	        }
	        
      } else { //It is a google layer id
       		mapsList[mapId].setBaseLayer(layerId);
       }

    };
    
    /**
     * Gets the value of a property of a layer.
     * @param {layerId} The layer id.
     * @param {propertyName} String with the name of the property.
     * @return {Object} The value of the property.
     */
    _self.getLayerProperty = function(layerId, propertyName){
    	
    	var validProperties = ["id", "baseUrl", "type", "name", "srs", "visible", "zIndex", 
    							"opacity", "format", "style", "tyleMatrixSet"];
    							
		if(validProperties.indexOf(propertyName) >= 0){
			return getSetProperty("layer", layerId, propertyName);
		} else {
			//TODO: Error Getter method not found
			return;
		}
	};
	
	/**
     * Sets the value of a property of a layer.
     * @param {layerId} The layer id.
     * @param {propertyName} String with the name of the property.
     * @param {propertyValue} The value to be set for the property.
     */
	_self.setLayerProperty = function(layerId, propertyName, propertyValue){
		
		var validProperties = ["baseUrl", "type", "name", "srs", "visible", "zIndex", 
    							"opacity", "format", "style", "tyleMatrixSet"];
    							
    	if(validProperties.indexOf(propertyName) >= 0){
			getSetProperty("layer", layerId, propertyName, propertyValue);
		} else {
			//TODO: Error Setter method not found
			return;
		}
	};
	
	
	

    return _self;

}());

module.exports = Map;
