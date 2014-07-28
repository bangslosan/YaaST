/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

"use strict";

var Map = (function() {

    var _self = {
        mapList: {}
    }, mapsId = 0,
    mapModule = require('ti.map');

    _self.createMap = function createMap(options){
        var r = mapsId;
        _self.mapList[r] = mapModule.createView(options);
        mapsId++;
        return r;
    };

    _self.createAnnotation = function createAnnotation(mapId, options){
        if(typeof _self.mapList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        //options = validateAnnotation(options);
        if(options.validate === true){
            var anon = mapModule.createAnnotation(options);
            _self.mapList[mapId].addAnnotation(anon);
            anon = null;
        }
        else{
            //TODO: Error validate Annotation
        }
    };

    _self.selectAnnotation = function selectAnnotation(mapId, options){
        if(typeof _self.mapList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        var annon = _self.mapList[mapId].getAnnotations(), i;
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
            _self.mapList[mapId].selectAnnotation(annotation);
            annotation = null;
        }
    };

    _self.deselectAnnotation = function deselectAnnotation(mapId, options){
        if(typeof _self.mapList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        var annon = _self.mapList[mapId].getAnnotations(), i;
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
            _self.mapList[mapId].deselectAnnotation(annotation);
            annotation = null;
        }
    };

    _self.removeAnnotation = function removeAnnotation(mapId, options){
        if(typeof _self.mapList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        var annon = _self.mapList[mapId].getAnnotations(), i;
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
            _self.mapList[mapId].removeAnnotation(annotation);
            annotation = null;
        }
    };

    _self.removeAnnotations = function removeAnnotations(mapId, options){
        if(typeof _self.mapList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        var annonToRemove = [], i, j;
        var annon = _self.mapList[mapId].getAnnotations();
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
        _self.mapList[mapId].removeAnnotations(annonToRemove);
        annon = null;
        annonToRemove = null;
    };

    _self.removeAllAnnotations = function removeAllAnnotations(mapId){
        if(typeof _self.mapList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        _self.mapList[mapId].removeAllAnnotations();
    };

    _self.createRoute = function createRoute(mapId, options){
        if(typeof _self.mapList[mapId] === 'undefined'){
            //TODO: Error Unknown Map Id
            return;
        }
        //options = validateRoute(options);
        if(options.validate === true){
            var route = mapModule.createRoute(options);
            _self.mapList[mapId].addRoute(route);
            route = null;
        }
        else{
            //TODO: Error validate Route
        }
    };

    return _self;

}());

module.exports = Map;
