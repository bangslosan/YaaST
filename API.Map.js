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

    _self.createMap = function createMap(options){
        mapsId++;
        mapsList[mapsId] = _self.Map.createView({
            width: options.width,
            height: options.height
        });
        return mapsId;
    };

    _self.createAnnotation = function createAnnotation(mapId, options){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        //options = validateAnnotation(options);
        if(options.validate === true){
            var anon = _self.Map.createAnnotation(options);
            mapsList[mapId].addAnnotation(anon);
            anon = null;
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
        var annotation = null;
        for(i = 0; i < annon.length; i++){
            if(annon[i].id === options.id){
                annotation = annon[i];
                break;
            }
        }
        if(annotation === null){
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
        var annotation = null;
        for(i = 0; i < annon.length; i++){
            if(annon[i].id === options.id){
                annotation = annon[i];
                break;
            }
        }
        if(annotation === null){
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
        var annotation = null;
        for(i = 0; i < annon.length; i++){
            if(annon[i].id === options.id){
                annotation = annon[i];
                break;
            }
        }
        if(annotation === null){
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
            var found = false;
            for(i = 0; i < annon.length; i++){
                if(annId === annon[i].id){
                    annonToRemove.push(annon[i]);
                    found = true;
                    break;
                }
            }
            if(found === false){
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

    _self.createRoute = function createRoute(mapId, options){
        if(typeof mapsList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        //options = validateRoute(options);
        if(options.validate === true){
            var route = _self.Map.createRoute(options);
            mapsList[mapId].addRoute(route);
            route = null;
        }
        else{
            //TODO: Error validate Route
        }
    };

    return _self;

}());

module.exports = Map;
