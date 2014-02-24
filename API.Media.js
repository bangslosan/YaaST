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
    var audioPlayerId = 0;

    /** Create new AudioPlayer
     * @param {audioPlayerOptions} options
     * @return {Number} audioPlayer ID*/
    self.createAudioPlayer = function createAudioPlayer(options) {
        //TODO: 4test
        options.resource = 'http://audio.ancientfaith.com/wardrobe/atw_2014-02-06.mp3';

        audioPlayerId ++;
        tiAudioPlayer = Ti.Media.createAudioPlayer({
            url: options.resource,
            // allowBackground: true on Android allows the
            // player to keep playing when the app is in the
            // background.
            allowBackground: true
        });

        audioPlayerList[audioPlayerId] = tiAudioPlayer;

        return audioPlayerId;
    };

    /** Check if a player is paused
     * @param {Number} playerId, the audio player ID number
     * @return {Boolean} Boolean indicating if audio playback is paused */
    self.isAudioPlayerPaused = function isAudioPlayerPaused(playerId) {
        if (audioPlayerList[playerId] == null) {

        }
        return audioPlayerList[playerId].paused;
    };

    /** Check if a player is playing
     * @param {Number} playerId, the audio player ID number
     * @return {Boolean} Boolean indicating if audio playback is playing */
    self.isAudioPlayerPlaying = function isAudioPlayerPlaying(playerId) {
        if (audioPlayerList[playerId] == null) {
            //TODO: error. Unknown Audio Player ID
        }
        return audioPlayerList[playerId].playing;
    };

    /** Get Audio Player URL
     * @param {Number} playerId, the audio player ID number
     * @return {String} The Audio Player URL */
    self.getAudioPlayerURL = function getAudioPlayerURL(playerId) {
        if (audioPlayerList[playerId] == null) {
            //TODO: error. Unknown Audio Player ID
        }
        return audioPlayerList[playerId].url;
    };

    /** Set Audio Player URL
     * @param {Number} playerId, the audio player ID number
     * @param {String} url, The Audio Player URL */
    self.setAudioPlayerVolume = function getAudioPlayerVolume(playerId, url) {
        if (audioPlayerList[playerId] == null) {
            //TODO: error. Unknown Audio Player ID
        }
        audioPlayerList[playerId].url = url;
    };

    /** Get Audio Player volume
     * @param {Number} playerId, the audio player ID number
     * @return {Number} The Audio Player volume */
    self.getAudioPlayerVolume = function getAudioPlayerVolume(playerId) {
        if (audioPlayerList[playerId] == null) {
            //TODO: error. Unknown Audio Player ID
        }
        return audioPlayerList[playerId].volume;
    };

    /** Set Audio Player volume
     * @param {Number} playerId, the audio player ID number
     * @param {Number} volume, volume of the audio, from 0.0 (muted) to 1.0 (loudest) */
    self.setAudioPlayerVolume = function getAudioPlayerVolume(playerId, volume) {
        if (audioPlayerList[playerId] == null) {
            //TODO: error. Unknown Audio Player ID
        }
        // TODO: check iOS
        audioPlayerList[playerId].volume = volume;
    };

    /** Pause Audio Player
     * @param {Number} playerId, the audio player ID number */
    self.pauseAudioPlayer = function pauseAudioPlayer(playerId) {
        if (audioPlayerList[playerId] == null) {
            //TODO: error. Unknown Audio Player ID
        }
        audioPlayerList[playerId].pause();
    };

    /** Play Audio Player
     * @param {Number} playerId, the audio player ID number */
    self.playAudioPlayer = function playAudioPlayer(playerId) {
        if (audioPlayerList[playerId] == null) {
            //TODO: error. Unknown Audio Player ID
        }
        audioPlayerList[playerId].start();
    };

    /** Stop Audio Player
     * @param {Number} playerId, the audio player ID number */
    self.stopAudioPlayer = function stopAudioPlayer(playerId) {
        if (audioPlayerList[playerId] == null) {
            //TODO: error. Unknown Audio Player ID
        }
        audioPlayerList[playerId].stop();
    };

    _self.events = {
        'audioChange': {
            event: 'change',
            listener: Titanium.Media.AudioPlayer,
            keyList: ['description', 'source', 'name', 'type']
        }
    };

    return self;

}());

module.exports = Media;
