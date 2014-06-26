/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.2GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

"use strict";

var Map = (function() {

    var _self = {
        Map: require('ti.map')
    }, mapsId = 0, mapsList = {};


	/*
	 * ------------------------ PRIVATE UTILS -------------------------------
	 */

	var getSetProperty = function(mapId, elementType, elementId, propertyName, propertyValue){
		
		var elements = null;
		if(elementType === "annotation"){
			elements = mapsList[mapId].getAnnotations();
		}else if(elementType === "layer"){
			elements = mapsList[mapId].getLayers();
		}else if(elementType === "polygon"){
			elements = mapsList[mapId].getPolygons();
		}else if(elementType === "route"){
			elements = mapsList[mapId].getRoutes();
		}else if(elementType === "map"){
			elements = mapsList;
			elementId = mapId;
		}else{
			//TODO: Error Unknown element type
			return;
		}
		
		var element = elements[elementId];
		
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
					
					//Call the getter
					element["set"+ propertyName]();
					
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
	
	var getProperty = function(mapId, elementType, elementId, propertyName){
		getSetProperty(mapId, elementType, elementId, propertyName);
	};
	
	var setProperty = function(mapId, elementType, elementId, propertyName, propertyValue){
		getSetProperty(mapId, elementType, elementId, propertyName, propertyValue);
	};
	
	

	/*
	 * ------------------------ MAP -------------------------------
	 */
	
	// Constants
	_self.PRIORITY_BALANCED_POWER_ACCURACY = _self.Map.PRIORITY_BALANCED_POWER_ACCURACY;
	_self.PRIORITY_HIGH_ACCURACY = _self.Map.PRIORITY_HIGH_ACCURACY;
	_self.PRIORITY_LOW_POWER = _self.Map.PRIORITY_LOW_POWER;
	_self.PRIORITY_NO_POWER = _self.Map.PRIORITY_NO_POWER;
	_self.PRIORITY_UNDEFINED = -1;

    _self.createMap = function createMap(options){
        mapsId++;
        mapsList[mapsId] = _self.Map.createView({
            width: options.width,
            height: options.height
        });
        return mapsId;
    };
    
    
    _self.zoom = function zoom(mapId, delta){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }

        mapsList[mapId].zoom(delta);

    };
    
    
    _self.getZoom = function getZoom(mapId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }

        return mapsList[mapId].getZoom();

    };
    
    
    _self.setLocation = function setLocation(mapId, longitude, latitude){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }

        mapsList[mapId].setLocation({
        	longitude: longitude, 
        	latitude: latitude
    	});

    };
    
    _self.followLocation = function followLocation(mapId, followLocation, followBearing, options){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        
        var interval, priority;
        if(options == null){
        	interval = 1000;
        	priority = _self.PRIORITY_UNDEFINED;
        }

        mapsList[mapId].followLocation(interval, priority, followLocation, followBearing);

    };
    
    
    
    _self.getMapProperty = function(mapId, propertyName){
		
		var validProperties = ["baseLayer", "userLocation", "userLocationButton", "mapType", "region", 
								"animate", "traffic", "enableZoomControls"];
		var onlyIdProperties = ["annotations", "polygons", "layers", "routes"];
    							
		if(validProperties.indexOf(propertyName) >= 0){
			return getSetProperty(mapId, "map", mapId, propertyName);
			
		} else if(onlyIdProperties.indexOf(propertyName) >= 0){
			var values = getSetProperty(mapId, "map", mapId, propertyName);
			var ids = [];
			for(var id in values)
				ids.push(id);
			return ids;
			
		} else {
			//TODO: Error Getter method not found
			return;
		}
		
	};
	
	
	_self.setMapProperty = function(mapId, propertyName, propertyValue){
		
		var validProperties = ["baseLayer", "userLocation", "userLocationButton", "mapType", "region", 
								"animate", "traffic", "enableZoomControls", "annotation", "polygons", 
								"layers", "routes"];
    							
		if(validProperties.indexOf(propertyName) >= 0){
			return getSetProperty(mapId, "map", mapId, propertyName, propertyValue);
		} else {
			//TODO: Error Setter method not found
			return;
		}
	};

	/*
	 * -------------------- ANNOTATIONS -------------------------------
	 */
	
    _self.createAnnotation = function createAnnotation(mapId, options){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        //options = validateAnnotation(options);
        if(options.validate === true){
            var anon = _self.Map.createAnnotation(options);
            var id = anon.getId();
            mapsList[mapId].addAnnotation(anon);
            anon = null;
            return id;
        }
        else{
            //TODO: Error validate Annotation
        }
    };

    _self.selectAnnotation = function selectAnnotation(mapId, options){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        var annon = mapsList[mapId].getAnnotations(), i;
        var annotation = annon[options.id];
        
        if(annotation == null){
            //TODO: Error Unknown Annotation Id on Map Id
            return;
        }
        else{
            mapsList[mapId].selectAnnotation(annotation);
            annotation = null;
        }
    };

    _self.deselectAnnotation = function deselectAnnotation(mapId, options){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        var annon = mapsList[mapId].getAnnotations(), i;
        var annotation = annon[options.id];
        
        if(annotation == null){
            //TODO: Error Unknown Annotation Id on Map Id
            return;
        }
        else{
            mapsList[mapId].deselectAnnotation(annotation);
            annotation = null;
        }
    };

    _self.removeAnnotation = function removeAnnotation(mapId, options){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        var annon = mapsList[mapId].getAnnotations(), i;
        var annotation = annon[options.id];
        
        if(annotation == null){
            //TODO: Error Unknown Annotation Id on Map Id
            return;
        }
        else{
            mapsList[mapId].removeAnnotation(annotation);
            annotation = null;
        }
    };

    _self.removeAnnotations = function removeAnnotations(mapId, options){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        var annonToRemove = [], i, j;
        var annon = mapsList[mapId].getAnnotations();
        while(options.annotations.length > 0){
            var annId = options.annotations.pop();
            if(annon[annId] != null){
            	annonToRemove.push(annon[annId]);
            } else {
            	 //TODO: Warning Unknown Annotation Id
            }
        }
        mapsList[mapId].removeAnnotations(annonToRemove);
        annon = null;
        annonToRemove = null;
    };

    _self.removeAllAnnotations = function removeAllAnnotations(mapId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        mapsList[mapId].removeAllAnnotations();
    };
    
    _self.getAnnotationProperty = function(mapId, annotationId, propertyName){
		
		var validProperties = ["id", "subtitle", "subtitleid", "title", "titleid", 
								"latitude","longitude", "draggable", "image","pincolor", 
								"customView", "leftButton", "leftView", "rightButton", 
								"rightView", "showInfoWindow", "visible"];
    							
		if(validProperties.indexOf(propertyName) >= 0){
			return getSetProperty(mapId, "annotation", annotationId, propertyName);
		} else {
			//TODO: Error Getter method not found
			return;
		}
	};
	
	_self.setAnnotationProperty = function(mapId, annotationId, propertyName, propertyValue){
		
		var validProperties = ["subtitle", "subtitleid", "title", "titleid", 
								"latitude","longitude", "draggable", "image","pincolor", 
								"customView", "leftButton", "leftView", "rightButton", 
								"rightView", "showInfoWindow", "visible"];
    							
		if(validProperties.indexOf(propertyName) >= 0){
			return getSetProperty(mapId, "annotation", annotationId, propertyName, propertyValue);
		} else {
			//TODO: Error Setter method not found
			return;
		}
	};


	/*
	 * -------------------- ROUTES -------------------------------
	 */

    _self.createRoute = function createRoute(mapId, options){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        //options = validateRoute(options);
        if(options.validate === true){
            var route = _self.Map.createRoute(options);
            var id = route.getId();
            mapsList[mapId].addRoute(route);
            route = null;
            return id;
        }
        else{
            //TODO: Error validate Route
        }
    };
    
    _self.removeRoute = function removeRoute(mapId, options){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        var routes = mapsList[mapId].getRoutes(), i;
        var route = routes[options.id];

        if(route == null){
            //TODO: Error Unknown Annotation Id on Map Id
            return;
        }
        else{
            mapsList[mapId].removeRoute(route);
            route = null;
        }
    };
    
    _self.removeAllRoutes = function removeAllRoutes(mapId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        mapsList[mapId].removeAllRoutes();
    };
    
    _self.getRouteProperty = function(mapId, routeId, propertyName){
    	
    	var validProperties = ["id", "points", "width", "color"];
    							
		if(validProperties.indexOf(propertyName) >= 0){
			return getSetProperty(mapId, "route", routeId, propertyName);
		} else {
			//TODO: Error Getter method not found
			return;
		}
		
	};
	
	_self.setRouteProperty = function(mapId, routeId, propertyName, propertyValue){
		
		var validProperties = ["points", "width", "color"];
    							
    	if(validProperties.indexOf(propertyName) >= 0){
			getSetProperty(mapId, "route", routeId, propertyName, propertyValue);
		} else {
			//TODO: Error Setter method not found
			return;
		}
	};
    

	/*
	 * -------------------- POLYGONS -------------------------------
	 */

    _self.createPolygon = function createPolygon(mapId, options){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        //options = validateRoute(options);
        if(options.validate === true){
            var polygon = _self.Map.createPolygon(options);
            var id = polygon.getId();
            mapsList[mapId].addPolygon(polygon);
            polygon = null;
            return id;
        }
        else{
            //TODO: Error validate Route
        }
    };
    
    _self.removePolygon = function removePolygon(mapId, options){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        var polygons = mapsList[mapId].getPolygons(), i;
        var polygon = polygons[options.id];
        
        if(polygon == null){
            //TODO: Error Unknown Annotation Id on Map Id
            return;
        }
        else{
            mapsList[mapId].removePolygon(polygon);
            polygon = null;
        }
    };
    
    _self.removeAllPolygons = function removeAllPolygons(mapId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        mapsList[mapId].removeAllPolygons();
    };
    
    _self.getPolygonProperty = function(mapId, polygonId, propertyName){
    	
    	var validProperties = ["id", "points", "holePoints", "strokeWidth", "strokeColor", 
    							"fillColor", "annotationId", "zIndex"];
    							
		if(validProperties.indexOf(propertyName) >= 0){
			
			if(propertyName === "annotationId"){ //Special case, this is a "virtual" method
				var annotation = getSetProperty(mapId, "polygon", polygonId, "annotation");
				if(annotation != null){
					return annotation.getId();
				} else {
					return null;
				}
			} else {
				return getSetProperty(mapId, "polygon", polygonId, propertyName);
			}
			
		} else {
			//TODO: Error Getter method not found
			return;
		}
		
	};
	
	_self.setPolygonProperty = function(mapId, polygonId, propertyName, propertyValue){
		
		var validProperties = ["points", "holePoints", "strokeWidth", "strokeColor", 
    							"fillColor", "annotation", "zIndex"];
    							
    	if(validProperties.indexOf(propertyName) >= 0){
			getSetProperty(mapId, "polygon", polygonId, propertyName, propertyValue);
		} else {
			//TODO: Error Setter method not found
			return;
		}
	};
    
    
    /*
	 * -------------------- LAYERS -------------------------------
	 */

    _self.createLayer = function createLayer(mapId, options){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        //options = validateRoute(options);
        if(options.validate === true){
            var layer = _self.Map.createLayer(options);
            var id = layer.getId();
            mapsList[mapId].addLayer(layer);
            layer = null;
            return id;
        }
        else{
            //TODO: Error validate Route
        }
    };
    
    _self.removeLayer = function removeLayer(mapId, options){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        var layers = mapsList[mapId].getLayers(), i;
        var layer = layers[options.id];
        
        if(layer == null){
            //TODO: Error Unknown Annotation Id on Map Id
            return;
        }
        else{
            mapsList[mapId].removeLayer(layer);
            layer = null;
        }
    };
    
    _self.removeAllLayers = function removeAllLayers(mapId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        mapsList[mapId].removeAllLayers();
    };
    
    _self.getLayerProperty = function(mapId, layerId, propertyName){
    	
    	var validProperties = ["id", "baseUrl", "type", "name", "srs", "visible", "zIndex", 
    							"opacity", "format", "style", "tyleMatrixSet"];
    							
		if(validProperties.indexOf(propertyName) >= 0){
			return getSetProperty(mapId, "layer", layerId, propertyName);
		} else {
			//TODO: Error Getter method not found
			return;
		}
	};
	
	_self.setLayerProperty = function(mapId, layerId, propertyName, propertyValue){
		
		var validProperties = ["baseUrl", "type", "name", "srs", "visible", "zIndex", 
    							"opacity", "format", "style", "tyleMatrixSet"];
    							
    	if(validProperties.indexOf(propertyName) >= 0){
			getSetProperty(mapId, "layer", layerId, propertyName, propertyValue);
		} else {
			//TODO: Error Setter method not found
			return;
		}
	};
	
	
	

    return _self;

}());

module.exports = Map;
