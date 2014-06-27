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
		
		if(element == null && elementType === "annotation"){
			element = getAnnotationFromPolygons(mapId, elementId);
		}
		
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
	
	var getProperty = function(mapId, elementType, elementId, propertyName){
		getSetProperty(mapId, elementType, elementId, propertyName);
	};
	
	var setProperty = function(mapId, elementType, elementId, propertyName, propertyValue){
		getSetProperty(mapId, elementType, elementId, propertyName, propertyValue);
	};
	
	
	var getAnnotationFromPolygons = function(mapId, annoId){
		
		var annotation = null;
		//Search now between the polygon annotations
    	var polygons = mapsList[mapId].getPolygons();
    	for(var polyId in polygons){
    		var poly = polygons[polyId];
    		if(poly.annotation != null && poly.annotation.getId() == annoId){
    			return poly.annotation;
    		}
    	}
    	
    	return annotation;
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
	
	_self.NORMAL_TYPE = _self.Map.NORMAL_TYPE;
	_self.TERRAIN_TYPE = _self.Map.TERRAIN_TYPE;
	_self.SATELLITE_TYPE = _self.Map.SATELLITE_TYPE;
	_self.HYBRID_TYPE = _self.Map.HYBRID_TYPE;
	
	_self.LAYER_TYPE_WMS_1_1_1 = _self.Map.LAYER_TYPE_WMS_1_1_1;
	_self.LAYER_TYPE_WMS_1_3_0 = _self.Map.LAYER_TYPE_WMS_1_3_0;
	_self.LAYER_TYPE_WMTS_1_0_0 = _self.Map.LAYER_TYPE_WMTS_1_0_0;
	_self.FORMAT_PNG = _self.Map.FORMAT_PNG;
	_self.FORMAT_JPEG = _self.Map.FORMAT_JPEG;


    _self.createMap = function createMap(options){
        mapsId++;
        mapsList[mapsId] = _self.Map.createView(options);
        return mapsId;
    };
    
    
    _self.createVectorialParser = function createVectorialParser(){
        return _self.Map.createVectorialParser();
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
		
		var validProperties = ["userLocation", "userLocationButton", "mapType", "region", 
								"animate", "traffic", "enableZoomControls", "rect", "region"];
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
		
		var validProperties = ["userLocation", "userLocationButton", "mapType", "region", 
								"animate", "traffic", "enableZoomControls", "rect", "region"];
    							
		if(validProperties.indexOf(propertyName) >= 0){
			return getSetProperty(mapId, "map", mapId, propertyName, propertyValue);
		} else {
			//TODO: Error Setter method not found
			return;
		}
	};
	
	_self.add = function(mapId, view){
		if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }

        mapsList[mapId].add(view);
	};
	
	
	_self.remove = function(mapId, view){
		if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }

        mapsList[mapId].remove(view);
	};
	
	
	_self.addToView = function(mapId, view){
		if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }

        view.add(mapsList[mapId]);
	};
	
	
	_self.removeFromView = function(mapId, view){
		if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }

        view.remove(mapsList[mapId]);
	};
	
	
	_self.addEventListener = function(mapId, event, func){
		if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }

        mapsList[mapId].addEventListener(event, func);
	};
	
	
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
	
    _self.createAnnotation = function createAnnotation(mapId, options){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }

        var anon = _self.Map.createAnnotation(options);
        var id = anon.getId();
        mapsList[mapId].addAnnotation(anon);
        anon = null;
        return id;

    };

    _self.selectAnnotation = function selectAnnotation(mapId, annoId){

        if(typeof mapsList[mapId] === 'undefined'){
        	Ti.API.info("Error: Unknown Map Id");
            return;
        }

        var annotation = mapsList[mapId].getAnnotations()[annoId];

        if(annotation == null){

        	//Search it between the polygon annotations
        	annotation = getAnnotationFromPolygons(mapId, annoId);
        	if(annotation == null){
	            Ti.API.info("Error: Unknown Annotation Id on Map Id");
	            return;
			}
        }
        
        mapsList[mapId].selectAnnotation(annotation);
        annotation = null;
        
    };

    _self.deselectAnnotation = function deselectAnnotation(mapId, annoId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        var annon = mapsList[mapId].getAnnotations(), i;
        var annotation = annon[annoId];
        
        if(annotation == null){
        	
        	//Search it between the polygon annotations
        	annotation = getAnnotationFromPolygons(mapId, annoId);
        	
        	if(annotation == null){
	            Ti.API.info("Error: Unknown Annotation Id on Map Id");
	            return;
			}
        }
        
        mapsList[mapId].deselectAnnotation(annotation);
        annotation = null;
        
    };

	//TODO: allow to remove annotations from polygons?
    _self.removeAnnotation = function removeAnnotation(mapId, annoId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        
        var annotation = mapsList[mapId].getAnnotations()[annoId];
        
        if(annotation == null){
            //TODO: Error Unknown Annotation Id on Map Id
            return;
        }
        else{
            mapsList[mapId].removeAnnotation(annotation);
            annotation = null;
        }
    };

    _self.removeAnnotations = function removeAnnotations(mapId, annotations){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        var annonToRemove = [], i, j;
        var annon = mapsList[mapId].getAnnotations();
        while(annotations.length > 0){
            var annId = annotations.pop();
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

        var route = _self.Map.createRoute(options);
        var id = route.getId();
        mapsList[mapId].addRoute(route);
        route = null;
        return id;

    };
    
    _self.addRoute = function addRoute(mapId, route){
    	if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        
        mapsList[mapId].addRoute(route);
    };
    
    
    _self.removeRoute = function removeRoute(mapId, routeId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        
        var route = mapsList[mapId].getRoutes()[routeId];

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

        var polygon = _self.Map.createPolygon(options);
        var id = polygon.getId();
        mapsList[mapId].addPolygon(polygon);
        polygon = null;
        return id;
        
    };
    
    
    _self.addPolygon = function addPolygon(mapId, polygon){
    	if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        
        mapsList[mapId].addPolygon(polygon);
        
    };
    
    _self.removePolygon = function removePolygon(mapId, polygonId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        
        var polygon = mapsList[mapId].getPolygons()[polygonId];
        
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
	
	_self.addPolygonEventListener = function(mapId, polygonId, event, func){
		if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        
        var polygon = mapsList[mapId].getPolygons()[polygonId];
        
        if(polygon == null){
            //TODO: Error Unknown Polygon Id on Map Id
            return;
        }
        else{
            polygon.addEventListener(event, func);
        }

        
	};
	
	
	_self.removePolygonEventListener = function(mapId, event, func){
		if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        
        var polygon = mapsList[mapId].getPolygons()[polygonId];
        
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

    _self.createLayer = function createLayer(mapId, options){
        if(typeof mapsList[mapId] === 'undefined'){
            Ti.API.info("Error: Unknown Map Id");
            return;
        }

        var layer = _self.Map.createLayer(options);
        var id = layer.getId();
        mapsList[mapId].addLayer(layer);
        layer = null;
        return id;

    };
    
    _self.addLayer = function addLayer(mapId, layer){
    	if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        
        mapsList[mapId].addLayer(layer);
    };
    
    _self.removeLayer = function removeLayer(mapId, layerId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }

        var layer = mapsList[mapId].getLayers()[layerId];
        
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
    
    _self.getBaseLayer = function getBaseLayer(mapId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }

        return mapsList[mapId].getBaseLayer().getId();

    };
    
    _self.setBaseLayer = function setBaseLayer(mapId, layerId){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }

		if((layerId + "").indexOf("-") != -1){ //It is a layer id
			
        	var layer = mapsList[mapId].getLayers()[layerId];
	        
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
