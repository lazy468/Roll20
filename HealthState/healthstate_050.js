/**
 * healthstate.js
 *
 * * Copyright 2018: Ben F.
 * Licensed under the GPL Version 3 license.
 * http://www.gnu.org/licenses/gpl.html
 * 
 * This script is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This script is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 
 * To use type !hs to enable/disable the script, when enabled...
 *  - A token with a health and max health will be flagged with
 *    a color status indicating health state, using green,yellow,
 *    brown,red and finally X (dead).
 *  - Hiding/Showing bar1 to players will enable/disable this effect
 *    on tokens. If players can see bar1 they won't see a status color.
 * 
 */
 
var healthstat = healthstat || (function(){
    'use strict';

	var handleInput = function(msg) {
    
		if ( "api" !== msg.type ) {
			return;
		}
        // Disable/Enable the script activity with !hs
        if(msg.content.indexOf("!hs") !== -1 ) {
            
            if(msg.selected){
                log(">> Health Status: Update Selected Tokens");
                sendChat('HS','/w gm Updating Selected');
                    _.each(msg.selected, function(obj) {
                        var token = getObj(obj._type, obj._id);
                        if(state.healthstat.run_state) { 
                            handleToken(token);
                        } else {
                            resetStatus(token);
                        }
                    });
            } else {
            
                if(state.healthstat.run_state) { 
                    state.healthstat.run_state = false;
                    log(">> Health Status: OFF");
                    sendChat('HS','/w gm OFF');
                    resetAllTokens();
    
                } else { 
                    state.healthstat.run_state = true;
                    log(">> Health Status: ON");
                    sendChat('HS','/w gm ON');
                }
            }
        }
 
	},

	handleToken = function(obj) {
        if(
               'graphic' == obj.get('type') 
            && 'token'   == obj.get('subtype') 
            && ''        != obj.get('bar1_max')
        ) 
        {
            if(state.healthstat.run_state && !(obj.get('showplayers_bar1'))) {
                
                // If a token with a bar1_max value, show bar1 to players is false,
                // and the state.run_state is true continue.
                
                var token_name = obj.get('name') || '';
                var token_hp = (obj.get('bar1_value')) || 0;
                var token_hp_max = (obj.get('bar1_max')) || 0;
                
                // Exit if one of the variables is missing
                if(!(token_hp) || !(token_hp_max)) { return; }
                
                // Calculate the % of health remaining
                var token_hp_percent = ((token_hp/token_hp_max)*100);
    
                //log(">> Health Status: "+token_name+" - at "+token_hp_percent+"%");
                
                resetStatus(obj); // Clear all unused status markers
                
                if(token_hp_percent >= 75) {
                    // Green Health
                    obj.set("status_green",true);
                } else if (token_hp_percent >= 50 && token_hp_percent <= 74) {
                    // Yellow Health
                    obj.set("status_yellow",true);
                } else if (token_hp_percent >= 25 && token_hp_percent <= 49) {
                    // Brown Health
                    obj.set("status_brown",true);
                } else if (token_hp_percent >= 1 && token_hp_percent <= 24) {
                    // Red Health
                    obj.set("status_red",true);
                } else if (token_hp_percent <= 0 ) {
                    // Dead
                    obj.set("status_dead",true);
                }
            } else {
                    resetStatus(obj); // Clear all unused status markers
            }
        }

	},
	
	resetStatus = function(obj) {
        obj.set("status_dead",false); 
        obj.set("status_red",false); 
        obj.set("status_brown",false); 
        obj.set("status_yellow",false); 
        obj.set("status_green",false);

	},

    getAllTokens = function(pageID) {
    // Function to get all tokens
		let token_objects = findObjs({
			_pageid: pageID, 
			_type: 'graphic',
			_subtype: 'token',
		});
		return token_objects;
    },

    resetAllTokens = function() {
        var resetAll = getAllTokens(Campaign().get('playerpageid'))
          .forEach(token => {
              resetStatus(token);
          });
    },


	checkInstall = function()
	{
	    var script_version = "0.5.0";
        if( ! state.healthstat ) {
                state.healthstat = {
                    version: script_version,
                    run_state: true,
                };
            }    
        
        if (state.healthstat.version != script_version)
            state.healthstat.version = script_version;
            
            log("-=> Health State Script v"+state.healthstat.version+" Initialized <=-")
	},

    	
	registerEventHandlers = function() {
		on('chat:message', handleInput);
		on('change:graphic:bar1_value', handleToken);
		on('change:graphic:showplayers_bar1', handleToken);
	};

	return {
		CheckInstall: checkInstall,
		RegisterEventHandlers: registerEventHandlers
	};

}());

on("ready", function() {
    'use strict';
    
	healthstat.CheckInstall();
	healthstat.RegisterEventHandlers();
});
