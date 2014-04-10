/*
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 *  Test Configuration Wirecloud Instance:
 *  mainURL    : 'http://138.100.12.106:8088/'
 *  loginURL   : 'http://138.100.12.106:8088/login'
 *  oauthURL   : 'http://138.100.12.106:8088/'
 *  tokenURL   : 'http://138.100.12.106:8088/'
 *  typeServer : 'wirecloud'
 *
 *  ****************************************************
 *
 *   login
 *      Username, Password and Callback Function
 *      Return {String} ["Error Credential", "Error Server", "Success Credential"]
 *
 *   getWorkspacesInfo
 *      Callback Function
 *      Return {String} JSON Information of Workspaces
 *
 *   getWorkspaceInfo
 *      Workspace Identifier and Callback Function
 *      Return {String} JSON Information if Workspace exist
 *
 *   createWorkspace
 *      Workspace parameters, creation flag and Callback Function
 *      IF flag == TRUE
 *          Workspace will be created from Catalogue
 *          using parameters{
 *              name: {String},
 *              vendor: {String},
 *              version: {String} like 1.0, 1.0.1, 1.0.0.1, ...
 *          }
 *      else
 *          Workspace must have parameters {
 *              name: {String}
 *          }
 *      Return {String} JSON Information of new Workspace
 *
 *   deleteWorkspace
 *      Workspace identifier and Callback Function
 *      Return No Content
 *
 *   createTab
 *      Workspace identifier, parameters and Callback Function
 *      Tab must have parameters {
 *          name: {String}
 *      }
 *      Return {String} JSON Information of new Tab
 *
 *   deleteTab
 *      Workspace and Tab Identifier and Callback Function
 *      Return No Content
 *
 *   getResourcesInfo
 *      Callback Function
 *      Return {String} JSON Information of Resources
 *
 *   getMarketsInfo
 *      Callback Function
 *      Return {String} JSON Information of MarketPlaces
 *
 *   addWidget
 *      Workspace and Tab Identifier, parameters and Callback Function
 *      Widget will be created from Catalogue
 *          using parameters{
 *              name: {String},
 *              vendor: {String},
 *              version: {String} like 1.0, 1.0.1, 1.0.0.1, ...
 *          }
 *      Return {String} JSON Information of New Widget added
 *
 *   updateWidget
 *      Workspace, Tab and Widget Identifier, parameters and Callback Function
 *      Widget might have parameters {
 *          name: {String},
 *          left: {Number},
 *          top: {Number},
 *          width: {Number},
 *          height: {Number}
 *      }
 *      Return No Content
 *
 *   updateWidgetPref
 *      Workspace, Tab and Widget Identifier, parameters and Callback Function
 *      There is not restriction about parameters
 *      Return No Content
 *
 *   deleteWidget
 *      Workspace, Tab and Widget Identifier and Callback Function
 *      Return No Content
 *
 *   searchElement
 *      Parameters and Callback Function
 *      Search might have parameters {
 *          orderby: {String} ["author", "short_name", "vendor"
 *                             "-creation_date", "-popularity"]
 *          search_criteria: {String}
 *          type: {String} ["Composition", "Component"]
 *      }
 *      Return {String} JSON Information of Search Results
 *
 *   makeRequest
 *      Parameters and Callback Function
 *      Request must have parameters {
 *          url: {String}
 *          options: {
 *              method: {String} HTTP Method
 *              encoding: {String} Codification like "UTF-8"
 *              content-type: {String}
 *              parameters: {Object} POST or PUT fields
 *          }
 *      }
 *      Return {Object} HTTP Connection {state, responseText, responseData, ...}
 *
 *   getNetwork
 *      Return {String} Network Name ["NONE", "WIFI", "LAN", "MOBILE", "UNKNOWN"]
 *
 *   isOnline
 *      Return {Boolean} Network Status
 *
 */

"use strict";

