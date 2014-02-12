/*
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
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
     * @return {Number} an integer (Bytes)
     * @todo _device does not exists */
    _self.getAvailableMemory = function getAvailableMemory() {
        var mem = Ti.Platform.getAvailableMemory();
        if (_device == 'ios') {
            // Megabytes to bytes
            mem = mem * 1024;
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
     * @return {String} */
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
     * @return {String} */
    _self.getLocale = function getLocale() {
        return Ti.Platform.getLocale();
    };

    return _self;

}());

module.exports = System;