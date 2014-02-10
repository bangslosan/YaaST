/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */
'use strict';

var Accelerometer = (function() {

    var _self = {};

    _self.events = {
                    'AccelerometerChange': {
                        event: 'update',
                        listener: Ti.Accelerometer
                    }
    };
    return _self;

}());

module.exports = Accelerometer;