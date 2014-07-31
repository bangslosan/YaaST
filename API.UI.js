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

    /** It provides several useful methods to get or create User Interface.
     * @alias API.UI
     * @namespace */
    var _self = {};

    /** Get constant Row Height on Android or iOS Table.
     * @method
     * @return {Number} */
    _self.getDefaultRowHeight = function getDefaultRowHeight() {
      if(Yaast.API.HW.System.isRetina()) return 88;
      else if(Yaast.API.HW.System.isApple()) return 44;
      else {
          var density = _self.getDensityScreen();
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
      if(Yaast.API.HW.System.isRetina()) return 60;
      else if(Yaast.API.HW.System.isApple()) return 30;
      else {
          var density = _self.getDensityScreen();
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
      if(Yaast.API.HW.System.isRetina()) return 14;
      else if(Yaast.API.HW.System.isApple()) return 7;
      else {
          var density = _self.getDensityScreen();
          if(density === 'low') return 33;
          else if(density === 'medium') return 7;
          else if(density === 'high') return 10.5;
          else if(density === 'xhigh') return 14;
          else if(density === 'xxhigh') return 21;
          else if(density === 'xxxhigh') return 28;
      }
    };

    /** Get Screen Type of Android Device
     * @method
     * @return {String} */
    _self.getDensityScreen = function getDensityScreen() {
        return Ti.Platform.displayCaps.getDensity();
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

    return _self;

};

module.exports = UI;