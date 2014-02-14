/*
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.1GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

'use strict';

var System = (function() {

    /** It provides several useful methods to collect information about current device.
     * @author Carlos Blanco
     * @version 1.0.0
     * @alias API.System
     * @namespace */
    var _self = {};

    /** Check Apple platform
     * @method
     * @return {Boolean} */
    _self.isApple = function isApple(){
        return Ti.App.isApple;
    };

    /** Check Apple Retina Display
     * @method
     * @return {Boolean} */
    _self.isRetina = function isRetina(){
        return Ti.App.isRetina;
    };

    /** Get device platform
     * @method
     * @return {String} It should return 'ios' or 'android' */
    _self.getDeviceOs = function getDeviceOs() {
        var osName = Ti.Platform.getOsname();
        if (osName  === 'ipad' || osName === 'iphone') {
            osName = 'ios';
        }
        return osName;
    };

    /** Get System's OS version.
     * @method
     * @return {String} */
    _self.getVersion = function getVersion() {
        return Ti.Platform.getVersion();
    };

    /** Get device's Model.
     * @method
     * @return {String} */
    _self.getModel = function getModel() {
        return Ti.Platform.getModel();
    };

    /** Get System's processor architecture.
     * @method
     * @return {String} */
    _self.getArchitecture = function getArchitecture() {
        return Ti.Platform.getArchitecture();
    };

    /** Get available memory
     * @method
     * @return {Number} an integer (Bytes) */
    _self.getAvailableMemory = function getAvailableMemory() {
        var mem = Ti.Platform.getAvailableMemory();
        if (_self.isApple) {
            mem = mem * 1024; // Megabytes to bytes
        }
        return mem;
    };

    /** Get short name of the JavaScript runtime in use.
     * @method
     * @return {String} */
    _self.getJsRuntime = function getJsRuntime() {
        return Ti.Platform.getRuntime();
    };

    /** Get the manufacturer of the device.
     * @method
     * @return {String} */
    _self.getManufacturer = function getManufacturer() {
        return Ti.Platform.getManufacturer();
    };

    /** Get the number of processing cores.
     * @method
     * @return {Number} */
    _self.getProcessorCount = function getProcessorCount() {
        return Ti.Platform.getProcessorCount();
    };

    /** Get system name
     * @method
     * @return {String} */
    _self.getUsername = function getUsername() {
        return Ti.Platform.getUsername();
    };

    /** Get system's default language.
     * @method
     * @return {String} ISO639-1 + - + ISO3166-1Alpha2 */
    _self.getLocale = function getLocale() {
        return Ti.Platform.getLocale();
    };

    return _self;

}());

module.exports = System;