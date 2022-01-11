/**
 * simplesound.js
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
 * The goal of this script is to play/stop sound effects from the Roll20 Jukebox
 * via commandline.
 * 
 *      Syntax:
 * 
 *      !splay [sound name] - play the named sound effect
 *      !sstop [sound name] - stop the named sound effect
 * 
 */
var simpleSound = simpleSound || (function(){
    'use strict';

    var whispers = false; // Whisper confirmation of stop/play to GM
    
    var playSound = function(trackname, action) {
        var track = findObjs({type: 'jukeboxtrack', title: trackname})[0];
        if(track) {
            track.set('playing',false);
            track.set('softstop',false);
			if(action == 'play'){
				track.set('playing',true);
			}
        }
        else {
            sendChat('Simple Sound Script', '/w gm No Track Found...');
            log("No track found "+trackname);
        }
    },

	handleInput = function(msg) {
    
		if ( "api" !== msg.type ) {
			return;
		}

		if(_.has(msg,'inlinerolls')){
			msg.content = _.chain(msg.inlinerolls)
				.reduce(function(m,v,k){
					m['$[['+k+']]']=v.results.total || 0;
					return m;
				},{})
				.reduce(function(m,v,k){
					return m.replace(k,v);
				},msg.content)
				.value();
		}

        if(msg.content.indexOf("!splay") !== -1 ) {
            var args = ["!splay", msg.content.replace('!splay','').trim()]
        }
        else if(msg.content.indexOf("!sstop") !== -1) {
            var args = ["!sstop", msg.content.replace('!sstop','').trim()]        
        }
        else {
            return;
        }
		
		switch(args[0]) {
			case '!splay': {
                var track_name = args[1] || 0;
                if(track_name) {
    				if(whispers){ sendChat('Simple Sound Script', '/w gm Playing ' + track_name); }
    				playSound(track_name,'play');
                }
                else {
                    sendChat('Simple Sound Script', '/w gm Syntax: !splay [track name]');
                }
				break;
			}
			case '!sstop': {
			    var track_name = args[1] || 0;
                if(track_name) {
    				if(whispers){ sendChat('Simple Sound Script', '/w gm Stopping ' + track_name); }
    				playSound(track_name,'stop');
                }
                else {
                    sendChat('Simple Sound Script', '/w gm Syntax: !sstop [track name]');
                }
				break;
			}
	  }
	},
	
	checkInstall = function()
	{
	    var script_version = "0.1.0";
        if( ! state.simpleSound ) {
                state.simpleSound = {
                    version: script_version,
                };
            }    
        
        if (state.simpleSound.version != script_version)
            state.simpleSound.version = script_version;
            
            log("-=> Simple Sound Script v"+state.simpleSound.version+" Initialized <=-")
	},

    	
	registerEventHandlers = function() {
		on('chat:message', handleInput);
	};

	return {
		CheckInstall: checkInstall,
		RegisterEventHandlers: registerEventHandlers
	};

}());

on("ready", function() {
    'use strict';
    
	simpleSound.CheckInstall();
	simpleSound.RegisterEventHandlers();        
});