/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
'use strict';

var API = (function() {
    var _self;

    _self = {
        SW : {
            Contacts : require('lib/API.Contacts'),
            Calendar : '',
            FileSystem : require('lib/API.FileSystem'),
            DataBase : '',
            Log : '',
            Map : '',
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
        availableEvents: {}
    };

    var _initEvents = function _initEvents() {
        var key, eventId, publicName, eventData, enventId;

        /* TODO new class eventData
         * API.Example.events = {
         *      'publicEventName': {
         *          event: 'titaniumeventname',
         *          listener: Ti.thePathToMethod.addEventListener
         *      }
         * };
         */

        for (key in _self.SW) {
            if (_self.SW[key].events) {
                for (eventId in _self.SW[key].events) {
                    publicName = enventId;
                    eventData = _self.SW[key].events[eventId];
                    _self.events.availableEvents[publicName] = eventData;
                }
            }
        }
        for (key in _self.HW) {
            if (_self.HW[key].events) {
                for (eventId in _self.HW[key].events) {
                    publicName = enventId;
                    eventData = _self.HW[key].events[eventId];
                    _self.events.availableEvents[publicName] = eventData;
                }
            }
        }
    };

    /** Transport to html a internal event
     * @param: {eventName} the name of the Titanium event.
     * @param: {data} event data.
     * @return : Bool true if success or false if error*/
    var _fireHTMLEvents = function _fireHTMLEvents(eventName, data) {
        var key, viewId, result;

        if (_self.events.activeHandlers[eventName]) {
            for (key in _self.events.activeHandlers[eventName].views) {
                viewId = _self.events.activeHandlers[eventName].views[key];
                // This event will be received by all listeners API.Commons
                Ti.App.fireEvent(eventName, data);
            }
            result = true;
        } else {
            result = false;
        }
        return result;
    };

    /** AddEventListener from a HTML view (througth APICommons.js TODO)
     * @param: {publicEvent} the public html name for the event.
     * @param: {viewId} the id of the interested html view.
     * @return : Bool true if success or false if error*/
    _self.events.addEventListener = function addEventListener(publicEvent, viewId) {
        var eventData, eventHandler;

        eventData = _self.events.availableEvents[publicEvent];
        if (!eventData) {
            // Public event doesn't exist
            return false;
        }
        if (_self.events.activeHandlers[publicEvent]) {
            // Main listener active yet
            _self.events.activeHandlers[publicEvent].nlisteners += 1;
            if (!_self.events.activeHandlers[publicEvent].views[viewId]) {
                _self.events.activeHandlers[publicEvent].views[viewId] = 0;
            }
            _self.events.activeHandlers[publicEvent].views[viewId] += 1 ;
        } else {
            // Create new handler
            eventHandler = function(theEvent, e) {
                _fireHTMLEvents.call(_self, theEvent, {
                        'level': e.level,
                        'state': e.state,
                        'type': e.type
                    }
                );
            }.bind(_self, publicEvent);

            // Inicialize handler for this event
            _self.events.availableEvents[publicEvent].listener.addEventListener(_self.events.availableEvents[publicEvent].event, eventHandler);
            _self.events.activeHandlers[publicEvent].handler = eventHandler;
            _self.events.activeHandlers[publicEvent].nlisteners = 1;
            _self.events.activeHandlers[publicEvent].views = {};
            _self.events.activeHandlers[publicEvent].views[viewId] = 1;
        }
    };

    /** RemoveEventListener from a HTML view (througth APICommons.js TODO)
     * @param: {publicEvent} the public html name for the event.
     * @param: {viewId} the id of the interested html view.
     * @return : Bool true if success or false if error*/
    _self.events.RemoveEventListener = function RemoveEventListener(publicEvent, viewId) {
        var eventData, eventHandler;

        eventData = _self.events.availableEvents[publicEvent];
        if (!eventData || !_self.events.activeHandlers[publicEvent]) {
            // Public event doesn't exist
            return false;
        }

        _self.events.activeHandlers[publicEvent].nlisteners -= 1;
        _self.events.activeHandlers[publicEvent].views[viewId] -= 1 ;
        _self.events.availableEvents[publicEvent].listener.removeEventListener(_self.events.availableEvents[publicEvent].event, _self.events.activeHandlers[publicEvent].handler);
    };

    /** Handler for the events from a HTML view througth APICommons.js
     * @param: {data} data = {
     *     'action': 'addEventListener'/'removeEventListener',
     *     'viewId': viewId
     * }
     **/
    _self.events.APIEventHandler = function APIEventHandler(data) {

        if (data.action === 'addEventListener') {
            _self.events.addEventListener(data.event, data.viewId);
        } else if (data.action === 'removeEventListener') {
            _self.events.removeEventListener(data.event, data.viewId);
        }
    };

    /** Handler for the API methods invocations from a HTML view througth APICommons.js
     * @param: {data} data = {
     *     'method': 'API.Example.getBlabla',
     *     'params': [param],
     *     'eventName': eventName
     * }
     **/
    _self.events.APIMethodHandler = function APIMethodHandler(data) {
        console.log('____APIMethodHandler------ data: ' + JSON.stringify(data));
        var result;
        Ti.API.info('____Evento recibido en API: ' + JSON.stringify(data));
        Ti.API.info('____Con los parámetros:' + JSON.stringify(data.params));
        Ti.API.info('____Con las opciones:' + JSON.stringify(data.options));
        if (data.method !== null && data.params == null && data.options == null) {
            result = _self[data.method.type][data.method.subapi][data.method.name]();
        } else if (data.method !== null && data.params !== null) {
            if (data.options !== null) {
                data.params.push(data.options);
            }
            result = _self[data.method.type][data.method.subapi][data.method.name].apply(null, data.params);
        } else {
            // Error. Method doesn't exist
            result = "Error. Unknown API method";
        }
        Ti.API.info('____Evento de vuelta  deste API: ' + data.method.eventName + '_' + data.viewId + '_' + data.callId);
        Ti.API.info('____con los datos: ' + result);
        var resultStringi = JSON.stringify(result);
        Ti.API.info('____stringificados: ' + resultStringi);
        Ti.App.fireEvent(data.method.eventName + '_' + data.viewId + '_' + data.callId, {'returnedData': result});
    };

    _self.events.APIMethodAsyncHandler = function APIMethodAsyncHandler(data) {
        var result;

        var genericHandler = function(initialData, result) {
            Ti.App.fireEvent(data.method.eventName + '_' + data.viewId + '_' + data.callId, result);
        };

        if (data.method !== null && data.params == null) {
            _self[data.method.type][data.method.subapi][data.method.name](genericHandler.bind(_self, data));
        } else if (data.method !== null && data.params !== null) {
            result = _self[data.method.type][data.method.subapi][data.method.name](genericHandler.bind(_self, data), data.params);
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