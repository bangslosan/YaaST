/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 *   getAuthorization
 *      Request authorization if permission is AUTHORIZATION_UNKNOWN
 *      Return [AUTHORIZATION_AUTHORIZED | AUTHORIZATION_RESTRICTED] in callback
 *
 *   getContactList
 *      Optional Search with Object with property 'value' like name, middlename, combination, etc
 *      Return Contact Array
 *
 *   createContact
 *      Parameters of Contact
 *         address:  {Object}
 *                   keys = home, work or other
 *                   values = {Object Array}
 *                           keys = CountryCode, Street, City, County, State, Country, ZIP
 *                           values = {String}
 *         birthday: {String} Date Format ISO8601 (2013-09-23T22:03:46.000+0000)
 *         date:     {Object}
 *                   keys = anniversary or other
 *                   values = {String Array} Date Format ISO8601
 *         email:    {Object}
 *                   keys = home, work or other
 *                   values = {String Array}
 *         im:       {Object}
 *                   keys = home, work or other
 *                   values = {Object Array}
 *                           keys = service, username
 *                           - service = AIM, Facebook, GaduGadu, GoogleTalk, ICQ, MSN, QQ, Skype or Yahoo
 *                           - username = {String}
 *         image:    {String} Base64 Representation of Ti.Blob
 *         name:     {String} Concatenation of firstname and middlename
 *         surname:  {String} Representation of lastname
 *         nick:     {String} Representation of nickname
 *         note:     {String}
 *         phone:    {Object}
 *                   keys = home, work, other, mobile, pager, workFax, homeFax or main
 *                   values = {String}
 *         organization = {String}
 *         website:  {Object}
 *                   keys = homepage, home, work or other
 *                   values = {String Array}
 *      Return Contact Object
 *
 *   deleteContact
 *      Search with parameter (name, middlename, lastname or combination)
 *      Return status code [0 = Success, 1 = Not Found, 2 = Multiple Contacts Found]
 *
 *   saveChanges
 *
 */

"use strict";

