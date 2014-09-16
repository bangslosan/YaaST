/*
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

'use strict';

var Utils = function (APIReferences) {

    var Yaast = {
        "API" : APIReferences
    };

    /** It provides several generic useful methods
     * @alias API.Utils
     * @namespace */
    var _self = {};

    /** 1 level merge object. (Priority obj2)
     * @method
     * @return {object} */
    _self.mergeObject_old = function mergeObject_old(obj1, obj2) {
        var result = null;
        var key;
        if (obj1 !== null && obj2 !== null) {
	        // Clone obj1 in result
	        result = {};
	        for (key in obj1) {
	            result[key] = obj1[key];
	        }
	        // Merge result with obj2
            for (key in obj2) {
                result[key] = obj2[key];
            }
        }
        return result;
    };

    /** Deep fusion object . Without modifying the parameters. (Priority obj2)
     * @method
     * @return {object} */
    _self.mergeObject= function mergeObject(obj1, obj2) {
    	if(typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || typeof obj2 == null || (Array.isArray(obj1) && !Array.isArray(obj2)) || (!Array.isArray(obj2) && Array.isArray(obj1))) {
    		Ti.API.warn('Impossible to merge this params');
    		return null;
    	}
		var clon = _self.clone(obj1);
		var result = _self.recMerge(clon, obj2);
		return result;
    };

	/** Clone the object
     * @method
     * @return {object} */
	_self.clone = function clone(obj1) {
		var result;
        if (obj1 == null) {
            return obj1;
        } else if (Array.isArray(obj1)) {
            result = [];
        } else {
            result = {};
        }
        for (var key in obj1) {
            result[key] = obj1[key];
        }
        return result;
	};

	/** Deep merge in obj1 object. (Priority obj2)
     * @method
     * @return {object} */
	_self.recMerge = function recMerge(obj1, obj2) {
		if (Array.isArray(obj2) && Array.isArray(obj1)) {
			// Merge Arrays
			var i;
			for (i = 0; i < obj2.length; i ++) {
	        	if (typeof obj2[i] === 'object' && typeof obj1[i] === 'object') {
	        		obj1[i] = _self.recMerge(obj1[i], obj2[i]);
	        	} else {
	        		obj1[i] = obj2[i];
	        	}
			}
		} else if (Array.isArray(obj2)) {
			// Priority obj2
			obj1 = obj2;
		} else {
			// object casej
		    for (var p in obj2) {
		        if(obj1.hasOwnProperty(p)){
		        	if (typeof obj2[p] === 'object' && typeof obj1[p] === 'object') {
		        		obj1[p] = _self.recMerge(obj1[p], obj2[p]);
		        	} else {
		        		obj1[p] = obj2[p];
		        	}
		        } else {
		        	obj1[p] = obj2[p];
		        }
		    }
		}
	    return obj1;
	};

