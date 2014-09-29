/*
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

'use strict';

var UI = function (APIReferences) {

	var Yaast = {
        "API" : APIReferences
    };

    var viewsById = {};
    var nextZindex = 100;


    /** It provides several useful methods to get or create User Interface.
     * @alias API.UI
     * @namespace */
    var _self = {};

    /** Get Screen Type of Android Device
     * @method
     * @return {String} */
    _self.getScreenDensity = function getScreenDensity() {
		return Ti.Platform.displayCaps.getDensity();
    };

    /** Get constant Row Height on Android or iOS Table.
     * @method
     * @return {Number} */
    _self.getDefaultRowHeight = function getDefaultRowHeight() {
		if (Yaast.API.HW.System.isRetina()) {
			return 88;
		} else if(Yaast.API.HW.System.isApple()) {
      		return 44;
      	} else {
  			var density = _self.getScreenDensity();
			if(density === 'low') return 33;
			else if(density === 'medium') return 44;
			else if(density === 'high') return 72;
			else if(density === 'xhigh') return 96;
			else if(density === 'xxhigh') return 144;
			else if(density === 'xxxhigh') return 192;
		}
    };

    /** Get constant Size Button (Square - width = height) on Android or iOS.
     * @method
     * @return {Number} */
    _self.getDefaultSizeButton = function getDefaultSizeButton() {
		if(Yaast.API.HW.System.isRetina()) {
			return 60;
		} else if(Yaast.API.HW.System.isApple()) {
			return 30;
		} else {
			var density = _self.getScreenDensity();
			if(density === 'low') return 33;
			else if(density === 'medium') return 30;
			else if(density === 'high') return 45;
			else if(density === 'xhigh') return 60;
			else if(density === 'xxhigh') return 90;
			else if(density === 'xxxhigh') return 120;
      }
    };

    /** Get constant Padding Button (Square - top = bottom) on Android or iOS.
     * @method
     * @return {Number} */
    _self.getDefaultPaddingButton = function getDefaultPaddingButton() {
		if(Yaast.API.HW.System.isRetina()) {
			return 14;
		} else if(Yaast.API.HW.System.isApple()) {
			return 7;
		} else {
			var density = _self.getScreenDensity();
			if(density === 'low') return 33;
			else if(density === 'medium') return 7;
			else if(density === 'high') return 10.5;
			else if(density === 'xhigh') return 14;
			else if(density === 'xxhigh') return 21;
			else if(density === 'xxxhigh') return 28;
		}
    };

    /** Get Padding Top of Application Window.
     * @method
     * @return {Number} */
    _self.getDefaultStatusBar = function getDefaultStatusBar() {
		var vers = parseFloat(Yaast.API.HW.System.getVersion(), 10);
		var appleBool = Yaast.API.HW.System.isApple();
		if(appleBool && vers < 7.0) return 0;
		if(appleBool && vers >= 7.0) {
			if(Yaast.API.HW.System.isRetina()) return 40;
			else return 20;
		}
		else return 12;
    };

    /** Get Display Platform Width.
     * @method
     * @return {Number} */
    _self.getPlatformWidth = function getPlatformWidth() {
		return Ti.Platform.displayCaps.getPlatformWidth();
    };

    /** Get Display Platform Height.
     * @method
     * @return {Number} */
    _self.getPlatformHeight = function getPlatformHeight() {
		return Ti.Platform.displayCaps.getPlatformHeight();
    };

    /** Add new view into parentView
     * @param options {'wView': theUpGraphView, 'type': 'widget', 'isNative': false, 'id':99}
     * @return {Boolean} */
    _self.addView = function addView(parentView, options) {
		options.wView.zIndex = nextZindex;
        parentView.add(options.wView);
        var bound = {
			'top': null,
            'left': null,
            'width': null,
            'height': null,
            'zindex': nextZindex
        };
        viewsById[options.id] = {'view': options.wView, 'defaultBound': bound, 'parentView': parentView};
        Ti.API.info('[UI.addView]viewsById.defaultBound: ' + JSON.stringify(viewsById[options.id].defaultBound));
        nextZindex ++;
        return true;
    };

    /** Remove view from parentView
     * @method
     * @return {Boolean} */
    _self.removeView = function removeView(id) {
        viewsById[id].parentView.remove(viewsById[id].view);
        delete viewsById[id];
        return true;
    };

    /** Set the View asociated with viewId to fullScreen
     * @method
     * @return {Boolean} */
    _self.setViewFullScreen = function setViewFullScreen(viewId) {
        Ti.API.info('[UI.setViewFullScreen]viewId: ' + JSON.stringify(viewId));
        viewsById[viewId].defaultBound.top = viewsById[viewId].view.rect.y;
        viewsById[viewId].defaultBound.left = viewsById[viewId].view.rect.x;
        viewsById[viewId].defaultBound.width = viewsById[viewId].view.rect.width;
        viewsById[viewId].defaultBound.height = viewsById[viewId].view.rect.height;
        Ti.API.info('[UI.setViewFullScreen]viewsById[viewId].view.rect: ' + JSON.stringify(viewsById[viewId].view.rect));
        Ti.API.info('[UI.setViewFullScreen]viewsById[viewId].defaultBound: ' + JSON.stringify(viewsById[viewId].defaultBound));
        viewsById[viewId].view.top = 0;
        viewsById[viewId].view.left = 0;
        viewsById[viewId].view.width = "100%";
        viewsById[viewId].view.height = "100%";
        viewsById[viewId].view.zIndex = 10000;
        return true;
    };

    /** Restore the View asociated with viewId size
     * @method
     * @return {Boolean} */
    _self.restoreViewSize = function restoreViewSize(viewId) {
		Ti.API.info('[UI.restoreViewSize]theView: ' + JSON.stringify(viewId));
        viewsById[viewId].view.top = viewsById[viewId].defaultBound.top;
        viewsById[viewId].view.left = viewsById[viewId].defaultBound.left;
        viewsById[viewId].view.width = viewsById[viewId].defaultBound.width;
        viewsById[viewId].view.height = viewsById[viewId].defaultBound.height;
        viewsById[viewId].view.zIndex = viewsById[viewId].defaultBound.zindex;
        return true;
    };

    return _self;

};

module.exports = UI;