var Contacts = function (APIReferences) {

    var Yaast = {
        API: APIReferences
    };

    /** It allows to manage local contacts from device.
     * @author Alejandro FCarrera
     * @version 1.0.0
     * @alias API.Contacts
     * @namespace */
    var _self = {
        'tempContacts': []
    };
    var _isApple = Yaast.API.HW.System.isApple();

    /** Get Authorization Property
     * @param {Function} callback
     * @return {String} state */
    _self.getAuthorization = function(callback) {
        var auth = Ti.Contacts.getContactsAuthorization();
        if(auth === Ti.Contacts.AUTHORIZATION_UNKNOWN){
            Ti.Contacts.requestAuthorization(function(){
                auth = (auth === Ti.Contacts.AUTHORIZATION_AUTHORIZED) ?
                    'AUTHORIZATION_AUTHORIZED' : 'AUTHORIZATION_RESTRICTED';
                callback(auth);
            });
        }
        else{
            auth = (auth === Ti.Contacts.AUTHORIZATION_AUTHORIZED) ?
                'AUTHORIZATION_AUTHORIZED' : 'AUTHORIZATION_RESTRICTED';
            callback(auth);
        }
        auth = null;
    };

    /** Get Contact List
     * @param {Object} optional
     * @return {Array} list */
    _self.getContactList = function getContactList(options) {
        var list = [], i, newPerson, name,
        people = Ti.Contacts.getAllPeople();
        for(i = 0; i < people.length; i++){
            if(people[i].getFirstName() === null || people[i].getFirstName() === undefined){
                name = people[i].getFullName();
            }
            else if((people[i].getMiddleName() !== null && _isApple) ||
                (people[i].getMiddleName() !== undefined && !_isApple)){
                name = people[i].getFirstName() + ' ' + people[i].getMiddleName();
            }
            else if((people[i].getMiddleName() === null && _isApple) ||
                (people[i].getMiddleName() === undefined && !_isApple)){
                name = people[i].getFirstName();
            }
            newPerson = {
                'address': (people[i].getAddress() === undefined) ? {} : people[i].getAddress(),
                'birthday': (people[i].getBirthday() !== null) ? people[i].getBirthday() : '',
                'date': (people[i].getDate() === undefined) ? {} : people[i].getDate(),
                'email': (people[i].getEmail() === undefined) ? {} : people[i].getEmail(),
                'id': (_isApple) ? people[i].getRecordId() : people[i].getId(),
                'im': (people[i].getInstantMessage() === undefined) ? {} : people[i].getInstantMessage(),
                'image' : (people[i].getImage()) ? 'data:image/png;base64,' +
                            Ti.Utils.base64encode(people[i].getImage()).toString() : '',
                'name': name,
                'surname': ((people[i].getLastName() !== null && _isApple) ||
                            (people[i].getLastName() !== undefined && !_isApple))
                            ? people[i].getLastName() : '',
                'fullname': people[i].getFullName(),
                'nick': ((people[i].getNickname() !== null && _isApple) ||
                            (people[i].getNickname() !== undefined && !_isApple))
                            ? people[i].getNickname() : '',
                'note': ((people[i].getNote() !== null && _isApple) ||
                            (people[i].getNote() !== undefined && !_isApple))
                            ? people[i].getNote() : '',
                'phone': (people[i].getPhone() === undefined) ? {} : people[i].getPhone(),
                'organization': ((people[i].getOrganization() !== null && _isApple) ||
                            (people[i].getOrganization() !== undefined && !_isApple))
                            ? people[i].getOrganization() : '',
                'website': (people[i].getUrl() === undefined) ? {} : people[i].getUrl()
            };
            if(options && options.value){
                options.value = options.value.toLowerCase();
                if(newPerson.fullname.toLowerCase().indexOf(options.value) !== -1){
                    list.push(newPerson);
                }
            }
            else{
                list.push(newPerson);
            }
            newPerson = null;
            name = null;
        }
        return list;
    };

    /** Private Function to validate Name
      * @param {String} name
      * @return {Object} */
    var validateName = function validateName(name) {
        var firstname = name, middlename = '', param, i;
        if(name.indexOf(' ') > 0) {
            param = name.split(' ');
            firstname = param[0];
            middlename = param[1];
            for(i = 2; i < param.length; i++){
                middlename = middlename + ' ' + param[i];
            }
        }
        return {
            'firstname' : firstname,
            'middlename' : middlename
        };
    };

    /** Private Function to validate single Date
      * @param {String} date
      * @return {Boolean} */
    var validateSingleDate = function validateSingleDate(date){
        var _exprISO8601 = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
        "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
        "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?", result;
        if(date.match(new RegExp(_exprISO8601)) === null){
            result = false;
        }
        else{
            result = new Date(date).toDateString !== 'Invalid Date';
        }
        return result;
    };

    /** Private Function to validate Multi Date
      * @param {Object} multiDate
      * @return {Object} */
    var validateMultiDate = function validateMultiDate(multiDate) {
        var keys = {'anniversary' : '', 'other' : ''}, key, i;
        for(key in multiDate){
            if(!keys.hasOwnProperty(key)){
                multiDate[key] = '[WARN] Key birthday '+key+' is not a valid key';
                multiDate.validate = false;
            }
            else if(Array.isArray(multiDate[key]) === false){
                multiDate[key] = '[WARN] Key birthday '+key+' should be Array';
                multiDate.validate = false;
            }
            else{
                for(i = 0; i < multiDate[key].length; i++){
                    if(!validateSingleDate(multiDate[key][i])){
                        multiDate[key] = '[WARN] Key birthday '+key+' have not valid date or format';
                        multiDate.validate = false;
                        break;
                    }
                }
            }
        }
        return multiDate;
    };

    /** Private Function to validate multi value String
      * @param {Object} multiValue
      * @param {String} type
      * @return {Object} */
    var validateMultiValue = function validateMultiValue(multiValue, type) {
        var keys = {'home' : '', 'work' : '', 'other' : ''}, key, i;
        if(type === 'website'){
            keys.homepage = '';
        }
        else if(type === 'phone'){
            keys = {'home' : '', 'work' : '', 'other' : '' ,
            'mobile' : '', 'pager' : '', 'workFax' : '',
            'homeFax' : '', 'main' : ''};
            if(_device === 'ios'){
                keys.iphone = '';
            }
        }
        for(key in multiValue){
            if(!keys.hasOwnProperty(key)){
                multiValue[key] = '[WARN] Key '+type+' '+key+' is not a valid key';
                multiValue.validate = false;
            }
            else if(Array.isArray(multiValue[key]) === false){
                multiValue[key] = '[WARN] Key '+type+' '+key+' should be Array';
                multiValue.validate = false;
            }
            else{
                for(i = 0; i < multiValue[key].length; i++){
                    if(typeof (multiValue[key][i]) !== 'string'){
                        multiValue[key] = '[WARN] Key '+type+' '+key+' have not valid '+type;
                        multiValue.validate = false;
                        break;
                    }
                }
            }
        }
        return multiValue;
    };

    /** Private Function to validate Single Instant Messaging
      * @param {Object} singleIm
      * @return {Object} */
    var validateSingleIM = function validateSingleIM(singleIm){
        var services = {'AIM' : '', 'Facebook' : '', 'GaduGadu' : '' ,
                     'GoogleTalk' : '', 'ICQ' : '', 'MSN' : '',
                     'QQ' : '', 'Skype' : '', 'Yahoo' : ''}, key,
        keys = {'service' : '', 'username' : ''};
        for(key in singleIm){
            if(!keys.hasOwnProperty(key)){
                singleIm[key] = '[WARN] Key Instant Messaging '+key+' is not a valid key';
                singleIm.validate = false;
            }
            else if(key === 'service'){
                if(!services.hasOwnProperty(singleIm[key])){
                    singleIm[key] = '[WARN] Key Instant Messaging '+singleIm[key]+' is not a valid service';
                    singleIm.validate = false;
                }
            }
            else if(key === 'username'){
                if(typeof singleIm[key] !== 'string'){
                    singleIm[key] = '[WARN] Key Instant Messaging '+singleIm[key]+' is not a valid format of username';
                    singleIm.validate = false;
                }
            }
        }
        return singleIm;
    };

    /** Private Function to validate Instant Messaging
      * @param {Object} multiIm
      * @return {Object} */
    var validateMultiIM = function validateMultiIM(multiIm) {
        var keys = {'home' : '', 'work' : '', 'other' : ''}, key, i;
        for(key in multiIm){
            if(!keys.hasOwnProperty(key)){
                multiIm[key] = '[WARN] Key Instant Messaging '+key+' is not a valid key';
                multiIm.validate = false;
            }
            else if(Array.isArray(multiIm[key]) === false){
                multiIm[key] = '[WARN] Key Instant Messaging '+key+' should be Array';
                multiIm.validate = false;
            }
            else{
                for(i = 0; i < multiIm[key].length; i++){
                    if(typeof multiIm[key][i] !== 'object'){
                        multiIm[key][i] = '[WARN] Key Instant Messaging '+key+' should be Object';
                    }
                    else{
                        multiIm[key][i] = validateSingleIM(multiIm[key][i]);
                        if(multiIm[key][i].hasOwnProperty('validate')){
                            delete multiIm[key][i].validate;
                            multiIm.validate = false;
                        }
                    }
                }
            }
        }
        return multiIm;
    };

    /** Private Function to validate Single Address Object
      * @param {Object} element
      * @param {Number} index
      * @param {Array} array
      * @return {Boolean} */
    var validateSingleAddress = function validateSingleAddress(element, index, array) {
        var keys = {'Street' : '', 'City' : '', 'State' : '' , 'Country' : '', 'ZIP' : ''}, key;
        if (_device === 'android'){
            keys.CountryCode = '';
            keys.County = '';
        }
        for(key in element){
            if(!keys.hasOwnProperty(key)){
                element[key] = '[WARN] Key address '+key+' is not a valid key';
                element.validate = false;
            }
        }
        return true;
    };

    /** Private Function to validate Multi Address Object
      * @param {Object} multiAddress
      * @return {Object} */
    var validateMultiAddress = function validateMultiAddress(multiAddress) {
        var keys = {'home' : '', 'work' : '' , 'other' : ''}, key;
        for(key in multiAddress){
            if(!keys.hasOwnProperty(key)){
                multiAddress[key] = '[WARN] Key address '+key+' is not a valid key';
                multiAddress.validate = false;
            }
            else if(Array.isArray(multiAddress[key]) === false){
                multiAddress[key] = '[WARN] Key address '+key+' should be Array';
                multiAddress.validate = false;
            }
            else{
                multiAddress[key].every(validateSingleAddress);
            }
        }
        return multiAddress;
    };

    /** Private Function to validate parameters
      * @param {Object} parameter
      * @return {Object} */
    var validateContact = function validateContact(parameter) {
        var keys = {'address' : '', 'birthday' : '', 'date' : '',
        'email' : '' , 'im': '', 'image' : '', 'name' : '',
        'surname' : '', 'nick' : '', 'note' : '', 'phone' : '',
        'organization' : '', 'website' : ''}, key, temp = JSON.stringify(parameter);
        parameter.validate = true;
        for(key in JSON.parse(temp)){
            if(!keys.hasOwnProperty(key)){
                parameter[key] = '[WARN] Key '+key+' is not valid';
                parameter.validate = false;
            }
            else if((key === 'address' || key === 'date' || key === 'date' ||
            key === 'email' || key === 'im' || key === 'phone' ||
            key === 'website') && typeof parameter[key] !== 'object'){
                parameter[key] = '[WARN] Key '+key+' should be Object';
                parameter.validate = false;
            }
            else if((key === 'birthdate' || key === 'image' || key === 'name' ||
            key === 'surname' || key === 'nick' || key === 'note' ||
            key === 'organization') && typeof parameter[key] !== 'string'){
                parameter[key] = '[WARN] Key '+key+' should be String';
                parameter.validate = false;
            }
            else if(key === 'address'){
                parameter.address = validateMultiAddress(parameter.address);
                if(parameter.address.validate === false){
                    delete parameter.address.validate;
                    parameter.validate = false;
                }
            }
            else if(key === 'birthday'){
                if(!validateSingleDate(parameter.birthday)){
                    parameter.birthday = '[WARN] Key birthday is not valid date or format';
                    parameter.validate = false;
                }
            }
            else if(key === 'date'){
                parameter.date = validateMultiDate(parameter.date);
                if(parameter.date.validate === false){
                    delete parameter.date.validate;
                    parameter.validate = false;
                }
            }
            else if(key === 'email'){
                parameter.email = validateMultiValue(parameter.email, 'email');
                if(parameter.email.validate === false){
                    delete parameter.email.validate;
                    parameter.validate = false;
                }
            }
            else if(key === 'im'){
                parameter.instantMessage = validateMultiIM(parameter.im);
                if(parameter.instantMessage.validate === false){
                    delete parameter.instantMessage.validate;
                    parameter.validate = false;
                }
                delete parameter.im;
            }
            else if(key === 'image'){
                parameter.image = Ti.Utils.base64decode(parameter.image);
            }
            else if(key === 'name'){
                var objectName = validateName(parameter.name);
                parameter.firstName = objectName.firstname;
                parameter.middleName = objectName.middlename;
                delete parameter.name;
                objectName = null;
            }
            else if(key === 'surname'){
                parameter.lastName = parameter.surname;
                delete parameter.surname;
            }
            else if(key === 'nick'){
                parameter.nickname = parameter.nick;
                delete parameter.nick;
            }
            else if(key === 'phone'){
                parameter.phone = validateMultiValue(parameter.phone, 'phone');
                if(parameter.phone.validate === false){
                    delete parameter.phone.validate;
                    parameter.validate = false;
                }
            }
            else if(key === 'website'){
                parameter.url = validateMultiValue(parameter.website, 'website');
                if(parameter.url.validate === false){
                    delete parameter.url.validate;
                    parameter.validate = false;
                }
                delete parameter.website;
            }
        }
        return parameter;
    };

    /** Create Contact
      * @param {Object} parameter
      * @return {Object} */
    _self.createContact = function(parameter) {
        parameter = validateContact(parameter);
        if(parameter.validate !== false){
            delete parameter.validate;
            _self.tempContacts.push(Ti.Contacts.createPerson(parameter));
        }
        delete parameter.validate;
        return parameter;
    };

    /** Save Changes */
    _self.saveChanges = function() {
        if(!_isApple){
            Ti.Contacts.save(_self.tempContacts);
        }
        else{
            Ti.Contacts.save();
        }
        var i;
        for(i = 0; i < _self.tempContacts.length; i++){
            _self.tempContacts[i] = null;
        }
        _self.tempContacts = [];
    };

    /** Delete Single Contact
      * @param {Number} idContact
      * @return {Boolean} result */
    _self.deleteContact = function(idContact) {
        var result, contact;
        contact = Ti.Contacts.getPersonByID(idContact);
        if(!contact){
            result = false;
        }
        else{
            Ti.Contacts.removePerson(contact);
            result = true;
        }
        contact = null;
        return result;
    };

    return _self;

};

module.exports = Contacts;