var Network = (function () {

    /** It contains several useful methods to manage network.
     * @author Alejandro FCarrera
     * @version 1.0.0
     * @alias API.Network
     * @namespace */
    var _self = {},
    mainURL = 'http://138.100.12.106:8088/',
    loginURL = 'http://138.100.12.106:8088/login',
    oauthURL = 'http://138.100.12.106:8088/',
    tokenURL = 'http://138.100.12.106:8088/',
    typeServer = 'wirecloud',
    tim = 90000;

    /** Private function to connect Wirecloud
     *  @param {Object} data: username, password, cookie
     *  @param {Function} callback */
    var loginWirecloud = function loginWirecloud(data, callback){
        var csrftoken = data.cook.substr(10, 32), boundary,
        sessionid = data.cook.substr(data.cook.indexOf('sessionid')+10, 32),
        client = Ti.Network.createHTTPClient({
            onload: function(e) {
                if(this.responseText.indexOf('csrfmiddlewaretoken') === -1 &&
                   this.responseText.indexOf('CSRF verification failed') === -1){
                    Ti.App.Properties.setString('cookie_csrftoken', csrftoken);
                    Ti.App.Properties.setString('cookie_sessionid', sessionid);
                    callback('Success Credential');
                }
                else{
                    callback('Error Credential');
                }
            },
            onerror: function(e) {
                callback('Error Server');
            },
            timeout: tim
        });
        boundary = Ti.Network.encodeURIComponent('csrfmiddlewaretoken') + '=' + Ti.Network.encodeURIComponent(csrftoken) +
             '&' + Ti.Network.encodeURIComponent('username') + '=' + Ti.Network.encodeURIComponent(data.user) +
             '&' + Ti.Network.encodeURIComponent('password') + '=' + Ti.Network.encodeURIComponent(data.pass);
        client.open("POST", loginURL);
        client.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        client.clearCookies(loginURL);
        client.clearCookies(mainURL);
        client.setRequestHeader("Cookie", "csrftoken=" + csrftoken);
        client.setRequestHeader("Cookie", "sessionid=" + sessionid);
        client.send(boundary);
    };

    /** Private function to connect FiWare
     *  @param {Object} data: username, password, cookie
     *  @param {Function} callback */
    var loginFiWare = function loginFiWare(data, callback){
        var idm_session = data.cook.substr(21, 222), boundary,
        client = Ti.Network.createHTTPClient({
            onload: function(e) {
                if(this.getResponseText().indexOf('Signed in successfully') !== -1){
                    callback('Success Credential');
                }
                else{
                    callback('Error Credential');
                }
            },
            onerror: function(e) {
                if(this.status === 401){
                    callback('Error Credential');
                }
                else{
                    callback('Error Server');
                }
            },
            timeout: tim
        });
        boundary = Ti.Network.encodeURIComponent('authenticity_token') + '=' + Ti.Network.encodeURIComponent(data.csrf) +
             '&' + Ti.Network.encodeURIComponent('user[email]') + '=' + Ti.Network.encodeURIComponent(data.user) +
             '&' + Ti.Network.encodeURIComponent('user[password]') + '=' + Ti.Network.encodeURIComponent(data.pass);
        client.open("POST", loginURL);
        client.setRequestHeader("Accept", 'text/html');
        client.setRequestHeader("Content-Type",'application/x-www-form-urlencoded');
        client.clearCookies(loginURL);
        client.clearCookies(mainURL);
        client.setRequestHeader("Cookie", '_fi-ware-idm_session=' + idm_session);
        client.send(boundary);
    };

    /** Private function to connect AppBase
     *  @param {Object} data: username, password, cookie
     *  @param {Function} callback */
    var loginAppBase = function loginAppBase(data, callback){

    };

    /** Private Function to Request API */
    var requestAPI = function requestAPI(path, method, operation, callback, values){
        var url = mainURL + path,
        client = Ti.Network.createHTTPClient({
            onload: function(e) {
                callback(this.responseText);
            },
            onerror: function(e) {
                callback('Error '+operation);
            },
            timeout: tim
        });
        client.open(method, url);
        client.setRequestHeader("Accept", 'application/json');
        client.setRequestHeader("Content-Type", 'application/json; charset=utf-8');
        client.clearCookies(mainURL);
        if (typeServer === 'fiware'){
            client.setRequestHeader("Cookie", "oil_sid=" + Ti.App.Properties.getString('cookie_oilsid'));
        }
        else if(typeServer === 'wirecloud'){
            client.setRequestHeader("Cookie", "csrftoken=" + Ti.App.Properties.getString('cookie_csrftoken'));
            client.setRequestHeader("Cookie", "sessionid=" + Ti.App.Properties.getString('cookie_sessionid'));
        }
        else {
            client.setRequestHeader("Cookie", "custom_cookie="+"appbasecookie");
        }
        if(method === 'POST' || method === 'PUT'){
            client.send(JSON.stringify(values));
        }
        else{
            client.send();
        }
    };

	/** HTTP or HTTPS Basic Login
	 *  @param {String} username
	 *  @param {String} password
	 *  @param {Function} callback */
	_self.login = function login(username, password, callback) {
		var client = Ti.Network.createHTTPClient({
			onload: function(e) {
			    var data = {
			        'user': username,
			        'pass': password,
			        'cook': this.getResponseHeader('Set-Cookie')
			    };
			    if(typeServer === 'wirecloud') {
			        loginWirecloud(data, function(response){
			            callback(response);
                    });
			    }
			    else if(typeServer === 'fiware') {
			        var pos = this.getResponseText().indexOf('name="csrf-token"');
			        data.csrf = this.getResponseText().substr(pos-46, 44);
                    loginFiWare(data, function(response){
                        callback(response);
                    });
			    }
			    else if(typeServer === 'appbase') {
                    loginAppBase(data, function(response){
                        callback(response);
                    });
			    }
			    else {
			        callback('Error Configuration');
			    }
			},
			onerror : function(e) {
				callback('Error Server');
			},
			timeout: tim
		});
		client.open("GET", loginURL);
		client.setRequestHeader("Content-Type", 'text/html');
        client.clearCookies(loginURL);
		client.clearCookies(mainURL);
		client.send();
	};

	/** Get Workspaces (All) Information
	 *  @param {Function} callback */
	_self.getWorkspacesInfo = function getWorkspacesInfo(callback) {
		requestAPI('api/workspaces', 'GET', 'getWorkspacesInfo', function(response){
		    callback(response);
		});
	};

    /** Get Workspace Information
     *  @param {Number} id
     *  @param {Function} callback */
    _self.getWorkspaceInfo = function getWorkspaceInfo(id, callback) {
        if(id >= 0){
            requestAPI('api/workspace/'+id, 'GET', 'getWorkspaceInfo', function(response){
                callback(response);
            });
        }
        else{
            callback('Error getWorkspaceInfo');
        }
    };

    /** Create Workspace Mashup
     *  @param {Object} options
     *  @param {Function} callback */
    _self.createWorkspace = function createWorkspace(options, mashup, callback) {
        var state = true;
        if(mashup === true){
            var key, keys = {'vendor':'', 'name':'', 'version':''};
            for(key in keys){
                if(!options.hasOwnProperty(key)){
                    state = false;
                    break;
                }
            }
            if(state === true){
                options = {
                    'mashup': options.vendor + '/' + options.name + '/' + options.version,
                    'dryrun': false
                };
            }
        }
        else {
            if(!options.hasOwnProperty('name')){
                state = false;
            }
            else{
                options = {
                    'name': options.name
                };
            }
        }
        if(state === true){
            requestAPI('api/workspaces', 'POST', 'createWorkspace', function(response){
                callback(response);
            }, options);
        }
        else{
            callback('Error createWorkspace');
        }
    };

    /** Delete Workspace Mashup
     *  @param {Number} id
     *  @param {Function} callback */
    _self.deleteWorkspace = function deleteWorkspace(id, callback) {
        if(id >= 0){
            requestAPI('api/workspace/'+id, 'DELETE', 'deleteWorkspace', function(response){
                callback(response);
            });
        }
        else{
            callback('Error deleteWorkspace');
        }
    };

    /** Create Workspace Tab
     *  @param {Number} idWorkspace
     *  @param {Object} Options
     *  @param {Function} callback */
    _self.createTab = function createTab(idWorkspace, options, callback) {
        var state = true;
        if(!options.hasOwnProperty('name')){
            callback('Error createTab');
            state = false;
        }
        else{
            options = {
                'name': options.name
            };
        }
        if(idWorkspace >= 0 && state === true){
            requestAPI('api/workspace/'+idWorkspace+'/tabs', 'POST', 'createTab', function(response){
                callback(response);
            }, options);
        }
        else{
            callback('Error createTab');
        }
    };

    /** Delete Workspace Tab
     *  @param {Number} idWorkspace
     *  @param {Number} id
     *  @param {Function} callback */
    _self.deleteTab = function deleteTab(idWorkspace, id, callback){
        if(idWorkspace >= 0 && id >=0){
            requestAPI('api/workspace/'+idWorkspace+'/tabs/'+id, 'DELETE',
            'deleteTab', function(response){
                callback(response);
            });
        }
        else{
            callback('Error deleteTab');
        }
    };

    /** Get Resources (All) Information
     *  @param {Function} callback */
    _self.getResourcesInfo = function getResourcesInfo(callback) {
        requestAPI('api/resources', 'GET', 'getResourceInfo', function(response){
            callback(response);
        });
    };

    /** Get Market (All) Information
     *  @param {Function} callback */
    _self.getMarketsInfo = function getMarketsInfo(callback) {
        requestAPI('api/markets', 'GET', 'getMarketsInfo', function(response){
            callback(response);
        });
    };

    /** Add Widget To Workspace Mashup (Tab)
     *  @param {Number} idWorkspace
     *  @param {Number} idTab
     *  @param {Object} options
     *  @param {Function} callback */
    _self.addWidget = function addWidget(idWorkspace, idTab, options, callback) {
        var state = true, keys = {'vendor':'', 'name':'', 'version':''}, key;
        for(key in keys){
            if(!options.hasOwnProperty(key)){
                state = false;
                break;
            }
        }
        if((idWorkspace < 0 || idTab < 0) && state === true){
            state = false;
        }
        if(state === true){
            requestAPI('api/workspace/'+idWorkspace+'/tab/'+idTab+'/iwidgets', 'GET',
            'addWidget', function(response){
                callback(response);
            }, options);
        }
        else{
            callback('Error addWidget');
        }

    };

    /** Update Widget Information of Workspace Mashup (Tab)
     *  @param {Number} idWorkspace
     *  @param {Number} idTab
     *  @param {Number} id
     *  @param {Object} options
     *  @param {Function} callback */
    _self.updateWidget = function updateWidget(idWorkspace, idTab, id, options, callback) {
        var state = true, keys = {'name':'', 'left':'', 'top':'', 'width': '', 'height':''}, key;
        for(key in options){
            if(!keys.hasOwnProperty(key)){
                state = false;
                break;
            }
        }
        if((idWorkspace < 0 || idTab < 0 || id < 0) && state === true){
            state = false;
        }
        if(state === true){
            requestAPI('api/workspace/'+idWorkspace+'/tab/'+idTab+'/iwidgets/'+id, 'POST',
            'updateWidget', function(response){
                callback(response);
            }, options);
        }
        else{
            callback('Error updateWidget');
        }
    };

    /** Update Widget Preferences of Workspace Mashup (Tab)
     *  @param {Number} idWorkspace
     *  @param {Number} idTab
     *  @param {Number} id
     *  @param {Object} options
     *  @param {Function} callback */
    _self.updateWidgetPref = function updateWidgetPref(idWorkspace, idTab, id, options, callback) {
        if(idWorkspace >= 0 && idTab >= 0 && id >= 0){
            requestAPI('api/workspace/'+idWorkspace+'/tab/'+idTab+'/iwidgets/'+id+'/preferences',
            'POST', 'updateWidgetPref', function(response){
                callback(response);
            }, options);
        }
        else{
            callback('Error updateWidgetPref');
        }
    };

    /** Delete Widget From Workspace Mashup (Tab)
     *  @param {Number} idWorkspace
     *  @param {Number} idTab
     *  @param {Number} id
     *  @param {Function} callback */
    _self.deleteWidget = function deleteWidget(idWorkspace, idTab, id, callback) {
        if(idWorkspace >= 0 && idTab >= 0 && id >= 0){
            requestAPI('api/workspace/'+idWorkspace+'/tab/'+idTab+'/iwidgets/'+id, 'DELETE',
            'deleteWidget', function(response){
                callback(response);
            });
        }
        else{
            callback('Error deleteWidget');
        }
    };

    /** Search Element (Component | Composition)
     *  @param {Object} options
     *  @param {Function} callback */
    _self.searchElement = function searchElement(options, callback) {
        var url;
        if (options.hasOwnProperty('search_criteria')) {
            url = "catalogue/search/simple_or/1/100";
        }
        else {
            url = "catalogue/resources/1/100";
        }
        url = url + "?" + "orderby=" + options.orderby;
        url = url + "&search_criteria=" + options.search_criteria +
              "&scope=" + options.type + "&search_boolean=AND";
        requestAPI(url, 'GET', 'searchElement', function(response){
            callback(response);
        });
    };

    /** Make HTTP Request
     *  @param {Object} data
     *  @param {Function} callback */
    _self.makeRequest = function makeRequest(data, callback) {
        var i, client = Ti.Network.createHTTPClient({
            onload: function(e) {
                callback(this);
            },
            onerror: function(e) {
                callback(this);
            },
            timeout: tim
        });
        client.open(data.options.method, data.url);
        var enc = (!data.options.encoding) ? "charset=UTF-8" : "charset=" + data.options.encoding;
        if (!data.options.contentType){
            client.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded; ' + enc);
        }
        else{
            client.setRequestHeader("Content-Type", data.options.contentType + "; " + enc);
        }
        client.clearCookies(data.url);
        if (data.options.requestHeaders) {
            for (i in data.options.requestHeaders) {
                client.setRequestHeader(i, data.options.requestHeaders[i]);
            }
        }
        if (data.options.parameters && data.options.method !== 'GET') {
            client.send(JSON.stringify(data.options.parameters));
        }
        else{
            client.send();
        }
    };

    /** Get Network Name
     *  @result {String} networkName */
    _self.getNetwork = function getNetwork(){
        return Ti.Network.getNetworkTypeName();
    };

    /** Get Online Activity Device
     *  @result {Boolean} state */
    _self.isOnline = function isOnline(){
        return Ti.Network.getOnline();
    };

    /** Events Listeners of Network */
    _self.events = {
        'networkchange': {
            event: 'change',
            listener: Ti.Network,
            keylist: ['networkTypeName', 'online', 'reason'],
            source: 'Ti.Network',
        }
    };

    return _self;

}());

module.exports = Network;