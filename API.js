/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.1GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 * API Team
 *
 *  Alejandro F.Carrera
 *  Carlos Blanco Vallejo
 *  Santiago Blanco Ventas
 *
 */

'use strict';

// System Global Variables
Ti.App.isApple = (Ti.Platform.getOsname() === 'ipad' || Ti.Platform.getOsname() === 'iphone');
Ti.App.isRetina = (Ti.App.isApple && Ti.Platform.displayCaps.getDpi() === 260) ? true : false;
Ti.App.platformHeight = Ti.Platform.displayCaps.getPlatformHeight();
Ti.App.platformWidth = Ti.Platform.displayCaps.getPlatformWidth();

var API = (function() {
    var _self;

    //TODO: only for debug
    var eventcounter = {};

    _self = {
        SW : {
            Contacts : require('lib/API.Contacts'),
            Calendar : '',
            FileSystem : require('lib/API.FileSystem'),
            DataBase : '',
            Log : '',
            Map : require('lib/API.Map'),
            Notification : require('lib/API.Notification'),
            Social : ''
        },
        HW : {
            Acceloremeter : require('lib/API.Accelerometer'),
            Battery : require('lib/API.Battery'),
            Camera : require('lib/API.Camera'),
            GeoLocation : '',
            Gesture : '',
            Media : require('lib/API.Media'),
            Network : require('lib/API.Network'),
            System : require('lib/API.System')
        }
    };

    _self.events = {
        activeHandlers: {},
        availableEvents: {},
        publicEvents: {}
    };

    var _initEvents = function _initEvents() {
        var key, eventId, eventData, enventId;

        /* TODO new class eventData
         * API.Example.events = {
         *      'publicEventName': {
         *          event: 'titaniumeventname',
         *          listener: Ti.thePathToTitModule
         *      }
         * };
         */

        for (key in _self.SW) {
            if (_self.SW[key].events) {
                for (eventId in _self.SW[key].events) {
                    eventData = _self.SW[key].events[eventId];
                    if (eventData.dummy) {
                        _self.events.availableEvents[eventId] = {
                            keylist: eventData.keylist,
                            event: eventData.event,
                            listener: _self.SW[key],
                            source: eventData.source,
                            dummy: true
                        };
                    } else {
                        _self.events.availableEvents[eventId] = {
                            keylist: eventData.keylist,
                            event: eventData.event,
                            listener: eventData.listener,
                            source: eventData.source
                        };
                    }
                    //_self.events.publicEvents[eventData.event] = eventId;
                    if (_self.events.publicEvents[eventData.source] == null) {
                        _self.events.publicEvents[eventData.source] = {};
                    }
                    _self.events.publicEvents[eventData.source][eventData.event] = eventId;
                    }
            }
        }
        for (key in _self.HW) {
            if (_self.HW[key].events) {
                for (eventId in _self.HW[key].events) {
                    eventData = _self.HW[key].events[eventId];
                    if (eventData.dummy) {
                        _self.events.availableEvents[eventId] = {
                            keylist: eventData.keylist,
                            event: eventData.event,
                            listener: _self.HW[key],
                            source: eventData.source,
                            dummy: true
                        };
                    } else {
                        _self.events.availableEvents[eventId] = {
                            keylist: eventData.keylist,
                            event: eventData.event,
                            listener: eventData.listener,
                            source: eventData.source
                        };
                    }
                    //_self.events.publicEvents[eventData.event] = eventId;
                    if (_self.events.publicEvents[eventData.source] == null) {
                        _self.events.publicEvents[eventData.source] = {};
                    }
                    _self.events.publicEvents[eventData.source][eventData.event] = eventId;
                }
            }
        }
    };

    /** Transport to html a internal event
     * @param: {eventName} the name of the Titanium event.
     * @param: {data} event data.
     * @return : Bool true if success or false if error*/
    _self.events.fireHTMLEvents = function fireHTMLEvents(data) {
        var key, viewId, result;

        if (_self.events.activeHandlers[data.publicEvent]) {
            /*
             TODO: other way... maybe more efficient
            for (key in _self.events.activeHandlers[publicEvent].views) {
                viewId = _self.events.activeHandlers[publicEvent].views[key];
                // This event must be send to each view
                evaljs...
            }*/
            eventcounter[data.publicEvent] ++;
            // for all events with timestamp
            if (data.timestamp != null && (data.timestamp - eventControl[data.publicEvent]) < 500){
                // discart event to improve
            } else {
                // TODO: only for debug
                console.log('[API]---------> new event: ' + data.publicEvent + ' counter: ' + eventcounter[data.publicEvent] + '; data: ' + JSON.stringify(data));
                Ti.App.fireEvent(data.publicEvent, data);
            }
            result = true;
        } else {
            result = false;
        }
        return result;
    };
    // Create new handler
    _self.eventHandler = function(e) {
        var i;
        var data = {};
        var publicEvent = _self.events.publicEvents[e.source.apiName][e.type];
        data['publicEvent'] = publicEvent;
        for (i = 0; i < _self.events.availableEvents[publicEvent].keylist.length; i++) {
            data[_self.events.availableEvents[publicEvent].keylist[i]] = e[_self.events.availableEvents[publicEvent].keylist[i]];
        }
        _self.events.fireHTMLEvents(data);
    };
    /** AddEventListener from a HTML view (througth APICommons.js TODO)
     * @param: {publicEvent} the public html name for the event.
     * @param: {viewId} the id of the interested html view.
     * @return : Bool true if success or false if error*/
    _self.events.addEventListener = function addEventListener(publicEvent, viewId, entityId) {
        var eventData;

        eventData = _self.events.availableEvents[publicEvent];
        if (!eventData) {
            // Public event doesn't exist
            return false;
        }
        if (typeof _self.events.activeHandlers[publicEvent] !== 'undefined') {
            // Main listener active yet
            _self.events.activeHandlers[publicEvent].nlisteners += 1;
            if (_self.events.activeHandlers[publicEvent].views[viewId] !== 0) {
                _self.events.activeHandlers[publicEvent].views[viewId] = 0;
            }
            _self.events.activeHandlers[publicEvent].views[viewId] += 1;
        } else {
            // Inicialize handler for this event
            _self.events.activeHandlers[publicEvent] = {
                nlisteners: 1,
                views: {}
            };
            Ti.API.info('[API.addEventListener] event: ' + publicEvent + ', privateEvent: ' + _self.events.availableEvents[publicEvent].event, ', entityId: ' + entityId + ', isDummy?: ' + _self.events.availableEvents[publicEvent].dummy);
            eventcounter[publicEvent] = 0;
            if (_self.events.availableEvents[publicEvent].listener === 'accelerometer') {
                // Accelerometer is special.
                Ti.Accelerometer.addEventListener(_self.events.availableEvents[publicEvent].event, _self.eventHandler);
            } else if (_self.events.availableEvents[publicEvent].dummy) {
                // Special Dummy events. This events depends of Titnaium Objects
                Ti.API.info('[API.addEventListener] special event for dummy: ' + publicEvent + ', privateEvent: ' + _self.events.availableEvents[publicEvent].event, ', entityId: ' + entityId);
                _self.events.availableEvents[publicEvent].listener.addEventListener(_self.events.availableEvents[publicEvent].event, _self.eventHandler, entityId);
            } else {
                _self.events.availableEvents[publicEvent].listener.addEventListener(_self.events.availableEvents[publicEvent].event, _self.eventHandler);
            }
            _self.events.activeHandlers[publicEvent].views[viewId] = 1;
        }
    };

    /** RemoveEventListener from a HTML view (througth APICommons.js TODO)
     * @param: {publicEvent} the public html name for the event.
     * @param: {viewId} the id of the interested html view.
     * @return : Bool true if success or false if error*/
    _self.events.removeEventListener = function removeEventListener(publicEvent, viewId, entityId) {
        var eventData;

        eventData = _self.events.availableEvents[publicEvent];
        if (!eventData || !_self.events.activeHandlers[publicEvent]) {
            // Public event doesn't exist
            return false;
        }

        _self.events.activeHandlers[publicEvent].nlisteners -= 1;
        _self.events.activeHandlers[publicEvent].views[viewId] -= 1 ;
        if (_self.events.availableEvents[publicEvent].listener === 'accelerometer') {
            // Accelerometer is special.
            Ti.Accelerometer.removeEventListener(_self.events.availableEvents[publicEvent].event, _self.eventHandler);
        } else {
            Ti.API.info('[API.removeEventListener] special event: ' + publicEvent + ', privateEvent' + _self.events.availableEvents[publicEvent].event, ', entityId: ' + entityId);
            _self.events.availableEvents[publicEvent].listener.removeEventListener(_self.events.availableEvents[publicEvent].event, _self.eventHandler, entityId);
        }
        if (_self.events.activeHandlers[publicEvent].nlisteners == 0) {
            delete _self.events.activeHandlers[publicEvent];
        }
    };

    /** Handler for the events from a HTML view througth APICommons.js
     * @param: {data} data = {
     *     'action': 'addEventListener'/'removeEventListener',
     *     'viewId': viewId,
     *     'entityId': entityId optional param. the Titanium Object ID.
     * }
     **/
    _self.events.APIEventHandler = function APIEventHandler(data) {
        Ti.API.info('[API.APIEventHandler]: ' + data + ', entityId: ' + data.entityId, ', viewId: ' + data.viewId + ', event: ' + data.event);
        if (data.action === 'addEventListener') {
            _self.events.addEventListener(data.event, data.viewId, data.entityId);
        } else if (data.action === 'removeEventListener') {
            _self.events.removeEventListener(data.event, data.viewId, data.entityId);
        }
    };

    /** Handler for the API methods invocations from a HTML view througth APICommons.js
     * @param: {data} data = {
     *     'method': 'API.Example.getBlabla',
     *     'params': [param],
     *     'options': {},
     *     'eventName': eventName
     * }
     **/
    _self.events.APIMethodHandler = function APIMethodHandler(data) {
        var result;
        Ti.API.info('[API.APIMethodHandler] Method event recieved: ' + JSON.stringify(data));
        Ti.API.info('[API.APIMethodHandler] Params:' + JSON.stringify(data.params));
        Ti.API.info('[API.APIMethodHandler] Options:' + JSON.stringify(data.options));
        if (data.method !== null && data.params == null && data.options == null) {
            try {
                result = _self[data.method.type][data.method.subapi][data.method.name]();
            } catch (e) {
                // TODO
                Ti.API.info('[----- ¡¡API METHOD ERROR!!] ' + e);
            }
        } else if (data.method !== null && data.params !== null) {
            if (data.options !== null) {
                data.params.push(data.options);
            }
            try {
                result = _self[data.method.type][data.method.subapi][data.method.name].apply(null, data.params);
            } catch (e) {
                // TODO
                Ti.API.info('[----- ¡¡API METHOD ERROR!!] ' + e);
            }
        } else {
            // Error. Method doesn't exist
            result = "Error. Unknown API method";
        }
        Ti.API.info('[API.APIMethodHandler] Setting method event from aPI to Bridge: ' + data.method.eventName + '_' + data.viewId + '_' + data.callId);
        Ti.API.info('[API.APIMethodHandler] data: ' + JSON.stringify(result));
        Ti.App.fireEvent(data.method.eventName + '_' + data.viewId + '_' + data.callId, {'returnedData': result});
    };

    _self.events.APIMethodAsyncHandler = function APIMethodAsyncHandler(data) {
        var result;

        Ti.API.info('[API.APIMethodAsyncHandler] Async Method event recived: ' + JSON.stringify(data));
        Ti.API.info('[API.APIMethodAsyncHandler] Params:' + JSON.stringify(data.params));
        Ti.API.info('[API.APIMethodAsyncHandler] Options:' + JSON.stringify(data.options));
        var genericHandler = function(initialData, result) {
            Ti.App.fireEvent(data.method.eventName + '_' + data.viewId + '_' + data.callId, result);
        };

        if (data.method !== null && data.params.length === 0) {
            _self[data.method.type][data.method.subapi][data.method.name](function(result) {
                Ti.API.info('[API.APIMethodAsyncHandler] Setting method event from aPI to Bridge: :' + data.method.eventName + '_' + data.viewId + '_' + data.callId);
                Ti.App.fireEvent(data.method.eventName + '_' + data.viewId + '_' + data.callId, result);
            });
        } else if (data.method !== null) {
            if (data.options !== null) {
                data.params.push(data.options);
            }
            _self[data.method.type][data.method.subapi][data.method.name](function(result) {
                Ti.API.info('[API.APIMethodAsyncHandler] Setting method event from aPI to Bridge: :' + data.method.eventName + '_' + data.viewId + '_' + data.callId);
                Ti.App.fireEvent(data.method.eventName + '_' + data.viewId + '_' + data.callId, result);
            }, data.params);
        } else {
            // Error. Method doesn't exist
            result = "Error. Unknown API method";
        }
    };

    _self.init = function init() {
        _initEvents(_self);
        Ti.App.addEventListener('APIEvent', _self.events.APIEventHandler);
        Ti.App.addEventListener('APIMethod', _self.events.APIMethodHandler);
        Ti.App.addEventListener('APIMethodAsync', _self.events.APIMethodAsyncHandler);
    };

    _self.init();

    return _self;

}());

module.exports = API;