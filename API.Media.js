/*
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

"use strict";

/**
 * PhotoGalleryOptionsType.
 * @typedef {Object} PhotoGalleryOptionsType
 * @property {callback} success
 * @property {callback} error
 * @property {callback} cancel
 */

/* FYI: http://docs.appcelerator.com/titanium/3.0/#!/api/Titanium.Media*/
var Media = (function() {

    /** It allows to manage photo gallery and other native services.
     * @author Santiago Blanco & Carlos Blanco
     * @version 1.0.0
     * @alias API.Media
     * @namespace */
    var self = {};

    /** Opens the photo gallery image picker.
     * @param {PhotoGalleryOptionsType} */
    self.openPhotoGallery = function openPhotoGallery(options) {
        Titanium.Media.openPhotoGallery(options);
    };

    /** Takes a screen shot of the visible UI on the device. This method is
     *  asynchronous.
     * @param {screenSotCallback} callback that will receive screenshot image as Blob object */
    self.takeScreenshot = function takeScreenshot(callback) {
        Titanium.Media.takeScreenshot(callback);
    };

    /** Takes a screen shot of the visible UI on the device. This method is
     *  asynchronous.
     * @param {pattern} [Number[]=[100, 300, 100, 200, 100, 50]] optional vibrate pattern only available for Android.*/
    self.vibrate = function vibrate(pattern) {
        if (Ti.App.isApple || pattern == null || !(pattern instanceof Array)) {
            Titanium.Media.vibrate();
        }
        // pattern only available for Android
        Titanium.Media.vibrate(pattern);
    };

    return self;

}());

module.exports = Media;
