/* Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.1GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details. */

"use strict";

/* For Your Information:
 * http://docs.appcelerator.com/titanium/3.0/#!/api/Titanium.Filesystem
 * http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.Filesystem.File */
var Filesystem = (function() {

    /** It contains several useful methods to manage files and directories.
     * @author Santiago Blanco
     * @version 1.0.0
     * @alias API.Filesystem
     * @namespace */
    var self = {};

    /** It returns a file descriptor from path.
     *  @private
     *  @exception {String} TiError
     *  @param {String} funcName
     *  @param {String} path
     *  @return {Ti.Filesystem.File} file descriptor */
    var getFileDescriptor = function getFileDescriptor(path) {
        if (!path || typeof path !== 'string') {
            throw new TypeError("Invalid type for input parameter");
        }
        var fileDescriptor = Ti.Filesystem.getFile(path);

        return fileDescriptor;
    };

    var buildPath = function buildPath (parentPath, name) {
        if (!parentPath) {
            throw new TypeError("Parent path is not valid");
        }
        if (!name) {
            throw new TypeError("Name is not valid");
        }

        return parentPath + "/" + name;
    };

    var throwFileNoExist = function throwFileNoExist(fileDescriptor) {
        if (!fileDescriptor.exists()) {
            throw {
                name: "FileNoExists",
                message: "File does not exists"
            };
        }
    };

    var throwFileExist = function throwFileExist(fileDescriptor) {
        if (fileDescriptor.exists()) {
            throw {
                name: 'FileExists',
                message: 'File already exists'
            };
        }
    };
    var write = function write(path, data, append) {
        var fileDescriptor = getFileDescriptor(path);

        if (!(fileDescriptor.isFile())) {
            throw new TypeError("File is not a regular file");
        }

        fileDescriptor.write(data, append); // true === append, false === overwrite
    };

    /** Check if the given path is a regular file.
     * @method
     * @param {String} path
     * @exception {TiError} Throws an APIError if path does not exist.
     * @return {Boolean} */
    self.isFile = function isFile(path) {
        var fileDescriptor = getFileDescriptor.call(this, path);
        throwFileNoExist(fileDescriptor);

        return fileDescriptor.isFile();
    };

    /** Check if the given path is a directory.
     * @method
     * @param {String} path
     * @exception {TiError} Throws an APIError if path does not exist.
     * @return {Boolean} */
    self.isDirectory = function isDirectory(path) {
        var fileDescriptor = getFileDescriptor.call(this, path);
        throwFileNoExist(fileDescriptor);

        return fileDescriptor.isDirectory();
    };

    /** Check if the given path is a symbolicLink.
     * @method
     * @param {String} path
     * @exception {TiError} Throws an APIError if path does not exist.
     * @return {Boolean} */
    self.isSymbolicLink = function isSymbolicLink(path) {
        var fileDescriptor = getFileDescriptor.call(this, path);
        throwFileNoExist(fileDescriptor);

        return fileDescriptor.getSymbolicLink();
    };

    /** It creates a new void regular file.
     * @method
     * @exception {FileExists} File already exists.
     * @param {String} path of parent directory
     * @param {String} fileName name of the file wants to be created */
    self.createFile = function createFile(parentPath, fileName) {
        var path = buildPath(parentPath, fileName);
        path = Ti.Filesystem.applicationDataDirectory + path;
        var fileDescriptor = getFileDescriptor.call(this, path);
        throwFileExist(fileDescriptor);
        if (!fileDescriptor.write("")) {
            throw {
                name: "WriteError",
                message: "The file couldn't be created"
            };
        }
    };

    /** It creates a new directory.
     *  @method
     *  @exception {FileExists} File already exists.
     *  @param {String} path of parent directory */
    self.createDirectory = function createDirectory(parentPath, directoryName) {
        var path = buildPath(parentPath, directoryName);
        var fileDescriptor = getFileDescriptor.call(this, path);
        throwFileExist(fileDescriptor);
        if (!fileDescriptor.createDirectory()){
            throw {
                name: "CreateError",
                message: "The directory could not be created"
            };
        }
    };

    /** It deletes an existing file.
     *  @method
     *  @exception {FileNoExists} File does not exists.
     *  @param {String} path of file */
    self.deleteFile = function deleteFile (path) {
        var fileDescriptor = getFileDescriptor.call(this, path);
        fileDescriptor.deleteFile();
    };

    /** It deletes an existing directory.
     *  @method
     *  @exception {FileNoExists} File does not exists.
     *  @param {String} path directory */
    self.deleteDirectory = function deleteDirectory (path) {
        var fileDescriptor = getFileDescriptor.call(this, path);
        if (!fileDescriptor.deleteDirectory()) {
            throw {
                name: "DeleteError",
                message: "Directory is not void"
            };
        }
    };

    /** Read from 'path' file.
     * @method
     * @param {String} path where file is stored
     * @exception {TypeError} Throws a TypeError if path is not a regular file.
     * @return {String} */
    self.read = function read(path) {
        var fileDescriptor;
        var blob;

        fileDescriptor = getFileDescriptor(path);

        if (!(fileDescriptor.isFile())) {
            throw new TypeError("Path is not a regular file");
        }

        blob = fileDescriptor.read();

        return blob.toString();
    };

    /** Append data to 'path' file.
     * @method
     * @param {String} path where file is stored
     * @param {String} data should be written
     * @exception {TypeError} throws a TypeError if path is not a regular file. */
    self.append = function append(path, data) {
        write(path, data, true);
    };

    /** Overwrite data from 'path' file.
     * @method
     * @param {String} path
     * @param {String} data
     * @exception {TypeError} throws a TypeError if path is not a regular file. */
    self.overwrite = function overwrite(path, data) {
        write(path, data, false);
    };

    /** Rename a file to newName.
     * @method
     * @param {String} newName of file.
     * @param {String} path file which the name should be change.
     * @exception {TypeError} throws a TypeError if path is not a regular file. */
    self.rename = function rename(path, newName) {
        var fileDescriptor = getFileDescriptor(path);
        fileDescriptor.rename(newName);
    };

    /** Move a file from oldPath to newPath.
     * @method
     * @param {String} newPath where will be stored.
     * @param {String} oldPath where file is stored.
     * @exception {TypeError} throws a TypeError if destination is not valid. */
    self.move = function move(origin, destination) {
        var originFd = getFileDescriptor(origin);
        var destinationFd = getFileDescriptor(destination);
        
        if (destinationFd.exists()) {
            throw new TypeError("Destination already exists");
        }
        originFd.move(destination);
    };

    /** Copy a file from oldPath to newPath.
     * @method
     * @param {String} newPath where will be stored.
     * @param {String} oldPath where file is stored.
     * @exception {TypeError} throws a TypeError if destination is not valid. */
    self.copy = function copy(origin, destination) {
        var fileDescriptor = getFileDescriptor(origin);
        if (!(fileDescriptor.copy(destination))) {
            throw new TypeError("Invalid type for input parameter");
        }
    };

    self.listDirectory = function listDirectory(origin) {
        var fileDescriptor = getFileDescriptor(origin);
        var list = fileDescriptor.getDirectoryListing();

        if (!list) {
            throw new TypeError("Invalid type for input parameter");
        }

        return list;
    };

    return self;

}());

module.exports = Filesystem;