/*
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

"use strict";

/**
 * PhotoGalleryOptionsType.
 * @typedef {Object} PhotoGalleryOptionsType
 * @property {callback} success
 * @property {callback} error
 * @property {callback} cancel
 */

/* FYI: http://docs.appcelerator.com/titanium/3.0/#!/api/Titanium.Media*/
var Media = (function() {

    /** It allows to manage photo gallery and other native services.
     * @author Santiago Blanco & Carlos Blanco
     * @version 1.0.0
     * @alias API.Media
     * @namespace */
    var self = {};

    /** Opens the photo gallery image picker.
     * @param {PhotoGalleryOptionsType} */
    self.openPhotoGallery = function openPhotoGallery(options) {
        Titanium.Media.openPhotoGallery(options);
    };

    /** Takes a screen shot of the visible UI on the device. This method is
     *  asynchronous.
     * @param {screenSotCallback} callback that will receive screenshot image as Blob object */
    self.takeScreenshot = function takeScreenshot(callback) {
        Titanium.Media.takeScreenshot(callback);
    };

    /** Takes a screen shot of the visible UI on the device. This method is
     *  asynchronous.
     * @param {pattern} [Number[]=[100, 300, 100, 200, 100, 50]] optional vibrate pattern only available for Android.*/
    self.vibrate = function vibrate(pattern) {
        if (Ti.App.isApple || pattern == null || !(pattern instanceof Array)) {
            Titanium.Media.vibrate();
        }
        // pattern only available for Android
        Titanium.Media.vibrate(pattern);
    };

    // Audio Player
    /** audioPlayerOptions
      * @typedef {Object} audioPlayerOptions
      * @property {Boolean} paused
      * @property {Boolean} paused
      * @property {Boolean} playing
      * @property {String} url
      * @property {Number} [0.0 ... 1.0] volume
      * On iOS, to adjust the volume of the device, set the volume property
      * of Titanium.Media.appMusicPlayer and set the Titanium.Media.audioSessionMode
      * property to either Titanium.Media.AUDIO_SESSION_MODE_AMBIENT,
      * Titanium.Media.AUDIO_SESSION_MODE_SOLO_AMBIENT,
      * or Titanium.Media.AUDIO_SESSION_MODE_PLAYBACK.
      */

    var audioPlayerList = {};
    var audioPlayerCounters = {};
    var audioPlayerId = 0;

    /** Create new AudioPlayer
     * @param {audioPlayerOptions} options
     * @return {Number} audioPlayer ID*/
    self.createAudioPlayer = function createAudioPlayer(options) {
        var tiAudioPlayer;

        audioPlayerId ++;
        Ti.API.info('[API.Media]  Creating Audio Player: ' + audioPlayerId);
        tiAudioPlayer = Ti.Media.createAudioPlayer({
            //url: options.resource,
            // allowBackground: true on Android allows the
            // player to keep playing when the app is in the
            // background.
            allowBackground: true
        });

        audioPlayerList[audioPlayerId] = tiAudioPlayer;
        Ti.API.info('[API.Media]  Audio Player created: ' + audioPlayerId);
        return audioPlayerId;
    };

    /** Check if a player is paused
     * @param {Number} playerId, the audio player ID number
     * @return {Boolean} Boolean indicating if audio playback is paused */
    self.isAudioPlayerPaused = function isAudioPlayerPaused(playerId) {
        if (audioPlayerList[playerId] == null) {
            //TODO: error. Unknown Audio Player ID
            Ti.API.info('[API.Media.isAudioPlayerPaused] Unknown Audio Player ID: ' + audioPlayerId);
            return false;
        }
        Ti.API.info('[API.Media.isAudioPlayerPaused] Audio Player paused: ' + audioPlayerList[playerId].paused);
        return audioPlayerList[playerId].paused;
    };

    /** Check if a player is playing
     * @param {Number} playerId, the audio player ID number
     * @return {Boolean} Boolean indicating if audio playback is playing */
    self.isAudioPlayerPlaying = function isAudioPlayerPlaying(playerId) {
        if (audioPlayerList[playerId] == null) {
            //TODO: error. Unknown Audio Player ID
            Ti.API.info('[API.Media.isAudioPlayerPlaying] Unknown Audio Player ID: ' + audioPlayerId);
            return false;
        }
        Ti.API.info('[API.Media.isAudioPlayerPlaying] Audio Player playing: ' + audioPlayerList[playerId].playing);
        return audioPlayerList[playerId].playing;
    };

    /** Get Audio Player URL
     * @param {Number} playerId, the audio player ID number
     * @return {String} The Audio Player URL */
    self.getAudioPlayerURL = function getAudioPlayerURL(playerId) {
        if (audioPlayerList[playerId] == null) {
            //TODO: error. Unknown Audio Player ID
            Ti.API.info('[API.Media.getAudioPlayerURL] Unknown Audio Player ID: ' + audioPlayerId);
            return false;
        }
        Ti.API.info('[API.Media.getAudioPlayerURL] Audio Player URL: ' + audioPlayerList[playerId].url);
        return audioPlayerList[playerId].url;
    };

    /** Set Audio Player URL
     * @param {Number} playerId, the audio player ID number
     * @param {String} url, The Audio Player URL */
    self.setAudioPlayerURL = function getAudioPlayerURL(playerId, url) {
        if (audioPlayerList[playerId] == null) {
            //TODO: error. Unknown Audio Player ID
            Ti.API.info('[API.Media.setAudioPlayerURL] Unknown Audio Player ID: ' + playerId);
            return false;
        }
        audioPlayerList[playerId].url = url;
        Ti.API.info('[API.Media.setAudioPlayerURL] Audio Player URL changed: ' + audioPlayerList[playerId].url);
        return true;
    };

    /** Get Audio Player volume
     * @param {Number} playerId, the audio player ID number
     * @return {Number} The Audio Player volume */
    self.getAudioPlayerVolume = function getAudioPlayerVolume(playerId) {
        if (audioPlayerList[playerId] == null) {
            //TODO: error. Unknown Audio Player ID
            Ti.API.info('[API.Media.getAudioPlayerVolume] Unknown Audio Player id: ' + playerId);
            return false;
        }
        Ti.API.info('[API.Media.getAudioPlayerVolume] AudioPlayer ' + playerId + ' volume:' + audioPlayerList[playerId].volume);
        return audioPlayerList[playerId].volume;
    };

    /** Set Audio Player volume
     * @param {Number} playerId, the audio player ID number
     * @param {Number} volume, volume of the audio, from 0.0 (muted) to 1.0 (loudest) */
    self.setAudioPlayerVolume = function getAudioPlayerVolume(playerId, volume) {
        if (audioPlayerList[playerId] == null) {
            //TODO: error. Unknown Audio Player ID
            Ti.API.info('[API.Media.setAudioPlayerVolume] Unknown Audio Player id: ' + playerId);
            return false;
        }
        // TODO: check iOS
        audioPlayerList[playerId].volume = volume;
        Ti.API.info('[API.Media.setAudioPlayerVolume] AudioPlayer ' + playerId + ' new volume: ' + audioPlayerList[playerId].volume);
        return true;
    };

    /** Pause Audio Player
     * @param {Number} playerId, the audio player ID number */
    self.pauseAudioPlayer = function pauseAudioPlayer(playerId) {
        if (audioPlayerList[playerId] == null) {
            //TODO: error. Unknown Audio Player ID
            Ti.API.info('[API.Media.pauseAudioPlayer] Unknown Audio Player id: ' + playerId);
            return false;
        }
        audioPlayerList[playerId].pause();
        Ti.API.info('[API.Media.pauseAudioPlayer] AudioPlayer ' + playerId + ' Paused!');
        return true;
    };

    /** Play Audio Player
     * @param {Number} playerId, the audio player ID number */
    self.playAudioPlayer = function playAudioPlayer(playerId) {
        if (audioPlayerList[playerId] == null) {
            //TODO: error. Unknown Audio Player ID
            Ti.API.info('[API.Media.playAudioPlayer] Unknown Audio Player id: ' + playerId);
            return false;
        }
        audioPlayerList[playerId].play();
        Ti.API.info('[API.Media.playAudioPlayer]  Play activated in player ' + playerId + ' with URL: ' + audioPlayerList[playerId].url);
        return true;
    };

    /** Stop Audio Player
     * @param {Number} playerId, the audio player ID number */
    self.stopAudioPlayer = function stopAudioPlayer(playerId) {
        if (audioPlayerList[playerId] == null) {
            Ti.API.info('[API.Media.stopAudioPlayer] Unknown Audio Player ID: ' + playerId);
            //TODO: error. Unknown Audio Player ID
            return false;
        }
        audioPlayerList[playerId].stop();
        if (Ti.Platform.name === 'android')
        {
            audioPlayerList[playerId].release();
        }
    };

    // TODO
    // Private?
    self.convertPointToView = function convertPointToView(point, destinationView) {
        if (destinationView == null) {
            destinationView = 'Titanium.UI.View';
        }
        convertPointToView(point, destinationView);
    };

    // Video Player
    /** videoPlayerOptions
      * @typedef {Object} videoPlayerOptions
      * TODO: check accesibility methods
      * @property {Boolean} autoplay
      * @property {String} backgroundColor
      * @property {Boolean} backgroundRepeat
      * @property {String} borderColor
      * @property {Number} borderRadius
      * @property {Number} borderWidth
      * @property {Number/String} bottom, View's bottom position. Can be either a float value or a dimension string (for example, '50%' or '10px')
      * @property {Number/String} top, View's top position. Can be either a float value or a dimension string (for example, '50%' or '10px')
      * @property {Number/String} left, View's left position. Can be either a float value or a dimension string (for example, '50%' or '10px')
      * @property {Number/String} rigth, View's right position. Can be either a float value or a dimension string (for example, '50%' or '10px')
      * @property {Number/String} height, View's height. Can be either a float value or a dimension string (for example, '50%' or '40dp')
      * @property {Number/String} width, View's width. Can be either a float value or a dimension string (for example, '50%' or '40dp')
      * @property {String} layout, Specifies how the view positions its children. One of: 'composite', 'vertical', or 'horizontal'
      * @property {Number/String} height, Can be either a float value or a dimension string (for example, '50%' or '40dp')
      * @property {Boolean} horizontalWrap, Determines whether the layout has wrapping behavior
      * @property {Point} center, View's center position, in the parent view's coordinates. // TODO: check this pos
      * @property {Number} currentPlaybackTime, Current playback time of the current movie in milliseconds
      * @property {Number} duration, The duration of the current movie in milliseconds, or 0.0 if not known
      * @property {Boolean} fullscreen, Determines if the movie is presented in the entire screen (obscuring all other application content)
      * @property {Number} initialPlaybackTime, The start time of movie playback, in milliseconds
      * @property {Number} loadState, Returns the network load state of the movie player
      * @property {Number} opacity, Opacity of this view, from 0.0 (transparent) to 1.0 (opaque)
      * @property {Number} playbackState, Current playback state of the video player. One of the VIDEO_PLAYBACK_STATE constants defined in Titanium.Media
      * @property {Number} playing, Indicate if the player has started playing
      * @property {Dimension} rect, The bounding box of the view relative to its parent, in system units
      * @property {Dimension} size, The size of the view in system units
      * @property {String} url, URL identifying a local or remote video to play.
      * @property {Boolena} visible, Determines whether the view is visible.
      * @property {Number} zIndex, Z-index stack order position, relative to other sibling views.
      */
     /** point
      * @typedef {Object} point
      * @property {Number} x
      * @property {Number} y
      */
     /** dimension
      * @typedef {Object} dimension
      * @property {Number} x
      * @property {Number} y
      * @property {Number} height
      * @property {Number} width
      */
    var videoPlayerList = {};
    var videoPlayerId = 0;

    /** Create new VideoPlayer
     * @param {videoPlayerOptions} options
     * @return {Number} videoPlayer ID*/
    self.createVideoPlayer = function createVideoPlayer(options) {
        var tiVideoPlayer;

        //TODO: 4test
        options.resource = 'http://www.youtube.com/watch?v=d6C0bNDqf3Y';

        videoPlayerId ++;
        tiVideoPlayer = Ti.Media.createVideoPlayer({
            url: options.resource,
        });

        videoPlayerList[videoPlayerId] = tiVideoPlayer;
        return audioPlayerId;
    };

    // TODO generic get and set methods?
    self.getVideoPlayerAttribute = function getVideoPlayerAttribute(playerId, attr) {
        if (videoPlayerList[playerId] == null) {
            //TODO: error. Unknown Video Player ID
        }
        return videoPlayerList[playerId][attr];
    };
    self.setVideoPlayerAttribute = function setVideoPlayerAttribute(playerId, attr, value) {
        if (videoPlayerList[playerId] == null) {
            //TODO: error. Unknown Video Player ID
        }
        videoPlayerList[playerId][attr] = value;
    };

    /** Hide a VideoPlayer */
    self.hideVideoPlayer = function hideVideoPlayer(playerId) {
        if (videoPlayerList[playerId] == null) {
            //TODO: error. Unknown Video Player ID
        }
        videoPlayerList[playerId].hide();
    };

    /** Show a VideoPlayer */
    self.showVideoPlayer = function showVideoPlayer(playerId) {
        if (videoPlayerList[playerId] == null) {
            //TODO: error. Unknown Video Player ID
        }
        videoPlayerList[playerId].show();
    };

    /** Pause a VideoPlayer */
    self.pauseVideoPlayer = function pauseVideoPlayer(playerId) {
        if (videoPlayerList[playerId] == null) {
            //TODO: error. Unknown Video Player ID
        }
        videoPlayerList[playerId].pause();
    };

    /** Stop a VideoPlayer */
    self.stopVideoPlayer = function stopVideoPlayer(playerId) {
        if (videoPlayerList[playerId] == null) {
            //TODO: error. Unknown Video Player ID
        }
        videoPlayerList[playerId].stop();
    };

    /** Release a VideoPlayer. Releases the internal video resources immediately.
     *  This is not usually necessary but can help if you no longer need to use the
     *  player after it is used to help converse memory */
    self.releaseVideoPlayer = function releaseVideoPlayer(playerId) {
        if (videoPlayerList[playerId] == null) {
            //TODO: error. Unknown Video Player ID
        }
        videoPlayerList[playerId].release();
    };

    /** Capture an image of the rendered view, as a Blob.
     * @param {callback} Function to be invoked upon completion with the
     * image Titanium.Blob ass param(TODO:check this) */
    self.captureVideoPlayer = function captureVideoPlayer(playerId, callback) {
        if (videoPlayerList[playerId] == null) {
            //TODO: error. Unknown Video Player ID
        }
        videoPlayerList[playerId].toImage(callback);
    };

    self.addEventListener = function addEventListener(event, handler, id) {
        Ti.API.info('[API.Media.addEventListener] event: ' + event + ', id: ' + id +', audioPlayerList: ' + JSON.stringify(audioPlayerList) + 'event: ' + event);
        var handler_aux = function(e) {
            Ti.API.info('*************************************************' + e.type);
            if (e.type == 'complete') {
                Ti.API.info('[API.Media.eventHandler false] (stopped), paused: ' + audioPlayerList[id].paused + ', playing: ' + audioPlayerList[id].playing + '---------------REAL e: ' + JSON.stringify(e));
                var d = {};
                d['order'] = audioPlayerCounters[id].change;
                d['description'] = 'stopped';
                d['state'] = 5;
                d['type'] = 'change';
                d['source'] = e.source;
                Ti.API.info('[API.Media.eventHandler false] change ' + d['order']);
                audioPlayerCounters[id].change ++;
                handler(d);
                return;
            } else if (e.type == 'change') {
                if (e.state == 5) {
                    Ti.API.info('[API.Media.eventHandler] ChangeEvent.stop killed');
                    return;
                }
                Ti.API.info('[API.Media.eventHandler] (' + e.description + '), paused: ' + audioPlayerList[id].paused + ', playing: ' + audioPlayerList[id].playing + '---------------REAL e: ' + JSON.stringify(e));
                e['order'] = audioPlayerCounters[id].change;
                Ti.API.info('[API.Media.eventHandler] change ' + e['order']);
                audioPlayerCounters[id].change ++;
            } else if (e.type == 'progress') {
                Ti.API.info('[API.Media.eventHandler] (' + e.progress + '), paused: ' + audioPlayerList[id].paused + ', playing: ' + audioPlayerList[id].playing + '---------------REAL e: ' + JSON.stringify(e));
                e['order'] = audioPlayerCounters[id].progress;
                Ti.API.info('[API.Media.eventHandler] progress ' + e['order']);
                audioPlayerCounters[id].progress ++;
            }
            handler(e);
        };
        audioPlayerList[id].addEventListener(event, handler_aux);
        Ti.API.info('[API.Media.eventHandler] event: ' + event + ', isApple: ' + Ti.App.isApple);
        if (event == 'change') {
            Ti.API.info('[API.Media.eventHandler] event change and complete!!');
            audioPlayerList[id].addEventListener('complete', handler_aux);
        }
    };

    self.removeEventListener = function removeEventListener(event, handler, id) {
        Ti.API.info('removeEventListener; event: ' + event + ', id: ' + id +', audioPlayerList: ' + JSON.stringify(audioPlayerList));
        audioPlayerList[id].removeEventListener(event, handler);
    };

    self.events = {
        /** Fired when the state of the playback changes.This event can be generated by programmatic
         *  events, such as pausing or stopping the audio, and also by external events, such as the
         *  current state of network buffering.
         * @typedef {event} audioChange
         * @property {Object} description. Text description of the state of playback. //TODO: check this Object. String??
         * @property {Object} source. Source object that fired the event. //TODO: check this Object. Ti Object???
         * @property {Number} name. Current state of playback. specified using one of the next STATE constants:
         * STATE_BUFFERING, STATE_INITIALIZED, STATE_PAUSED, STATE_PLAYING, STATE_STARTING, STATE_STOPPED,
         * STATE_STOPPING, STATE_WAITING_FOR_DATA, STATE_WAITING_FOR_QUEUE
         * @property {String} type. Name of the event fired. */
        'audioChange': {
            event: 'change',
            listener: null,
            source: "Ti.Media.Sound",
            keylist: ['description', 'state', 'type', 'order'],
            dummy: true
        },
        /** Fired once per second with the current progress during playback.
         * @typedef {event} audioChange
         * @property {Object} progress. Current progress, in milliseconds. //TODO: check this Object. String??
         * @property {Object} source. Source object that fired the event. //TODO: check this Object. Ti Object???
         * STATE_BUFFERING, STATE_INITIALIZED, STATE_PAUSED, STATE_PLAYING, STATE_STARTING, STATE_STOPPED,
         * STATE_STOPPING, STATE_WAITING_FOR_DATA, STATE_WAITING_FOR_QUEUE
         * @property {String} type. Name of the event fired. */
        'audioProgress': {
            event: 'progress',
            listener: null,
            source: "Ti.Media.Sound",
            keylist: ['progress', 'type', 'order'],
            dummy: true
        }
    };

    return self;

}());

module.exports = Media;
