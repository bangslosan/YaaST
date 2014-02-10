/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

var System = function() {

    var _self = {};

    /** Get device platform
      * @return : String ('ios', 'android') */
    _self.getDeviceOs = function getDeviceOs() {
        return _device;
    };

    /** Get System's OS version.
      * @return : String */
    _self.getVersion = function getVersion() {
        return Ti.Platform.getVersion();
    };

    /** Get device's Model.
      * @return : String */
    _self.getModel = function getModel() {
        return Ti.Platform.getModel();
    };

    /** Get System's processor architecture.
      * @return : String */
    _self.getArchitecture = function getArchitecture() {
        return Ti.Platform.getArchitecture();
    };

    /** Get available memory
      * @return : Int (Bytes)*/
    _self.getAvailableMemory = function getAvailableMemory() {
        var mem = Ti.Platform.getAvailableMemory();
        if (_device == 'ios') {
            // Megabytes to bytes
            mem = mem * 1024;
        }
        return mem;
    };

    /** Get short name of the JavaScript runtime in use.
      * @return : sring */
    _self.getJsRuntime = function getJsRuntime() {
        return Ti.Platform.getRuntime();
    };

    /** Get the manufacturer of the device.
      * @return : sring */
    _self.getManufacturer = function getManufacturer() {
        return Ti.Platform.getManufacturer();
    };

    /** Get the number of processing cores.
      * @return : sring */
    _self.getProcessorCount = function getProcessorCount() {
        return Ti.Platform.getProcessorCount();
    };

    /** Get system name
      * @return : sring */
    _self.getUsername = function getUsername() {
        return Ti.Platform.getUsername();
    };

    /** Get system's default language.
      * @return : sring */
    _self.getLocale = function getLocale() {
        return Ti.Platform.getLocale();
    };

    return _self;

}();

module.exports = System;