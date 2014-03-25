/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

(function () {

    "use strict";

    var eventHandlers = {};
    var methodHandlers = {};
    // TODO: When titanium load, will replace "var id = null" with the correct id value. This line must be unique in this file.
    var appleOS = ;
    var id = 69;
    var prefs = null;
    var inputs = {};
    var callCounter = 0;

    var _genericMethodHandler = function _genericMethodHandler(callback, methName, params, options, isAsync) {
        var methodInfo, data;

        /*Ti.API.info('[APIBridge] callback: ' + callback);
        Ti.API.info('[APIBridge] methName: ' + methName);
        Ti.API.info('[APIBridge] params: ' + JSON.stringify(params));
        Ti.API.info('[APIBridge] options: ' + JSON.stringify(options));
        Ti.API.info('[APIBridge] isAsync: ' + isAsync);*/

        if (methodHandlers[methName] == null) {
            methodHandlers[methName] = {};
        }

        callCounter = callCounter + 1;
        methodHandlers[methName][callCounter] = callback;

        methodInfo = methName.split('.');

        Ti.API.info('[APIBridge] Adding method listener: ' + methName + '_' + id + '_' + callCounter);
        Ti.App.addEventListener(methName + '_' + id + '_' + callCounter, _sendMethodResult.bind(this, methName, callCounter));

        data = {
        'method': {
            type: methodInfo[1],
            subapi: methodInfo[2],
            name: methodInfo[3],
            eventName: methName
        },
        'params': params,
        'options': options,
        'viewId': id,
        'callId': callCounter
        };


        if (!isAsync) {
            Ti.API.info('[APIBridge] Fire Event "APIMethod". data: ' + JSON.stringify(data));
            Ti.App.fireEvent('APIMethod', data);
        } else {
            Ti.API.info('[APIBridge] Fire Event "APIMethodAsync". data: ' + JSON.stringify(data));
            Ti.App.fireEvent('APIMethodAsync', data);
        }
    };

    var _sendMethodResult = function (methName, callCounter, data) {
        Ti.API.info('++++++++++++[APIBridge]+++++++++++++ HTML!!!');
        Ti.API.info('[APIBridge] Method result recived: ' + JSON.stringify(data.returnedData));
        //Ti.API.info('parseados?: ' + JSON.parse(data));
        if (methodHandlers[methName] == null || methodHandlers[methName][callCounter] == null) {
            // TODO Error. Callback not found
            Ti.API.info('[APIBridge] error in _sendMethodResult Callback not found');
        } else {
            // This solve iOs problem and i dont know why this run in Android without this fixed
            if (data.returnedData === undefined) {
                data.returnedData = null;
            }
            // Execute callback
            Ti.API.info('[APIBridge] invocando callback html...');
            methodHandlers[methName][callCounter](data.returnedData);
        }
    };

    // APIBridge definition
    Object.defineProperty(window, 'API', {value: {
                SW : {
                    Contacts : {
                        /** Get Authorization Property
                          * Condition AUTHORIZATION_UNKNOWN -> RequestAuthorization
                          * @param {function} Callback
                          * @return : AUTHORIZATION_AUTHORIZED or AUTHORIZATION_RESTRICTED */
                        getAuthorization: function(callback) {
                            _genericMethodHandler.call(this, callback, 'API.SW.Contacts.getAuthorization', [], null, true);
                        },
                        /** Get Contact List
                            * @param {function} Callback
                            * @param {Object} {'name': String} optional
                            * @return [contact] */
                        getContactList: function(callback, options) {
                            if (!(options instanceof Object) || options.value == null) {
                                options = null;
                            }
                            _genericMethodHandler.call(this, callback, 'API.SW.Contacts.getContactList', [], options);
                        },
                         /** Create Contact
                          * @param {function} Callback
                          * @param {Object}
                          * @return {Object} */
                        createContact: function(callback, options) {
                            if (!(options instanceof Object)) {
                                options = null;
                            }
                            _genericMethodHandler.call(this, callback, 'API.SW.Contacts.createContact', [], options);
                        },
                        /** Save Changes
                          * @param {function} Callback  */
                        saveChanges: function(callback) {
                            _genericMethodHandler.call(this, callback, 'API.SW.Contacts.saveChanges');
                        },
                        /** Revert Changes from last save
                          * @param {function} Callback  */
                        revertChanges: function(callback) {
                            _genericMethodHandler.call(this, callback, 'API.SW.Contacts.revertChanges');
                        },
                        /** Delete Contact
                          * @param {function} Callback
                          * @param {String} Contact Name
                          * @return {Number} */
                        deleteContact: function(callback, contactName) {
                            if (typeof contactName === "string") {
                                _genericMethodHandler.call(this, callback, 'API.SW.Contacts.deleteContact', [contactName]);
                            }
                        },
                    },
                    Calendar : {

                    },
                    FileSystem : {

                    },
                    DataBase : {

                    },
                    Log : {

                    },
                    Map : {

                    },
                    Notification : {
                        /** Create Toast Notification
                         * @param {function} Callback
                         * @param {String} message
                         * @param {Object} options {
                         *          height: {Number}            -default = 100
                         *          opacity: {Number}           -default = 1 [0 .. 1]
                         *          borderColor: {String}       -default = #D3D3D3
                         *          borderWidth: {Number}       -default = 1
                         *          borderRadius: {Number}      -default = 5
                         *          backgroundColor: {String}   -default = #E6E6E6
                         *          fontSize: {Number}          -default = 16
                         *          fontWeight: {String}        -default = normal ['bold', 'normal']
                         *          textColor: {String}         -default = #000000
                         *      }
                         * @return {String} JSON Information of Notification created */
                        createNotification: function (callback, msg, options) {
                            if (typeof msg !== 'string') {
                                // TODO definir formato de errores HTML
                                throw new Error('createNotification ERROR. msg param must be String type');
                            }
                            if (!(options instanceof Object)) {
                                options = null;
                            }
                            _genericMethodHandler.call(this, callback, 'API.SW.Notification.createNotification', [msg], options);
                        },
                    },
                    Social : {

                    },
                },
                HW : {
                    Acceloremeter : {

                    },
                    Battery : {

                    },
                    Camera : {

                    },
                    GeoLocation : {

                    },
                    Gesture : {

                    },
                    Media : {

                            /* VIDEO TODO */
                            /** Opens the photo gallery image picker.
                              * @param {function} Callback
                              * @param {Object} {'name': String} optional
                              * @return {Number} */
                            openPhotoGallery : function openPhotoGallery(callback, options) {
                            if (!(callback instanceof Function)) {
                                return false;
                            }
                            if (!(options instanceof Object)) {
                                options = null;
                            }
                                _genericMethodHandler.call(this, callback, 'API.SW.Media.openPhotoGallery', [], options);
                            },
                            /** Takes a screen shot of the visible UI on the device. This method is
                             *  asynchronous.
                             * @param {screenSotCallback} callback that will receive screenshot image as Blob object */
                            takeScreenshot : function takeScreenshot(callback) {
                                _genericMethodHandler.call(this, callback, 'API.SW.Media.takeScreenshot', [callback], null, true);
                            },
                            /** Takes a screen shot of the visible UI on the device. This method is
                             *  asynchronous.
                             * @param {pattern} [Number[]=[100, 300, 100, 200, 100, 50]] optional vibrate pattern only available for Android.*/
                            vibrate : function vibrate(pattern) {
                                if (Ti.App.isApple || pattern == null || !(pattern instanceof Array)) {
                                    Titanium.Media.vibrate();
                                }
                                // pattern only available for Android
                                Titanium.Media.vibrate(pattern);
                            },
                            /** Create new AudioPlayer
                             * @param {audioPlayerOptions} options
                             * @return {Object} audioPlayer Dummy*/
                            createAudioPlayer : function createAudioPlayer(options) {
                                return new dummyAudioPlayer(options, this);
                            }
                    },
                    Network : {

                    },
                    System : {
                        /** Get device platform
                          * @param {function} Callback
                          * @param {String} Contact Name
                          * @return : String ('ios', 'android') */
                        getDeviceOs: function(callback) {
                            _genericMethodHandler.call(this, callback, 'API.HW.System.getDeviceOs');
                        },
                        /** Get System's OS version.
                          * @param {function} Callback
                          * @return : String */
                        getVersion: function(callback) {
                            _genericMethodHandler.call(this, callback, 'API.HW.System.getVersion');
                        },
                        /** Get device's Model.
                          * @param {function} Callback
                          * @return : String */
                        getModel: function(callback) {
                            _genericMethodHandler.call(this, callback, 'API.HW.System.getModel');
                        },
                        /** Get System's processor architecture.
                          * @param {function} Callback
                          * @return : String */
                        getArchitecture: function(callback) {
                            _genericMethodHandler.call(this, callback, 'API.HW.System.getArchitecture');
                        },
                        /** Get available memory
                          * @param {function} Callback
                          * @return : Int (Bytes)*/
                        getAvailableMemory: function (callback) {
                            _genericMethodHandler.call(this, callback, 'API.HW.System.getAvailableMemory');
                        },

                        /** Get short name of the JavaScript runtime in use.
                          * @param {function} Callback
                          * @return : String */
                        getJsRuntime: function(callback) {
                            _genericMethodHandler.call(this, callback, 'API.HW.System.getJsRuntime');
                        },

                        /** Get the manufacturer of the device.
                          * @param {function} Callback
                          * @return : String */
                        getManufacturer: function(callback) {
                            _genericMethodHandler.call(this, callback, 'API.HW.System.getManufacturer');
                        },

                        /** Get the number of processing cores.
                          * @param {function} Callback
                          * @return : String */
                        getProcessorCount: function(callback) {
                            _genericMethodHandler.call(this, callback, 'API.HW.System.getProcessorCount');
                        },

                        /** Get system name
                          * @param {function} Callback
                          * @return : String */
                        getUsername: function(callback) {
                            _genericMethodHandler.call(this, callback, 'API.HW.System.getUsername');
                        },

                        /** Get system's default language.
                          * @param {function} Callback
                          * @return : String */
                        getLocale: function() {
                            _genericMethodHandler.call(this, callback, 'API.HW.System.getLocale');
                        },
                    },
                }
            }
    });

// EVENTS
    var _invokeEventCallbacks = function (data) {
            var i;
            var publicEvent = data.publicEvent;

            Ti.API.info('[APIBridge] Invoke HTML callbacks for event: ' + publicEvent + ' with data:' + JSON.stringify(data));

            if (eventHandlers[publicEvent] !== null || eventHandlers[publicEvent].length > 0) {
                for (i = 0; i < eventHandlers[publicEvent].length; i ++) {
                    Ti.API.info('[APIBridge] invocando event callback html ' + publicEvent);
                    eventHandlers[publicEvent][i](data);
                }
            } else {
                // TODO Error. Callback not found
                Ti.API.info('[APIBridge] error in _invokeEventCallbacks ' + publicEvent);
            }
    };

    Object.defineProperty(window.API, 'addEventListener', {
        value: function addEventListener(publicEvent, handler) {
            Ti.API.info('[APIBridge] addeventlistener de ' + publicEvent);
            if (eventHandlers[publicEvent] == null || eventHandlers[publicEvent].length <= 0) {
                // First event listener for this publicEvent
                eventHandlers[publicEvent] = [];
                Ti.API.info(' [APIBridge] eventHandlers[' + publicEvent + '].length : ' + eventHandlers[publicEvent].length);
                // Listen the event
                Ti.App.addEventListener(publicEvent, _invokeEventCallbacks);
            }
            eventHandlers[publicEvent].push(handler);
            Ti.API.info('[APIBridge] event handler added');
            Ti.API.info('[APIBridge] eventHandlers[' + publicEvent + '].length : ' + eventHandlers[publicEvent].length);

            // Subscribe this view to publicEvent
            Ti.App.fireEvent('APIEvent', {'action': 'addEventListener', 'event': publicEvent, 'viewId': id});
        }
    });

    Object.preventExtensions(window.API.addEventListener);

    Object.defineProperty(window.API, 'removeEventListener', {
        value: function removeEventListener(publicEvent, handler) {
            var index;

            Ti.API.info('[APIBridge] eventHandlers[' + publicEvent + '].length : ' + eventHandlers[publicEvent].length);
            if (eventHandlers[publicEvent] == null || eventHandlers[publicEvent].length <= 0) {
                return false;
            }
            index = eventHandlers[publicEvent].indexOf(handler);
            eventHandlers[publicEvent].splice(index, 1);
            Ti.API.info('[APIBridge] event handler removed');
            Ti.API.info('[APIBridge] eventHandlers[' + publicEvent + '].length : ' + eventHandlers[publicEvent].length);
            // remove listener
            Ti.App.removeEventListener(publicEvent, _invokeEventCallbacks);

            // Unsubscribe this view to publicEvent
            Ti.App.fireEvent('APIEvent', {'action': 'removeEventListener', 'event': publicEvent, 'viewId': id});
        }
    });

    Object.preventExtensions(window.API.removeEventListener);
    /* Audio Dummy */
    // TODO jsdoc
    var dummyAudioPlayer = function dummyAudioPlayer(API, options) {

        if(appleOS === true){
            Ti.API.info('******* iOS System LOADED *******');
            this.STATE_BUFFERING = 5;
            this.STATE_INITIALIZED = 0;
            this.STATE_PAUSED = 8;
            this.STATE_PLAYING  = 4;
            this.STATE_STARTING  = 1;
            this.STATE_STOPPED = 7;
            this.STATE_WAITING_FOR_DATA = 2;
            this.STATE_WAITING_FOR_QUEUE = 3;
        }
        else {
            Ti.API.info('******* Android System LOADED *******');
            this.STATE_BUFFERING = 0;
            this.STATE_INITIALIZED = 1;
            this.STATE_PAUSED = 2;
            this.STATE_PLAYING  = 3;
            this.STATE_STARTING  = 4;
            this.STATE_STOPPED = 5;
            this.STATE_WAITING_FOR_DATA = 7;
            this.STATE_WAITING_FOR_QUEUE = 8;
        }
        this.STATE_STOPPING = 6;

        this.id = null;
        this.pendings = [];
        this.callbacks = {
            'audioChange': [],
            'audioProgress': [],
            'audioComplete': []
        };
        this.pendingEvents = {
            'audioChange': {},
            'audioProgress': {},
            'audioComplete': {}
        };
        this.lastChange = -1;
        this.lastProgress = -1;
        this.lastComplete = -1;
        this.busy = true;
        Ti.API.info('[DUMMY] STATE: creating');
        this.state = 'creating';

        var callback = function(id) {
            Ti.API.info('[DUMMY].............. available id:' + id);
            this.id = id;
            this.syncAddEventListener('audioChange', this.changeHandler.bind(this));
            this.syncAddEventListener('audioProgress', this.processHandler.bind(this));
            //this.syncAddEventListener('audioComplete', this.completeHandler.bind(this));
            genericCallback.call(this, id);
            Ti.API.info('[DUMMY] STATE: stoped');
            this.state = 'stopped';
        };
        if (!(options instanceof Object)) {
            options = null;
        }
        Ti.API.info('[DUMMY] waiting for audioPlayer id ..............');
        _genericMethodHandler.call(API, callback.bind(this), 'API.HW.Media.createAudioPlayer', [], options);
    };

    // Public
    dummyAudioPlayer.prototype.addEventListener = function addEventListener(publicEvent, callback) {
        Ti.API.info('[DUMMY] 13 - addEventListener');
        addProcess.call(this, 13, {'publicEvent': publicEvent, 'callback': callback});
    };

    dummyAudioPlayer.prototype.removeEventListener = function removeEventListener(publicEvent, callback) {
        Ti.API.info('[DUMMY] 13 - removeEventListener');
        addProcess.call(this, 13, {'publicEvent': publicEvent, 'callback': callback});
    };

    dummyAudioPlayer.prototype.play = function play() {
        Ti.API.info('[DUMMY] 1 - play');
        addProcess.call(this, 1);
    };

    dummyAudioPlayer.prototype.pause = function pause() {
        Ti.API.info('[DUMMY] 2 - pause');
        addProcess.call(this, 2);
    };

    dummyAudioPlayer.prototype.stop = function stop() {
        Ti.API.info('[DUMMY] 3 - stop');
        addProcess.call(this, 3);
    };

    dummyAudioPlayer.prototype.setURL = function setURL(url) {
        Ti.API.info('[DUMMY] 4 - setURL');
        addProcess.call(this, 4, {'url': url});
    };

    // Private
    dummyAudioPlayer.prototype.changeHandler = function changeHandler(event) {
        var i;

        if (this.lastChange + 1 == event.order) {
            // Real Next
            Ti.API.info('[DUMMY eventHandler] change event ' + event.order + ', viewId: ' + id + ', entityId: ' + this.id +', event: ' + JSON.stringify(event));
            this.lastChange += 1;
            for (i = 0; i < this.callbacks.audioChange.length; i ++) {
                Ti.API.info('[DUMMY eventHandler] launching HTML callback... ' + this.callbacks.audioChange[i]);
                this.callbacks.audioChange[i](event);
            }
            if (this.pendingEvents.audioChange[event.order + 1] != null) {
                // Pop waiting event
                this.changeHandler(this.pendingEvents.audioChange[event.order + 1]);
                delete this.pendingEvents.audioChange[event.order + 1];
            }
        } else if (this.lastChange + 1 < event.order) {
            // Push this event
            Ti.API.info('[DUMMY eventHandler] save this change event: ' + event.order);
            this.pendingEvents.audioChange[event.order] = event;
        } else {
            // ORDER ERROR
            Ti.API.info('[DUMMY eventHandler] change event order error ' + event.order + ' < ' + this.lastChange + ', event: ' + JSON.stringify(event));
            // discard event
        }
    };

    dummyAudioPlayer.prototype.completeHandler = function completeHandler(event) {
        var i;

        if (this.lastComplete + 1 == event.order) {
            // Real Next
            Ti.API.info('[DUMMY completeHandler] complete event ' + event.order + ', viewId: ' + id + ', entityId: ' + this.id +', event: ' + JSON.stringify(event));
            this.lastComplete += 1;
            for (i = 0; i < this.callbacks.audioComplete.length; i ++) {
                this.callbacks.audioComplete[i](event);
            }
            if (this.pendingEvents.audioComplete[event.order + 1] != null) {
                // Pop waiting event
                this.changeHandler(this.pendingEvents.audioComplete[event.order + 1]);
                delete this.pendingEvents.audioComplete[event.order + 1];
            }
        } else if (this.lastComplete + 1 < event.order) {
            // Push this event
            Ti.API.info('[DUMMY completeHandler] save this progress event: ' + event.order);
            this.pendingEvents.audioComplete[event.order]= event;
        } else {
            // ORDER ERROR
            Ti.API.info('[DUMMY completeHandler] complete event order error ' + event.order + ' < ' + this.lastChange + ', event: ' + JSON.stringify(event));
            // discard event
        }
    };

    dummyAudioPlayer.prototype.processHandler = function processHandler(event) {
        var i;

        if (this.lastProgress + 1 == event.order) {
            // Real Next
            Ti.API.info('[DUMMY eventHandler] progress event ' + event.order + ', viewId: ' + id + ', entityId: ' + this.id +', event: ' + JSON.stringify(event));
            this.lastProgress += 1;
            for (i = 0; i < this.callbacks.audioProgress.length; i ++) {
                this.callbacks.audioProgress[i](event);
            }
            if (this.pendingEvents.audioProgress[event.order + 1] != null) {
                // Pop waiting event
                this.changeHandler(this.pendingEvents.audioProgress[event.order + 1]);
                delete this.pendingEvents.audioProgress[event.order + 1];
            }
        } else if (this.lastProgress + 1 < event.order) {
            // Push this event
            Ti.API.info('[DUMMY eventHandler] save this progress event: ' + event.order);
            this.pendingEvents.audioProgress[event.order]= event;
        } else {
            // ORDER ERROR
            Ti.API.info('[DUMMY eventHandler] progress event order error ' + event.order + ' < ' + this.lastChange + ', event: ' + JSON.stringify(event));
            // discard event
        }
    };

    dummyAudioPlayer.prototype.syncAddEventListener = function SyncAddEventListener(publicEvent, callback) {
        Ti.API.info('[DUMMY] Sync-addEventListener. event: ' + publicEvent + ', viewId: ' + id + ', entityId: ' + this.id);
        if (eventHandlers[publicEvent] == null || eventHandlers[publicEvent].length <= 0) {
            // First event listener for this publicEvent
            eventHandlers[publicEvent] = [];
            // Listen the event
            Ti.App.addEventListener(publicEvent, _invokeEventCallbacks);
        }
        eventHandlers[publicEvent].push(callback);
        Ti.API.info('[DUMMY] Sync-addEventListener pre-fire');

        // Subscribe this view to publicEvent
        Ti.App.fireEvent('APIEvent', {'action': 'addEventListener', 'event': publicEvent, 'viewId': id, 'entityId': this.id});
        Ti.API.info('[DUMMY] Sync-addEventListener post-fire');
    };

    dummyAudioPlayer.prototype.syncRemoveEventListener = function syncRemoveEventListener(publicEvent, callback) {
        Ti.API.info('[DUMMY] Sync-removeEventListener. event:' + publicEvent + ', viewId: ' + id + ', entityId: ' + this.id);
        var index;

        if (eventHandlers[publicEvent] == null || eventHandlers[publicEvent].length <= 0) {
            return false;
        }
        index = eventHandlers[publicEvent].indexOf(callback);
        eventHandlers[publicEvent].splice(index, 1);

        // remove listener
        Ti.App.removeEventListener(publicEvent, _invokeEventCallbacks);

        // Unsubscribe this view to publicEvent
        Ti.App.fireEvent('APIEvent', {'action': 'removeEventListener', 'event': publicEvent, 'viewId': id, 'entityId': this.id});
    };

    dummyAudioPlayer.prototype.play = function play() {
        console.log('adding Dummy play');
        addProcess.call(this, 1);
    };

    dummyAudioPlayer.prototype.pause = function pause() {
        console.log('adding Dummy pause');
        addProcess.call(this, 2);
    };

    dummyAudioPlayer.prototype.stop = function stop() {
        console.log('adding Dummy stop');
        addProcess.call(this, 3);
    };

    dummyAudioPlayer.prototype.setURL = function setURL(url) {
        console.log('adding Dummy seturl: ' + url);
        console.log('this: ' + this);
        addProcess.call(this, 4, {'url': url});
    };

    /*
     * play   -> 1
     * pause  -> 2
     * stop   -> 3
     * setURL -> 4
     */
    var addProcess = function addProcess(type, options) {
        console.log('Add new order to AudioPlayer:' + type);
        this.pendings.push({'type': type, 'options': options});
        process.call(this);
    };

    var process = function process() {
        console.log('Dummy trying to process. Busy-> ' + this.busy + '; pendings: ' + this.pendings);
        if (!this.busy && this.pendings.length > 0) {
            var newOrder = this.pendings.shift();
            console.log('Dummy processing ' + newOrder);
            this.busy = true;
            switch(newOrder.type) {
                case 1:
                    // PLAY
                    _genericMethodHandler.call(API, genericCallback.bind(this), 'API.HW.Media.playAudioPlayer', [this.id], null);
                    break;
                case 2:
                    // PAUSE
                    _genericMethodHandler.call(API, genericCallback.bind(this), 'API.HW.Media.pauseAudioPlayer', [this.id], null);
                    break;
                case 3:
                    // STOP
                    _genericMethodHandler.call(API, genericCallback.bind(this), 'API.HW.Media.stopAudioPlayer', [this.id], null);
                    break;
                case 4:
                    // SETURL
                    _genericMethodHandler.call(API, genericCallback.bind(this), 'API.HW.Media.setAudioPlayerURL', [this.id, newOrder.options.url], null);
                    break;
                case 13:
                    //  AddEventListener
                    this.syncAddEventListener(newOrder.options.publicEvent, newOrder.options.callback);
                    this.busy = false;
                    if (this.pendings.length > 0) {
                        console.log('Dummy busy');
                        process.call(this);
                    } else {
                        console.log('Dummy free');
                    }
                    break;
                case 31:
                    //  RemoveEventListener
                    this.syncRemoveEventListener(newOrder.options.publicEvent, newOrder.options.callback);
                    if (this.pendings.length > 0) {
                        console.log('Dummy busy');
                        process.call(this);
                    } else {
                        console.log('Dummy free');
                    }
                    break;
                default:
                    // ERROR
                    console.log('Error in AudioPlayerDummy');
                    break;
            }
        }
    };

    var genericCallback = function genericCallback(data) {
        console.log('--dummy genericCallback: ' + JSON.parse(data));
        this.busy = false;
        if (this.pendings.length > 0) {
            console.log('Dummy busy');
            process.call(this);
        } else {
            console.log('Dummy free');
        }
    };
    // End Audio Dummy
}());