/* Batería de pruebas del método mergeObject. (Para ejecutarlas puedes meterlas en app.js, por ejemplo)

Ti.API.info('***********Prueba MERGE**************');
Ti.API.info('\n**Pruebas Simples:');
Ti.API.info('merge(12, {a:[2,3,4]}): ' + JSON.stringify(Yaast["MergeObject"](12, {a:[2,3,4]})));
Ti.API.info('merge({a:12}, 2): ' + JSON.stringify(Yaast["MergeObject"]({a:12}, 2)));
Ti.API.info('merge([], 2): ' + JSON.stringify(Yaast["MergeObject"]([], 2)));
Ti.API.info('merge(null, {pepe:2}): ' + JSON.stringify(Yaast["MergeObject"](null, {pepe:2})));
Ti.API.info('merge({}, {pepe:2}): ' + JSON.stringify(Yaast["MergeObject"]({}, {pepe:2})));
Ti.API.info('merge({pepe:2}, {}): ' + JSON.stringify(Yaast["MergeObject"]({pepe:2}, {})));
Ti.API.info('merge({pepe:2}, {pepe:69}): ' + JSON.stringify(Yaast["MergeObject"]({pepe:2}, {pepe:69})));
Ti.API.info('merge({a:2}, {b:69}): ' + JSON.stringify(Yaast["MergeObject"]({a:2}, {b:69})));

Ti.API.info('\n**Pruebas multinivel:');
Ti.API.info('merge({a:"muete!!"}, {a:{b:1,c:2,d:3}}): ' + JSON.stringify(Yaast["MergeObject"]({a:"muete!!"}, {a:{b:1,c:2,d:3}})));
Ti.API.info('merge({a:{b:1,c:2,d:3}}, {a:"muete!!"}): ' + JSON.stringify(Yaast["MergeObject"]({a:{b:1,c:2,d:3}}, {a:"muete!!"})));
Ti.API.info('merge({a:{b:1,c:2,d:{d1:[], d2: 69, d3: "trol"}}}, {a:{}}): ' + JSON.stringify(Yaast["MergeObject"]({a:{b:1,c:2,d:{d1:[], d2: 69, d3: "trol"}}}, {a:{}})));
Ti.API.info('merge({a:{}}, {a:{b:1,c:2,d:{d1:[], d2: 69, d3: "trol"}}}): ' + JSON.stringify(Yaast["MergeObject"]({a:{}}, {a:{b:1,c:2,d:{d1:[], d2: 69, d3: "trol"}}})));
Ti.API.info('merge({a:{e:"muete!!"}}, {a:{b:1,c:2,d:3}}): ' + JSON.stringify(Yaast["MergeObject"]({a:{e:"muete!!"}}, {a:{b:1,c:2,d:3}})));
Ti.API.info('merge({a:{e:"muete!!"}}, {a:{b:1,c:2,d:3}}): ' + JSON.stringify(Yaast["MergeObject"]({a:{b:1,c:2,d:3}}, {a:{e:"muete!!"}})));
Ti.API.info('merge({a:{e:"muete!!"}}, {a:{b:1,c:2,d:3, e:"susto"}}): ' + JSON.stringify(Yaast["MergeObject"]({a:{e:"muete!!"}}, {a:{b:1,c:2,d:3, e:"susto"}})));
Ti.API.info('merge({a:{b:1,c:2,d:3, e:"susto"}}, {a:{e:"muete!!"}}): ' + JSON.stringify(Yaast["MergeObject"]({a:{b:1,c:2,d:3, e:"susto"}}, {a:{e:"muete!!"}})));

Ti.API.info('\n**Pruebas arrays:');
Ti.API.info('merge({a:"muete!!"}, []): ' + JSON.stringify(Yaast["MergeObject"]({a:"muete!!"}, [])));
Ti.API.info('merge([], {a:"muete!!"}): ' + JSON.stringify(Yaast["MergeObject"]([], {a:"muete!!"})));
Ti.API.info('merge([1,2,3,4], []): ' + JSON.stringify(Yaast["MergeObject"]([1,2,3,4], [])));
Ti.API.info('merge([], [1,2,3,4]): ' + JSON.stringify(Yaast["MergeObject"]([], [1,2,3,4])));
Ti.API.info('merge([11,22,33,44,55], [1,2,3,4]): ' + JSON.stringify(Yaast["MergeObject"]([11,22,33,44,55], [1,2,3,4])));
Ti.API.info('merge([1,2,3,4], [11,22,33,44,55]): ' + JSON.stringify(Yaast["MergeObject"]([1,2,3,4], [11,22,33,44,55])));
Ti.API.info('merge([1,2,3,4], [{a:"tuano"}, 22,33]): ' + JSON.stringify(Yaast["MergeObject"]([1,2,3,4], [{a:"tuano"}, 22,33])));
Ti.API.info('merge([{a:"tuano"}, 22,33], [1,2,3,4]): ' + JSON.stringify(Yaast["MergeObject"]([{a:"tuano"}, 22,33], [1,2,3,4])));
Ti.API.info('merge([1,2,3,4], [{a:"tuano"}, 22,33,44,55]): ' + JSON.stringify(Yaast["MergeObject"]([1,2,3,4], [{a:"tuano"}, 22,33,44,55])));
Ti.API.info('merge([{a:"tuano"}, 22,33,44,55], [1,2,3,4]): ' + JSON.stringify(Yaast["MergeObject"]([{a:"tuano"}, 22,33,44,55], [1,2,3,4])));

Ti.API.info('\n**Prueba Complejas 1:');
Ti.API.info('obj1:' + JSON.stringify(objetoP1));
Ti.API.info('obj2:' + JSON.stringify(objetoP2));
var pruebamerge = Yaast["MergeObject"](objetoP1,objetoP2);
Ti.API.info('mezcla obj1 y obj2:' + JSON.stringify(pruebamerge));

Ti.API.info('\n**Prueba Compleja 2 (templates for Titanium ListView):');
var template1 = {
    childTemplates: [
        {
            type: 'Ti.UI.Label',
            bindId: 'icon',
            properties: {
                layout: 'vertical',
                left: 10,
                font: {
                    fontFamily: Yaast.FontAwesome.getFontFamily()
                },
                textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
            }
        }, {
            type: 'Ti.UI.Label',
            bindId: 'title',
            properties: {
                layout: 'horizontal',
                color: '#FFFFFF',
                font: {
                    fontFamily:'Default',
                    fontSize: 22
                },
                left: 40,
                height: 44,
                textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
            }
        }, {
            type: 'Ti.UI.Label',
            bindId: 'id',
            properties: {
            	visible: false
            }
        }
    ],
    properties: {
    	backgroundColor: '#2B3E50',
    	selectedBackgroundColor: 858585,
    },
    events: {}
};
Ti.API.info('template1:' + JSON.stringify(template1));

var template2 = {
	childTemplates: [
		{
            properties: {
                layout: 'horizontal',
                height:  44,
                color: '#5679a4',
                font: {
                    fontSize: 22
                },
            }
		},
		{},
		{
			properties: {
				color: 'SOGTULAPDT'
			}
		}
	],
	properties: {
		backgroundColor: '#FFFFFF',
		top: 24
	}
};
Ti.API.info('template2:' + JSON.stringify(template2));
var pruebatemplates = Yaast["MergeObject"](template1,template2);
Ti.API.info('mezcla template1 y template2:' + JSON.stringify(pruebatemplates));

*/
    return _self;

};

module.exports = Utils;