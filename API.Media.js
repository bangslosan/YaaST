/*
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

"use strict";

/** The parameter passed to takeScreenshot callback.
 * @typedef ScreenshotResult
 * @property {String} media It is the screenshot image (a Blob). */

/** The screenshot is returned in this callback argument.
 * @callback ScreenshotCallback
 * @param {ScreenshotResult} result */

/* FYI: http://docs.appcelerator.com/titanium/3.0/#!/api/Titanium.Media*/
var Media = (function() {

    /** It allows to manage photo gallery and other native services.
     * @author Santiago Blanco
     * @version 1.0.0
     * @alias API.Media
     * @namespace */
    var self = {};

    /** Opens the photo gallery image picker.
     * @param {PhotoGalleryOptionsType} options : Photo gallery options as
     *      described in PhotoGalleryOptionsType. */
    self.openPhotoGallery = function openPhotoGallery(options) {
        // TODO
        // process("openPhotoGallery", [options]);
    };

    /** It saves an image on native photo gallery.
     * @method
     * @param {Object} options
     * @todo It still needs to be implemented
     */
    self.saveToPhotoGallery = function saveToPhotoGallery(options) {
        //TODO
    };

    /** Takes a screen shot of the visible UI on the device. This method is
     *  asynchronous.
     * @param {ScreenshotResult} callback */
    self.takeScreenshot = function takeScreenshot(callback) {
        //TODO
    };

    return self;

}());

module.exports = Media;
