/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

function platform(workspaceInfo) {

	var _self = {};
	var _widgetsByFullName = {};        // All widgets installed in Wirecloud
	var _operatorsByFullName = {};      // All operators installed in Wirecloud
	_self.widgetsInUseById = {};        // Widgets in current Workspace
	_self.operatorsInUseById = {};      // Operators in current Workspace
	_self.tabs = new Array();           // Array that contains each tab in current Workspace
	
	var _tempInfoWorkspace = JSON.parse(workspaceInfo[1]);
	var _tempInfoResources = JSON.parse(workspaceInfo[2]);

	// Loop through all widgets and operators installed in Wirecloud
	for (var _i in _tempInfoResources) {
		var _protClass = require('ui/lib/widgetPrototype');
		if (_tempInfoResources[_i].type == 'widget') {
			_widgetsByFullName[_i] = _protClass(_tempInfoResources[_i]);
		} else { // operator
			_operatorsByFullName[_i] = _protClass(_tempInfoResources[_i]);
		}
		_protClass = null;
	}
	_tempInfoResources = null;
	_i = null;
	
	// Workspace Preferences info
	_self.preferences = _tempInfoWorkspace.preferences;
	
	// Wiring info
	_self.wiring  = _tempInfoWorkspace.wiring.connections;
	
	// Name of Workspace
	_self.name =  _tempInfoWorkspace.name;
	_self.id = _tempInfoWorkspace.id;
	
	// Loop through all operators in use for this Workspace and update preferences
	for (var _i in _tempInfoWorkspace.wiring.operators) {
		_self.operatorsInUseById[_i] = _operatorsByFullName[_tempInfoWorkspace.wiring.operators[_i].name];
		for(var _j in _tempInfoWorkspace.wiring.operators[_i].preferences){
			_self.operatorsInUseById[_i].preferences[_j] = _tempInfoWorkspace.wiring.operators[_i].preferences[_j];
		}
	}

	// Returns the widgets that are in use for a particular tab, add this widgets
	// to self.widgetsInUseById and update preferences of these widgets
	function parseIwidgets(iwidgets) {
		var _widgetsInUseInThisTabById = {};
		for (var _i in iwidgets) {
			var _metaInfo = _widgetsByFullName[iwidgets[_i].widget];
			_metaInfo.readonly = iwidgets[_i].readOnly;
			for (var _j in _metaInfo.preferences){
				_metaInfo.preferences[_j] = iwidgets[_i].variables[_j].value;
			}
			_widgetsInUseInThisTabById[iwidgets[_i].id] = {
			    meta: _metaInfo,    				// widget information
			    dimensions: {                       // widget dimensions
			    	top: iwidgets[_i].top,
			    	left: iwidgets[_i].left,
			    	width: iwidgets[_i].width,
			    	height: iwidgets[_i].height
			    }
			};
			_self.widgetsInUseById[iwidgets[_i].id] = _metaInfo;
			_metaInfo = null;
		}
		_i = null;
		return _widgetsInUseInThisTabById;
	};

	// Parse Tabs
	for (var _i in _tempInfoWorkspace.tabs) {
		var _widArray = parseIwidgets(_tempInfoWorkspace.tabs[_i].iwidgets); 
		var _blocked = false;
		for (var _j in _widArray){
			if(_widArray[_j].readonly === 1){
				_blocked = true;
				break;
			}
		}
		_self.tabs.push({
			'widgets': _widArray,
			'id': _tempInfoWorkspace.tabs[_i].id,
			'name': _tempInfoWorkspace.tabs[_i].name,
			'blocked': _blocked
		});
		_widArray = null;
		_blocked = null;
		_j = null;
	}
	_i = null;
	_tempInfoWorkspace = null;

	return _self;
}

module.exports = platform;
