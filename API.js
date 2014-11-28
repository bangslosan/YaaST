/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 * API Team
 *
 *  Alejandro F.Carrera
 *  Carlos Blanco Vallejo
 *  Santiago Blanco Ventas
 *  Alejandro Vera De Juan
 *
 */

'use strict';

/** 
 * Yaast API.
 * @class
 */
var API = (function() {

    //TODO: only for debug
    var eventcounter = {};

    /** YaaST API.
     * @version 1.0.0
     * @alias API
     * @namespace */

    var self = {
        SW: {},
        HW: {}
    };

    self.HW.System = require('lib/API.System');
    self.HW.UI = require('lib/API.UI')(self);
    self.HW.Network = require('lib/API.Network')(self);
    self.SW.FileSystem = require('lib/API.FileSystem');
    self.SW.Contacts = require('lib/API.Contacts')(self);
    self.SW.Utils = require('lib/API.Utils')(self);
    self.HW.Media = require('lib/API.Media')(self);
    self.SW.Notification = require('lib/API.Notification')(self);
    self.SW.Calendar = '';
    self.SW.DataBase = '';
    self.SW.Map = require('lib/API.Map');
    self.SW.Social = '';
    self.HW.Acceloremeter = require('lib/API.Accelerometer');
    self.HW.Battery = require('lib/API.Battery');
    self.HW.Camera = require('lib/API.Camera')(self);
    self.HW.GeoLocation = '';
    self.HW.Gesture = '';

    var events = {
        activeHandlers: {},
        availableEvents: {},
        publicEvents: {}
    };

    var initEvents = function initEvents() {
        var key, eventId, eventData, enventId;

        /* TODO new class eventData
         * API.Example.events = {
         *      'publicEventName': {
         *          event: 'titaniumeventname',
         *          listener: Ti.thePathToTitModule
         *      }
         * };
         */

        for (key in self.SW) {
            if (self.SW[key].events) {
                for (eventId in self.SW[key].events) {
                    eventData = self.SW[key].events[eventId];
                    if (typeof eventData.source === 'undefined') {
                        Ti.API.info('[API._initEvents] Error. event source undefined. self.SW.' + key + '.events.' + eventId + ' = ' + JSON.stringify(eventData));
                        continue;
                    } else {
                        if (eventData.dummy) {
                            events.availableEvents[eventId] = {
                                keylist: eventData.keylist,
                                event: eventData.event,
                                listener: self.SW[key],
                                source: eventData.source,
                                dummy: true
                            };
                        } else {
                            events.availableEvents[eventId] = {
                                keylist: eventData.keylist,
                                event: eventData.event,
                                listener: eventData.listener,
                                source: eventData.source
                            };
                        }
                        //events.publicEvents[eventData.event] = eventId;
                        if (events.publicEvents[eventData.source] == null) {
                            events.publicEvents[eventData.source] = {};
                        }
                        events.publicEvents[eventData.source][eventData.event] = eventId;
                    }
                }
            }
        }
        for (key in self.HW) {
            if (self.HW[key].events) {
                for (eventId in self.HW[key].events) {
                    eventData = self.HW[key].events[eventId];
                    if (typeof eventData.source === 'undefined') {
                        Ti.API.info('[API._initEvents] Error. event source undefined. self.HW.' + key + '.events.' + eventId + ' = ' + JSON.stringify(eventData));
                        continue;
                    } else {
                        if (eventData.dummy) {
                            events.availableEvents[eventId] = {
                                keylist: eventData.keylist,
                                event: eventData.event,
                                listener: self.HW[key],
                                source: eventData.source,
                                dummy: true
                            };
                        } else {
                            events.availableEvents[eventId] = {
                                keylist: eventData.keylist,
                                event: eventData.event,
                                listener: eventData.listener,
                                source: eventData.source
                            };
                        }
                        //events.publicEvents[eventData.event] = eventId;
                        if (events.publicEvents[eventData.source] == null) {
                            events.publicEvents[eventData.source] = {};
                        }
                        events.publicEvents[eventData.source][eventData.event] = eventId;
                    }
                }
            }
        }
    };

    /** Transport to html a internal event
     * @param: {eventName} the name of the Titanium event.
     * @param: {data} event data.
     * @return : Bool true if success or false if error*/
    events.fireHTMLEvents = function fireHTMLEvents(data) {
        var key, viewId, result;

        if (events.activeHandlers[data.publicEvent]) {
            /*
             TODO: other way... maybe more efficient
            for (key in events.activeHandlers[publicEvent].views) {
                viewId = events.activeHandlers[publicEvent].views[key];
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
                console.log('[API] event fired');
            }
            result = true;
        } else {
            result = false;
        }
        return result;
    };
    // Create new handler
    var eventHandler = function(e) {
        var i;
        var data = {};
        var publicEvent = events.publicEvents[e.source.apiName][e.type];
        data['publicEvent'] = publicEvent;
        for (i = 0; i < events.availableEvents[publicEvent].keylist.length; i++) {
            data[events.availableEvents[publicEvent].keylist[i]] = e[events.availableEvents[publicEvent].keylist[i]];
        }
        events.fireHTMLEvents(data);
    };
    /** AddEventListener from a HTML view (througth APICommons.js TODO)
     * @param: {publicEvent} the public html name for the event.
     * @param: {viewId} the id of the interested html view.
     * @return : Bool true if success or false if error*/
    events.addEventListener = function addEventListener(publicEvent, viewId, entityId, dummy) {
        var eventData;

        eventData = events.availableEvents[publicEvent];
        if (!eventData) {
            // Public event doesn't exist
            return false;
        }
        if (typeof events.activeHandlers[publicEvent] !== 'undefined') {
            // Main listener active yet
            events.activeHandlers[publicEvent].nlisteners += 1;
            if (events.activeHandlers[publicEvent].views[viewId] !== 0) {
                events.activeHandlers[publicEvent].views[viewId] = 0;
            }
            events.activeHandlers[publicEvent].views[viewId] += 1;
        } else {
            // Inicialize handler for this event
            events.activeHandlers[publicEvent] = {
                nlisteners: 1,
                views: {}
            };
            Ti.API.info('[API.addEventListener] event: ' + publicEvent + ', privateEvent: ' + events.availableEvents[publicEvent].event, ', entityId: ' + entityId + ', dummy: ' + dummy + ', isDummy?: ' + events.availableEvents[publicEvent].dummy);
            eventcounter[publicEvent] = 0;
            if (events.availableEvents[publicEvent].listener === 'accelerometer') {
                // Accelerometer is special.
                Ti.Accelerometer.addEventListener(events.availableEvents[publicEvent].event, eventHandler);
            } else if (events.availableEvents[publicEvent].dummy) {
                // Special Dummy events. This events depends of Titnaium Objects
                Ti.API.info('[API.addEventListener] special event for dummy: ' + publicEvent + ', privateEvent: ' + events.availableEvents[publicEvent].event, ', entityId: ' + entityId + ', dummy: ' + dummy);
                events.availableEvents[publicEvent].listener.addEventListener(events.availableEvents[publicEvent].event, eventHandler, entityId, dummy);
            } else {
                events.availableEvents[publicEvent].listener.addEventListener(events.availableEvents[publicEvent].event, eventHandler);
            }
            events.activeHandlers[publicEvent].views[viewId] = 1;
        }
    };

    /** RemoveEventListener from a HTML view (througth APICommons.js TODO)
     * @param: {publicEvent} the public html name for the event.
     * @param: {viewId} the id of the interested html view.
     * @return : Bool true if success or false if error*/
    events.removeEventListener = function removeEventListener(publicEvent, viewId, entityId, dummy) {
        var eventData;

        eventData = events.availableEvents[publicEvent];
        if (!eventData || !events.activeHandlers[publicEvent]) {
            // Public event doesn't exist
            return false;
        }

        events.activeHandlers[publicEvent].nlisteners -= 1;
        events.activeHandlers[publicEvent].views[viewId] -= 1 ;
        if (events.availableEvents[publicEvent].listener === 'accelerometer') {
            // Accelerometer is special.
            Ti.Accelerometer.removeEventListener(events.availableEvents[publicEvent].event, eventHandler);
        } else {
            Ti.API.info('[API.removeEventListener] special event: ' + publicEvent + ', privateEvent' + events.availableEvents[publicEvent].event + ', entityId: ' + entityId + ', dummy: ' + dummy);
            events.availableEvents[publicEvent].listener.removeEventListener(events.availableEvents[publicEvent].event, eventHandler, entityId, dummy);
        }
        if (events.activeHandlers[publicEvent].nlisteners == 0) {
            delete events.activeHandlers[publicEvent];
        }
    };

    /** Handler for the events from a HTML view througth APICommons.js
     * @param: {data} data = {
     *     'action': 'addEventListener'/'removeEventListener',
     *     'viewId': viewId,
     *     'entityId': entityId optional param. the Titanium Object ID.
     *     'dummy': dummy name optional param.
     * }
     **/
    events.APIEventHandler = function APIEventHandler(data) {
        Ti.API.info('[API.APIEventHandler]: entityId: ' + data.entityId, ', viewId: ' + data.viewId + ', event: ' + data.event + ', dummy: ' + data.dummy);
        if (data.action === 'addEventListener') {
            events.addEventListener(data.event, data.viewId, data.entityId, data.dummy);
        } else if (data.action === 'removeEventListener') {
            events.removeEventListener(data.event, data.viewId, data.entityId, data.dummy);
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
    events.APIMethodHandler = function APIMethodHandler(data) {
        var result;
        Ti.API.info('[API.APIMethodHandler] Method event recieved: ' + JSON.stringify(data));
        Ti.API.info('[API.APIMethodHandler] Params:' + JSON.stringify(data.params));
        Ti.API.info('[API.APIMethodHandler] Options:' + JSON.stringify(data.options));
        if (data.method !== null && data.params == null && data.options == null) {
            try {
                result = self[data.method.type][data.method.subapi][data.method.name]();
            } catch (e) {
                // TODO
                Ti.API.info('[----- ¡¡API METHOD ERROR!!] ' + e);
            }
        } else if (data.method !== null && data.params !== null) {
            if (data.options !== null) {
                data.params.push(data.options);
            }
            try {
                result = self[data.method.type][data.method.subapi][data.method.name].apply(null, data.params);
            } catch (e) {
                // TODO
                Ti.API.info('[----- ¡¡API METHOD ERROR!!] ' + e);
            }
        } else {
            // Error. Method doesn't exist
            result = "Error. Unknown API method";
        }
        Ti.API.info('[API.APIMethodHandler] Sending method event from API to Bridge: ' + data.method.eventName + '_' + data.viewId + '_' + data.callId);
        Ti.API.info('[API.APIMethodHandler] data: ' + JSON.stringify(result));
        Ti.App.fireEvent(data.method.eventName + '_' + data.viewId + '_' + data.callId, {'returnedData': result});
    };

    events.APIMethodAsyncHandler = function APIMethodAsyncHandler(data) {
        var result;

        Ti.API.info('[API.APIMethodAsyncHandler] Async Method event recived: ' + JSON.stringify(data));
        Ti.API.info('[API.APIMethodAsyncHandler] Params:' + JSON.stringify(data.params));
        Ti.API.info('[API.APIMethodAsyncHandler] Options:' + JSON.stringify(data.options));
        var genericHandler = function(initialData, result) {
            Ti.App.fireEvent(data.method.eventName + '_' + data.viewId + '_' + data.callId, result);
        };

        if (data.method !== null && data.params.length === 0) {
            self[data.method.type][data.method.subapi][data.method.name](function(result) {
                Ti.API.info('[API.APIMethodAsyncHandler] Setting method event from aPI to Bridge: :' + data.method.eventName + '_' + data.viewId + '_' + data.callId);
                Ti.App.fireEvent(data.method.eventName + '_' + data.viewId + '_' + data.callId, result);
            });
        } else if (data.method !== null) {
            if (data.options !== null) {
                data.params.push(data.options);
            }
            self[data.method.type][data.method.subapi][data.method.name](function(result) {
                Ti.API.info('[API.APIMethodAsyncHandler] Setting method event from aPI to Bridge: :' + data.method.eventName + '_' + data.viewId + '_' + data.callId);
                Ti.App.fireEvent(data.method.eventName + '_' + data.viewId + '_' + data.callId, result);
            }, data.params);
        } else {
            // Error. Method doesn't exist
            result = "Error. Unknown API method";
        }
    };

    var init = function init() {
        initEvents();
        Ti.App.addEventListener('APIEvent', events.APIEventHandler);
        Ti.App.addEventListener('APIMethod', events.APIMethodHandler);
        Ti.App.addEventListener('APIMethodAsync', events.APIMethodAsyncHandler);
    };

    init();

    return self;

}());

module.exports = API;