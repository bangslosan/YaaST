/* Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details. */

"use strict";

/** Response indicating the operation status and result
 * @typedef CameraOptions
 * @property {String} [autohide=true] Specifies if the camera should be hidden automatically after the media capture is completed.
 * @property {String} [cancel] Function to call if the user presses the cancel button.
 * @property {String} [error] Function to call upon receiving an error.
 * @property {String} [saveToPhotoGallery=false] Specifies if the media should be saved to the photo gallery upon successful capture.
 * @property {String} [success] Function to call when the camera is closed after a successful capture/selection.
 * @property {String} [type="PHOTO"] "PHOTO" or "VIDEO" */

/** Response indicating the operation status and result
 * @typedef ResponseCallback
 * @property {String} status It should be "SUCCESS" or "FAILURE"
 * @property {String} data It should be the resulted data. */

/**
 * @callback ShowCameraCallback
 * @param {ResponseCallback} response */

/* FYI: http://docs.appcelerator.com/titanium/3.0/#!/api/Titanium.Media*/
var Camera = (function() {

    var checkOptions = function checkOptions(options) {
        if (!options) {
            throw new TypeError();
        }

        var isVoidObject = options instanceof Object &&
                Object.keys(options).length === 0;
        if (isVoidObject) {
            return;
        }

        var option;
        var acceptedOptions = [
            "autohide",
            "cancel",
            "error",
            "saveToPhotoGallery",
            "success",
            "type"
        ];

        var typeIsValid = options.hasOwnProperty('type') &&
                (options.type === "PHOTO" || options.type === "VIDEO");
        if (!typeIsValid) {
            throw {
                name: "ParameterError",
                message: "'type' option is not valid. It should be 'PHOTO' or 'VIDEO'"
            };
        }

        // only acceptedOptions can be present.
        var isAccepted = function isAccepted(option) {
            return acceptedOptions.some(function (element, index, array) {
                return element === option;
            });
        };

        for (option in options) {
            if (!isAccepted(option)) {
                throw {
                    name: "ParameterError",
                    message: "An option is not valid"
                };
            }
        }
    };

    var setDefaultOptions = function setDefaultOptions (options) {

        var setOption = function setOption (name, value) {
            if (!options.hasOwnProperty(name)) {
                options[name] = value;
            }
        };

        setOption("autohide", true);
        setOption("saveToPhotoGallery", false);
        setOption("type", "PHOTO");
    };

    var showCameraAndroidPhoto = function showCameraAndroidPhoto(callback, options) {
        var showCameraOptions = {
            success: function (e) {
                callback({
                    status: "SUCCESS",
                    data: Ti.Utils.base64encode(e.media).toString()
                });
            },
            error: function (e) {
                callback({
                    status: "ERROR"
                });
            },
            cancel: function (e) {
                callback({
                    status: "CANCEL"
                });
            },
            allowEditing: false,
            autoHide: options.autoHide,
            saveToPhotoGallery: options.saveToPhotoGallery,
            mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO]
        };

        Ti.Media.showCamera(showCameraOptions);
    };

    var showCameraAndroidVideo = function showCameraAndroidVideo(callback, options) {
        var intent = Titanium.Android.createIntent({
            action: 'android.media.action.VIDEO_CAPTURE'
        });
        Titanium.Android.currentActivity.startActivityForResult(intent, function(e) {
            if (e.error) {
                callback({
                    status: "ERROR",
                    data: null
                });
            } else if (e.resultCode === Titanium.Android.RESULT_OK) {
                var videoUri = e.intent.data;
                callback({
                    status: "SUCCESS",
                    data: videoUri
                });
            } else {
                callback({
                    status: "CANCEL",
                    data: null
                });
            }
        });
    };

    var showCameraAndroid = function showCameraAndroid(callback, options) {
        if (options.type === "PHOTO") {
            showCameraAndroidPhoto(callback, options);
        } else {
            showCameraAndroidVideo(callback, options);
        }
    };

    var showCameraIos = function showCameraIos (callback, options) {
        var showCameraOptions = {
            success: function (e) {
                callback({
                    status: "SUCCESS",
                    data: Ti.Utils.base64encode(e.media).toString()
                });
            },
            error: function (e) {
                callback({
                    status: "ERROR"
                });
            },
            cancel: function (e) {
                callback({
                    status: "CANCEL"
                });
            },
            allowEditing: false,
            autoHide: options.autoHide,
            saveToPhotoGallery: options.saveToPhotoGallery
        };

        if (options.type === "PHOTO"){
            showCameraOptions.mediaTypes = [Ti.Media.MEDIA_TYPE_PHOTO];
        } else {
            showCameraOptions.mediaTypes = [Ti.Media.MEDIA_TYPE_VIDEO];
            showCameraOptions.videoMaximumDuration = 10000;
            showCameraOptions.videoQuality = Titanium.Media.QUALITY_HIGH;
        }

        Ti.Media.showCamera(showCameraOptions);
    };

    /** It returns the result of Ti.Media native call.
     *  @private
     *  @param {String} funcName : The function name.
     *  @return Object : Native result. */
    var returnFunction = function returnFunction(funcName){
        var result;

        try {
            result = Ti.Media[funcName]();
        } catch (e) {
            e.details = {
                method: funcName,
                failure: "Native call failed"
            };

            throw e;
        }

        return result;
    };

    /** It allows to take pictures from native camera.
     * @version 1.0.0
     * @alias API.Camera
     * @namespace */
    var self = {};

    /** Gets the value of the availableCameras property.
     * @method
     * @return {Number[]} : CAMERA_FRONT, CAMERA_REAR or both*/
    self.getAvailableCameras = function getAvailableCameras() {
        return returnFunction("getAvailableCameras");
    };

    /** Gets the value of the isCameraSupported property.
     * @method
     * @return {Boolean} */
    self.isCameraSupported = function isCameraSupported() {
        return returnFunction("getIsCameraSupported");
    };

    /** Shows the native camera controls. A photo can be taken and it will be
     * returned in the first parameter of the callback.
     * @method
     * @param {ShowCameraCallback} callback
     * @param {CameraOptions} [options] Additional options that should be passed as
     *  parameter of native call */
    self.showCamera = function showCamera(callback, options) {
        try {
            checkOptions(options);
        } catch (e) {
            e.details = {
                method: "showCamera",
                failure: "'options' parameter is wrong"
            };

            throw e;
        }

        setDefaultOptions(options);
        if (Yaast.API.HW.System.isApple()) {
            showCameraIos(callback, options);
        } else {
            showCameraAndroid(callback, options);
        }
    };

    /** Hide the native camera application
     * @method
     * */
    self.hideCamera = function hideCamera() {
        Titanium.Media.hideCamera();
    };

    return self;

}());

module.exports = Camera;
