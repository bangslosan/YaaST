/*
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

"use strict";

/* FYI: http://docs.appcelerator.com/titanium/3.0/#!/api/Titanium.Filesystem */
var Filesystem = (function() {

    var CALL_FAILURE = "call failed: ";

    /** It contains several useful methods to manage files and directories.
     * @author Santiago Blanco
     * @version 1.0.0
     * @alias API.Filesystem
     * @namespace */
    var self = {};

    /** It returns a file descriptor from path.
     *  @private
     *  @exception {String} funcName
     *  @param {String} funcName
     *  @param {String} path */
    var getFileDescriptor = function getFileDescriptor(funcName, path) {
        var tiFile = Ti.FileSystem.getFile(path);

        if (!tiFile.exists()) {
            var TiError = require('APIError');
            throw new TiError(funcName + ": File does not exists.");
        }

        return tiFile;
    };

    /** Check if the given path is a regular file.
     * @method
     * @param {String} path
     * @exception {TiError} Throws an APIError if path does not exist.
     * @return {Boolean} */
    self.isFile = function isFile(path) {
        var fileDescriptor = getFileDescriptor.call(this, "isFile", path);
        return fileDescriptor.isFile();
    };

    /** Check if the given path is a directory.
     * @method
     * @param {String} path
     * @exception {TiError} Throws an APIError if path does not exist.
     * @return {Boolean} */
    self.isDirectory = function isDirectory(path) {
        var fileDescriptor = getFileDescriptor.call(this, "isDirectory", path);
        return fileDescriptor.isDirectory();
    };

    /** Check if the given path is a symbolicLink.
     * @method
     * @param {String} path
     * @exception {TiError} Throws an APIError if path does not exist.
     * @return {Boolean} */
    self.isSymbolicLink = function isSymbolicLink(path) {
        var fileDescriptor = getFileDescriptor.call(this, "isSymbolicLink", path);
        return fileDescriptor.getSymbolicLink();
    };

    /** It creates a new void regular file.
     * @method
     * @exception {TiError} Throws an exception if path already exists.
     * @param {String} path of parent directory
     * @return {String} filePath */
    self.createFile = function createFile(path) {
        var fileDescriptor = Ti.FileSystem.getFile(path);
        if (!fileDescriptor.createFile()) {
            var msg = "The file " + path + "could not be created";
            throw Ti.App.Log("Ti.API.createFile failed", null, {
                message: "Ti.API.createFile: " + msg,
                name: 'TiException'
            });
        }
    };

    /** It creates a new directory.
     *  @method
     *  @param {String} path of parent directory
     *  @return {String} directoryPath */
    self.createDirectory = function createDirectory(path) {
        var fileDescriptor = Ti.FileSystem.getFile(path);
        if (!fileDescriptor.createDirectory()) {
            var msg = "The directory " + path + "could not be created";
            throw Ti.App.Log("Ti.API.createDirectory failed", null, {
                message: "Ti.API.createDirectory: " + msg,
                name: 'TiException'
            });
        }
    };

    /** Read from 'path' file.
     * @method
     * @param {String} path
     * @exception {TiError} Throws an APIError if path does not exist.
     * @return {Object} */
    self.read = function read(path) {
        var TiError;
        var fileDescriptor;
        var blob;
        fileDescriptor = getFileDescriptor(path);
        if (!(fileDescriptor.isFile())) {
            throw Ti.App.Log("Ti.API.read failed", null, {
                name: "TiApiError",
                message: "Ti.API.read: File is not a regular file"
            });
        }
        blob = fileDescriptor.read();
        return blob.toString();
    };

    /** Write data to 'path' file.
     * @method
     * @param {String} path
     * @param {String} data
     * @exception {TiError} Throws an APIError if path does not exist. */
    self.write = function write(path, data) {
        var TiError;
        var fileDescriptor;
        var blob;
        fileDescriptor = getFileDescriptor(path);
        if (!(fileDescriptor.isFile())) {
            throw Ti.App.Log("Ti.API.write failed", null, {
                name: "TiApiError",
                message: "Ti.API.write: File is not a regular file"
            });
        }
        fileDescriptor.write(data, true); // true === append
    };

    /** Overwrite data from 'path' file.
     * @method
     * @param {String} path
     * @param {String} data
     * @exception {TiError} Throws an APIError if path does not exist. */
    self.overwrite = function overwrite(path, data) {
        var TiError;
        var blob;

        var fileDescriptor = getFileDescriptor(path);
        if (!(fileDescriptor.isFile())) {
            throw Ti.App.Log("Ti.API.overwrite failed", null, {
                name: "TiApiError",
                message: "Ti.API.overwrite: File is not a regular file"
            });
        }
        fileDescriptor.write(data, false); // false === overwrite.
    };

    /** Rename a file to newName.
     * @method
     * @param {String} newName of file.
     * @param {String} path file which the name should be change.
     * @exception {TiError} Throws an APIError if any path does not exist. */
    self.rename = function move(newName, path) {
        var fileDescriptor = getFileDescriptor(path);
        try {
            fileDescriptor.rename(newName);
        } catch (e) {
            throw Ti.App.Log("Ti.API.rename failed", null, {
                name: "TiApiError",
                message: "Ti.API.rename failed"
            });
        }
    };

    /** Copy a file from oldPath to newPath.
     * @method
     * @param {String} newPath where will be stored.
     * @param {String} oldPath where file is stored.
     * @exception {TiApiError} Throws TiApiError if any path does not exist. */
    self.copy = function copy(destinationPath, oldPath) {
        var fileDescriptor = getFileDescriptor(oldPath);
        if (!(fileDescriptor.copy(destinationPath))) {
            throw Ti.App.Log("Ti.API.copy failed", null, {
                name: "TiApiError",
                message: "Ti.API.copy failed"
            });
        }
    };

    return self;

}());

module.exports = Filesystem;