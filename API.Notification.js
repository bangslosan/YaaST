/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 *   createNotification
 *      Parameters of visualization
 *      must have{
 *          message: {String},
 *      }
 *      optional{
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
 *      Return {String} JSON Information of Notification created
 *
 */

"use strict";

var Notification = (function() {

    var _self = {};

    /** Private Function to Validate Toast Notification info
      *  @param: {Object} parameter with notification info
      *  @return : {Object} Notification info validated */
    var validateToastNotification = function validateToastNotification(parameter) {
        var keys = {'backgroundColor' : '', 'borderColor' : '', 'borderRadius' : '',
        'borderWidth' : '', 'message' : '', 'opacity' : '', 'fontSize' : '', 'fontWeight' : '',
        'textColor' : '', 'duration' : ''}, key, temp;
        if(typeof parameter.message === 'undefined'){
            parameter.message = '[WARN] Key message should be defined';
            parameter.validate = false;
        }
        else{
            temp = JSON.stringify(parameter);
            parameter.validate = true;
            for(key in JSON.parse(temp)){
                if(!keys.hasOwnProperty(key)){
                    parameter[key] = '[WARN] Key '+key+' is not valid';
                    parameter.validate = false;
                }
                else if((key === 'backgroundColor' || key === 'borderColor' ||
                key === 'message' || key === 'opacity' || key === 'textColor' ||
                key === 'duration') && typeof parameter[key] !== 'string'){
                    parameter[key] = '[WARN] Key '+key+' should be String';
                    parameter.validate = false;
                }
                else if((key === 'borderWidth' || key === 'borderRadius' || key === 'fontSize' ||
                key === 'fontWeight' || key === 'height')
                && typeof parameter[key] !== 'number'){
                    parameter[key] = '[WARN] Key '+key+' should be Number';
                    parameter.validate = false;
                }
                else if(key === 'duration' && typeof parameter.duration !== 'undefined' &&
                (parameter[key] !== 'DURATION_SHORT' || parameter[key !== 'DURATION_LONG'])){
                    parameter[key] = '[WARN] Key '+key+' should be DURATION_SHORT or DURATION_LONG';
                    parameter.validate = false;
                }
            }
            if(parameter.validate !== false){
                if(typeof parameter.opacity === 'undefined'){
                    parameter.opacity = 0.9;
                }
                if(typeof parameter.height === 'undefined'){
                    parameter.height = 100;
                }
                if(typeof parameter.borderColor === 'undefined'){
                    parameter.borderColor = '#D3D3D3';
                }
                if(typeof parameter.borderWidth === 'undefined'){
                    parameter.borderWidth = 1;
                }
                if(typeof parameter.borderRadius === 'undefined'){
                    parameter.borderRadius = 5;
                }
                if(typeof parameter.backgroundColor === 'undefined'){
                    parameter.backgroundColor = '#E6E6E6';
                }
                if(typeof parameter.fontSize === 'undefined'){
                    parameter.fontSize = 16;
                }
                if(typeof parameter.fontWeight === 'undefined'){
                    parameter.fontWeight = 'normal';
                }
                if(typeof parameter.textColor === 'undefined'){
                    parameter.textColor = '#000000';
                }
            }
        }
        return parameter;
    };

    /** Private Function to Create Custom Toast Notification (iOS)
      *  @param: {Object} [contact] parameter with notification info
      *  @return : {TiProxyView} Notification */
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
	  *  @param: {Object} parameter notification info
	  *  @return : Object Notification */
	_self.createNotification = function createNotification(parameter) {
		parameter = validateToastNotification(parameter);
		if(parameter.validate !== false){
			delete parameter.validate;
			createToastNotification(parameter);
		}
		return parameter;
	};

	return _self;

}());

module.exports = Notification;
