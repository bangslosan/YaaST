/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

/**
 * Toast notification.
 * @typedef {Object} Notification
 * @property {String} message
 * @property {Number} [height=100]
 * @property {Number} [opacity=1] 0 or 1
 * @property {String} [borderColor=#D3D3D3]
 * @property {Number} [borderWidth=1]
 * @property {Number} [borderRadius=5]
 * @property {String} [backgroundColor=#E6E6E6]
 * @property {Number} [fontSize=16]
 * @property {String} [fontWeight=normal] 'bold' or 'normal'
 * @property {String} [textColor=#000000]
 */

"use strict";

var Notification = function (APIReferences) {

    var Yaast = {
        API: APIReferences
    };

    /** It contains a method to manage notifications.
     * @author Alejandro FCarrera
     * @version 1.0.0
     * @alias API.Notification
     * @namespace */
    var _self = {};

    /** Private Function to Validate Toast Notification info
      *  @param: {Object} notification with notification info
      *  @return {Notification} notification info validated */
    var validateToastNotification = function validateToastNotification(notification) {
        var keys = {'backgroundColor' : '', 'borderColor' : '', 'borderRadius' : '',
        'borderWidth' : '', 'message' : '', 'opacity' : '', 'fontSize' : '', 'fontWeight' : '',
        'textColor' : '', 'duration' : ''}, key, temp;
        if(typeof notification.message === 'undefined'){
            notification.message = '[WARN] Key message should be defined';
            notification.validate = false;
        }
        else{
            temp = JSON.stringify(notification);
            notification.validate = true;
            for(key in JSON.parse(temp)){
                if(!keys.hasOwnProperty(key)){
                    notification[key] = '[WARN] Key '+key+' is not valid';
                    notification.validate = false;
                }
                else if((key === 'backgroundColor' || key === 'borderColor' ||
                key === 'message' || key === 'opacity' || key === 'textColor' ||
                key === 'duration') && typeof notification[key] !== 'string'){
                    notification[key] = '[WARN] Key '+key+' should be String';
                    notification.validate = false;
                }
                else if((key === 'borderWidth' || key === 'borderRadius' || key === 'fontSize' ||
                key === 'fontWeight' || key === 'height')
                && typeof notification[key] !== 'number'){
                    notification[key] = '[WARN] Key '+key+' should be Number';
                    notification.validate = false;
                }
                else if(key === 'duration' && typeof notification.duration !== 'undefined' &&
                (notification[key] !== 'DURATION_SHORT' || notification[key !== 'DURATION_LONG'])){
                    notification[key] = '[WARN] Key '+key+' should be DURATION_SHORT or DURATION_LONG';
                    notification.validate = false;
                }
            }
            if(notification.validate !== false){
                if(typeof notification.opacity === 'undefined'){
                    notification.opacity = 0.9;
                }
                if(typeof notification.height === 'undefined'){
                    notification.height = 100;
                }
                if(typeof notification.borderColor === 'undefined'){
                    notification.borderColor = '#D3D3D3';
                }
                if(typeof notification.borderWidth === 'undefined'){
                    notification.borderWidth = 1;
                }
                if(typeof notification.borderRadius === 'undefined'){
                    notification.borderRadius = 5;
                }
                if(typeof notification.backgroundColor === 'undefined'){
                    notification.backgroundColor = '#E6E6E6';
                }
                if(typeof notification.fontSize === 'undefined'){
                    notification.fontSize = 16;
                }
                if(typeof notification.fontWeight === 'undefined'){
                    notification.fontWeight = 'normal';
                }
                if(typeof notification.textColor === 'undefined'){
                    notification.textColor = '#000000';
                }
            }
        }
        return notification;
    };

    /** Private Function to Create Custom Toast Notification (iOS)
      *  @param: {Object} contact with notification info
      *  @return {TiProxyView} Notification */
    var createToastNotification = function createToastNotification(contact) {
        var window = Ti.UI.createWindow({
            touchEnabled: false
        }),
        notification = Ti.UI.createView({
            top: Ti.App.platformHeight - (30 + contact.height),
            height: contact.height,
            width: Ti.Platform.displayCaps.getPlatformWidth() - 100,
            borderColor: contact.borderColor,
            borderWidth: contact.borderWidth,
            borderRadius: contact.borderRadius,
            backgroundColor: contact.backgroundColor,
            opacity: contact.opacity
        });
        notification.add(Ti.UI.createLabel({
            text: contact.message,
            color: contact.textColor,
            width: 'auto',
            height: 'auto',
            textAlign: 'center',
            font:{
                fontFamily:'Helvetica Neue',
                fontSize: contact.fontSize,
                fontWeight: contact.fontWeight
            }
        }));
        window.add(notification);
        notification = null;
        var interval = 2000;
        if(contact.duration === 'DURATION_SHORT'){
            interval = 1500;
        }
        else if(contact.duration === 'DURATION_LONG'){
            interval = 5000;
        }
        window.open();
        setTimeout(function(){
            window.close({
                opacity: 0,
                duration: 1000
            });
            window = null;
        }, interval);
    };

	/** Create Toast Notification
	  *  @param: {Object} notification info
	  *  @return {Notification} notification info */
	_self.createNotification = function createNotification(notification) {
		notification = validateToastNotification(notification);
		if(notification.validate !== false){
			delete notification.validate;
			createToastNotification(notification);
		}
		return notification;
	};

	return _self;

};

module.exports = Notification;
