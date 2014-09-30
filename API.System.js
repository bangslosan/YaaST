/*
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

'use strict';

var System = (function() {

    /** It provides several useful methods to collect information about current device.
     * @alias API.System
     * @namespace */
    var _self = {};

    /** Check Apple platform.
     * @method
     * @return {Boolean} */
    _self.isApple = function isApple(){
        return (Ti.Platform.getOsname() === 'ipad' || Ti.Platform.getOsname() === 'iphone');
    };

    /** Check Apple Retina Display.
     * @method
     * @return {Boolean} */
    _self.isRetina = function isRetina(){
        if(_self.isApple()){
            if(_self.isTablet()) return Ti.Platform.displayCaps.getDpi() === 260;
            else return Ti.Platform.displayCaps.getDpi() === 320;
        }
        else return false;
    };

    /** Check Tablet Display
     * @method
     * @return {Boolean} */
    _self.isTablet = function isTablet() {
        return (Ti.Platform.getOsname() === 'ipad') || (Ti.Platform.getOsname() === 'android' && (
           (Ti.Platform.Android.getPhysicalSizeCategory() === Ti.Platform.Android.PHYSICAL_SIZE_CATEGORY_LARGE) ||
           (Ti.Platform.Android.getPhysicalSizeCategory() === Ti.Platform.Android.PHYSICAL_SIZE_CATEGORY_XLARGE))
        ) || Math.min(Ti.Platform.displayCaps.getPlatformHeight(), Ti.Platform.displayCaps.getPlatformWidth()) >= 400;
    };

    /** Get device platform.
     * @method
     * @return {String} It should return 'iOS' or 'Android' */
    _self.getDeviceOs = function getDeviceOs() {
        if (_self.isApple()) return 'iOS';
        else return 'Android';
    };

    /** Get System's OS version.
     * @method
     * @return {String} */
    _self.getVersion = function getVersion() {
        return Ti.Platform.getVersion();
    };

    /** Get System's OS version String.
     * @method
     * @return {String} Android => Version Name. iOS = Version Number */
    _self.getVersionString = function getVersionString() {
        var splited = _self.getVersion().split('.');
        if(splited[0] === '2' && splited[1] === '2') return "Froyo";
        else if(splited[0] === '2' && splited[1] !== '2') return "Gingerbread";
        else if(splited[0] === '3') return "Honeycomb";
        else if(splited[0] === '4' && splited[1] === '0') return "Ice Cream Sandwich";
        else if(splited[0] === '4' && splited[1] !== '0') return "Jelly Bean";
        else return splited[0]+"."+splited[1];
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
        if (_self.isApple()) {
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
     * @return {String} ISO639-1 or ISO3166-1Alpha2 */
    _self.getLocale = function getLocale() {
        return Ti.Platform.getLocale();
    };

    /** Get app ID.
     * @method
     * @return {String}  Applications's globally-unique ID (UUID).
     * On Android, this may be the UDID (unique device ID). For iOS,
     * this is a unique identifier for this install of the application.*/
    _self.getAppId = function getAppId() {
        return Ti.Platform.getId();
    };

    /** Get Mac Adress.
     * @method
     * @return {String}  Applications's globally-unique ID (UUID).
     * On iOS, this value is the app's UUID. Apple does not allow
     * access to any hardware identifier information as it can be
     * used for unique device identification, which they have prohibited.*/
	_self.getMacAddress = function getMacAddress() {
		return Ti.Platform.getMacaddress();
	};

    return _self;

}());

module.exports = System;