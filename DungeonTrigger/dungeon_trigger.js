/**
 * dungeon_trigger2.js
 *
 * * Copyright 2020: Ben F.
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
 */
var DungeonTrigger = DungeonTrigger || (function(){
    'use strict';
    
    var handleTrigger = function(obj) {

		// Get the page ID of the triggering object.
		var currentPageID = obj.get('pageid');

        // Set the run_cmd state back to true before processing another trigger
        state.DungeonTrigger.run_cmd = true;
        
		//Only trigger if the triggering token is on the Objects layer.
		if(obj.get("layer") === "gmlayer" || obj.get("layer") === "map" || obj.get("layer") === "walls") {
		return; 
		}
		
		var checkCollisions = getTriggerCollisions(obj)
          .forEach(trig => {
            // return if the halt_trig flag has been set
            if(state.DungeonTrigger.halt_trig) {return;}
             
            // return if trigger has the interdiction status marker
            if(trig.get('status_interdiction') || trig.get('status_padlock')) {return;}
            
            // ignore tokens marked with wings 'flying' if the trigger has the wings status
            if(trig.get('status_fluffy-wing') && obj.get('status_fluffy-wing')) {return;}
            
            // Does the token overlap with the trigger True/False
            var overlap = isTriggerOverlap(obj, trig);
            
            log('[DT] ['+obj.get('name')+"] collision detected with ["+trig.get('name')+"] overlap: "+overlap);
            
            // Run the commands within the GM Notes of the trigger token
			runTriggerCommands(obj, trig, overlap);
			
		    // Reset the last move of the token that collided to avoid triggering after the fact
            obj.set("lastmove","");
          });
        
        // Reset the halt_trig flag
        state.DungeonTrigger.halt_trig = false;
		
        // Reset the run_delay flag
        state.DungeonTrigger.run_delay = 0;
        
	},

    handleActivate = function(obj) {
		// Get the page ID of the triggering object.
		var currentPageID = obj.get('pageid');

        // Set the run_cmd state back to true before processing another trigger
        state.DungeonTrigger.run_cmd = true;
        
		//Only trigger if the triggering token is on the Objects layer.
		if(obj.get("layer") === "gmlayer" || obj.get("layer") === "map" || obj.get("layer") === "walls") {
		return; 
		}
		
		var checkOverlaping = getTriggersOnPage(currentPageID)
          .forEach(trig => {

            // Does the token overlap with the trigger True/False
            var overlap = isTriggerOverlap(obj, trig);
            
            // If the token does not overlap this trigger return
            if(!overlap) {return;}
            
            // return if trigger has the interdiction status marker
            if(trig.get('status_interdiction')) {return;}
            
            // return if the trigger is not marked with the padlock icon to indicate manual activation
            if(!(trig.get('status_padlock'))) {return;}
            
            log('[DT] [Command Activated] ['+obj.get('name')+"] collision detected with ["+trig.get('name')+"] overlap: "+overlap);
            
            // Run the commands within the GM Notes of the trigger token
			runTriggerCommands(obj, trig, overlap);
			
          });
        
        // Reset the halt_trig flag
        state.DungeonTrigger.halt_trig = false;
		
        // Reset the run_delay flag
        state.DungeonTrigger.run_delay = 0;
    },
    
	handleInput = function(msg) {

		if (msg.type !== "api") {
			return;
		}
		
		if(_.has(msg,'inlinerolls')){
			msg.content = _.chain(msg.inlinerolls)
				.reduce(function(m,v,k){
					var ti=_.reduce(v.results.rolls,function(m2,v2){
						if(_.has(v2,'table')){
							m2.push(_.reduce(v2.results,function(m3,v3){
								m3.push(v3.tableItem.name);
								return m3;
							},[]).join(', '));
						}
						return m2;
					},[]).join(', ');
					m['$[['+k+']]']= (ti.length && ti) || v.results.total || 0;
					return m;
				},{})
				.reduce(function(m,v,k){
					return m.replace(k,v);
				},msg.content)
				.value();
		}

        var args = msg.content
            .replace(/<br\/>\n/g, ' ')
            .replace(/(\{\{(.*?)\}\})/g," $2 ")
            .split(/\s+--/);
            
		switch(args.shift()) {
            case '!dt': {
                switch(args.shift()) {
                    case 'activate': {
                        _.each(msg.selected, function(obj) {
                            var token = getObj(obj._type, obj._id);
                            handleActivate(token);
                        });
                        break;
                    }
                    case 'id': {
                        var selected = msg.selected;
                        if(!selected) {
            			    sendChat('Dungeon Trigger', '/w gm Nothing was selected!');
            		    } else {
            		        _.each(selected, function(obj) {
                                var obj_id = obj._id;
            		            sendChat('ID', '/w gm ' + obj_id);
            		        });
            		    }
            		    break;
                    }
                    case 'help-check-save': { showHelp('check-save'); break; }
                    case 'help-key': { showHelp('key'); break; }
                    case 'help-else': { showHelp('else'); break; }
                    case 'help-end': { showHelp('end'); break; }
                    case 'help-play': { showHelp('play'); break; }
                    case 'help-fx': { showHelp('fx'); break; }
                    case 'help-ping': { showHelp('ping'); break; }
                    case 'help-delay': { showHelp('delay'); break; }
                    case 'help-door': { showHelp('door'); break; }
                    case 'help-setstatus': { showHelp('setstatus'); break; }
                    case 'help-disable': { showHelp('disable'); break; }
                    case 'help-gmlayer': { showHelp('gmlayer'); break; }
                    case 'help-note': { showHelp('note'); break; }
                    case 'help-halt': { showHelp('halt'); break; }
                    case 'help-move': { showHelp('move'); break; }
                    default: { showHelp(); break; }
                }
            break;    
            }
		}
		
	},

    getTriggersOnPage = function(pageID) {
    // Function to get all gmlayer objects that end with _trig
		let gm_layer_objects = findObjs({
			_pageid: pageID, 
			_type: 'graphic',
			layer: 'gmlayer'
		});
		let triggers = _.filter(gm_layer_objects, trigger => {
			return trigger.get('name').endsWith("_trig");
		});
		return triggers;
    },

    getTriggerCollisions = function(token) {
    // Function to return all tokens that collide with the token
		let pageId = token.get('_pageid');
		let triggers = getTriggersOnPage(pageId);
		return _.chain(TokenCollisions.getCollisions(token, triggers, {detailed: true}))
            .map(collision => {
                return collision.other;
            })
		    .flatten()
            .value();;
    },

    isTriggerOverlap = function(token, trigger) {
    // Function to return if a token is overlapping with the specified trigger
		return TokenCollisions.isOverlapping(token, trigger);
    },

    getTokenPosition = function(token) {
		return [token.get('left'), token.get('top'), 1];
    },
	
    runTriggerCommands = function(token, trigger, overlap) {
    // Function to process an array of commands from the gmnotes of a trigger object
    
        // Don't trigger unless the token overlaps when marked with the Boot icon
        if(trigger.get('status_tread') && (!(overlap))) {
            log('[DT] ['+trigger.get('name')+'] You must overlap to trigger');
            return;
        }
        
        // Send a chat notification whispered to the gm when a trigger is activated
        sendNotification(token.get('name'),trigger.get('name').replace('_trig',''),true,'');
                    
        // Decode the GM notes and process each line 
		var commands = decodeEditorText(trigger.get('gmnotes'),{asArray:true})
	     .forEach(cmd => {
	         var passed_cmd = formatNotes(cmd, token);
			 var Trigger_Delay = state.DungeonTrigger.run_delay;
             
             if(passed_cmd.startsWith('--')){
                 // Commands that start with -- are considered Dungeon Trigger code and processed here
                 var final_cmd = passed_cmd.replace('--','').split(':');
                 log('[DT] Delay: '+Trigger_Delay+' Command: '+final_cmd);

                 switch (final_cmd.shift()) {
                    case "check":
					// --check:skill:dc to process a skill check in the format (example --check:perception:14)
					// Checks will trigger if you succeed on the roll
                        var check_bonus = getBonus(token,final_cmd[0],false); var check_dc = final_cmd[1];
                        
                        if(final_cmd[0] === 'pperception'){
                            var check_roll = check_bonus;
                        } else {
                            var check_roll = (randomInteger(20)+check_bonus);
                        }
                            if(check_roll >= check_dc){state.DungeonTrigger.run_cmd = true; var color='green';} else {state.DungeonTrigger.run_cmd = false; var color='red';}
                        
                        // Grab and store the check roll, dc, & bonus
                        state.DungeonTrigger.last_roll  = check_roll;
                        state.DungeonTrigger.last_dc    = check_dc;
                        state.DungeonTrigger.last_bonus = check_bonus;
                        
                        // if you append :show to the end of the command it will make the roll public if successful (example --check:perception:14:show)
                        var check_show = final_cmd[2] || ''; if(check_show.toLowerCase() === 'show') {var check_w = false;} else {var check_w = true;}
                        
                        // Send a notification to chat with the results of the check
                        sendNotification(final_cmd[0]+' check','',check_w,'DC <b>'+final_cmd[1]+'</b>; Roll: <span style="color:'+color+'"><b>'+check_roll+'</b></span>; Bonus: <b>+'+check_bonus+'</b>');
                        break;
                    case "save":
					// --save:stat:dc to process a save check in the format (example --save:wis:14)
					// Saves will trigger if you fail on the roll
                        var save_bonus = getBonus(token,final_cmd[0],true); var save_dc = final_cmd[1];
                        var save_roll = (randomInteger(20)+save_bonus);
                    
                        if(save_roll < save_dc){state.DungeonTrigger.run_cmd = true; var color='red';} else {state.DungeonTrigger.run_cmd = false; var color='green';}

                        // Grab and store the check roll, dc, & bonus
                        state.DungeonTrigger.last_roll  = save_roll ;
                        state.DungeonTrigger.last_dc    = save_dc;
                        state.DungeonTrigger.last_bonus = save_bonus;

                        // if you append :show to the end of the command it will make the roll public if successful (example --save:wis:14:show)
                        var save_show = final_cmd[2] || ''; if(save_show.toLowerCase() === 'show') {var save_w = false;} else {var save_w = true;}

                        // Send a notification to chat with the results of the check    
                        sendNotification(final_cmd[0]+' save','',save_w,'DC <b>'+final_cmd[1]+'</b>; Roll: <span style="color:'+color+'"><b>'+save_roll+'</b></span>; Bonus: <b>+'+save_bonus+'</b>');
                        break;
                    case "key":
                    // --key:status_name to check if the token is status marked with the specified name
                        state.DungeonTrigger.run_cmd = false; var color='red';  // Set the default state to locked
                        
                        var key_status = final_cmd[0].toLowerCase(); // Get the status key we're looking for from the command variables
                        var keyMarkers = token.get("statusmarkers").split(','); // Get all the status markers affecting the token.
                        
                    			for (var i = 0; i < keyMarkers.length; i++) { // Check if the token has a marker matching the name
                    				if (key_status == keyMarkers[i].toLowerCase().split('::')[0]) {state.DungeonTrigger.run_cmd = true; var color='green';}
                    			}
                            
                        // Send a notification to chat with the results of the check
                        sendNotification('check key: '+key_status,'',true,'<span style="color:'+color+'"><b>Token Key: '+key_status+'</b></span>');
                        break;
                    case "else":
                    // --else to toggle the run_cmd state to the opposite state.
                        if(state.DungeonTrigger.run_cmd){state.DungeonTrigger.run_cmd = false;} else {state.DungeonTrigger.run_cmd = true;}
                        break;
                    case "end":
                    // --end to end of checks forcing command processing back on.
                        state.DungeonTrigger.run_cmd = true;
                        break;
                    case "play":
                    // --play:trackname to play a sound
						if(state.DungeonTrigger.run_cmd){setTimeout(() => {playSound(final_cmd[0]);}, 1000*Trigger_Delay);}      
						break;
                    case "fx":
                    // --fx:effect:direction to play fx; example --fx:beam-acid:ne
						if(state.DungeonTrigger.run_cmd){setTimeout(() => {playFX(trigger,final_cmd[0],final_cmd[1]);}, 1000*Trigger_Delay);}
                        break;
                    case "ping":
                    // --ping to send a ping to all players at the trigger location
						if(state.DungeonTrigger.run_cmd){setTimeout(() => {sendTokenPing(trigger);}, 1000*Trigger_Delay);}
                        break;
                    case "delay":
                        if(state.DungeonTrigger.run_cmd){state.DungeonTrigger.run_delay = final_cmd[0] || 0;}
                        break;
                    case "door":
                        if(state.DungeonTrigger.run_cmd){setTimeout(() => {toggleDoor(final_cmd[0]);}, 1000*Trigger_Delay);}
                        break;
                    case "disable":
                    // --disable to mark the trigger disabled when run with the interdiction status
                        if(state.DungeonTrigger.run_cmd){trigger.set('status_interdiction');}
                        break;
                    case "setstatus":
                    // --setstatus:marker_name:target_id to set the status on the token.
                        if(state.DungeonTrigger.run_cmd){setTimeout(() => {setStatusMarker(token, final_cmd[0], final_cmd[1]);}, 1000*Trigger_Delay);}
                        break;
                    case "gmlayer":
                    // --togmlayer:token_id can be used to send the triggering token or a specified token to the GM layer.
                        if(state.DungeonTrigger.run_cmd){ setTimeout(() => {changeLayer(token,'gmlayer');}, 1000*Trigger_Delay); }
                        break;
                    case "note":
                    // --note:message to send a note in a bubble to the public chat
						if(state.DungeonTrigger.run_cmd){
							setTimeout(() => {
    							var note_msg = final_cmd[0];
    							sendNotification('','',false,note_msg);
							}, 1000*Trigger_Delay);
						}
                        break;
                    case "move":
                    // --move:direction:distance to move a token 
						if(state.DungeonTrigger.run_cmd){
							var direction = final_cmd[0];
							var distance = final_cmd[1];
							
							state.DungeonTrigger.halt_trig = true; // flag halt_trig to stop processing more triggers
    							
							moveToken(token,trigger,direction,distance);
						}
                        break;
                    case "halt":
                    // --halt to stop a token at the trigger and stop processing more triggers
                        if(state.DungeonTrigger.run_cmd){ 
                            let x = trigger.get("left");
                            let y = trigger.get("top");
                    
                            token.set("lastmove","");
                            token.set("left", x);
                            token.set("top", y);
                            
                            state.DungeonTrigger.halt_trig = true; // flag halt_trig to stop processing more triggers
                        }
                        break;
                    default:
                        // Command was unrecognized - Do Nothing
                        log('[DT] Command: '+final_cmd+' was unrecognized - Skipped');
                        break;
                 }
             } else {
                 // Commands that don't start with -- are passed directly to chat as raw output
                 var final_cmd = formatNotes(passed_cmd,token);
                 log('[DT] [RUN STATE] '+state.DungeonTrigger.run_cmd);
                 
                 // Pass the finalized command to chat if the run flag is true
                 if(state.DungeonTrigger.run_cmd) {
                     // Duplicate whispers so the GM also sees them
                     if(final_cmd.startsWith('/w')){
                        var reWhisper = final_cmd.replace('/w', '/w gm');
                        sendChat('DT', reWhisper);
                     }
                     // Pass the raw output to chat
                     setTimeout(() => {sendChat('|API', final_cmd);}, 1000*Trigger_Delay);
                 }

             }
          });

    },
    
    getBonus = function(token,save,type) {
        var player_id = token.get('represents');
        if (!player_id){ return; }
        
        var character = getObj('character', player_id);
        if (!character){ return; }
        
        var bonus = 0;
        switch (save)
        {
            case "acrobatics":
                bonus = getAttrByName(character.id, 'acrobatics_bonus');
                break;
            case "athletics":
                bonus = getAttrByName(character.id, 'athletics_bonus');
                break;
            case "pperception":
                bonus = getAttrByName(character.id, 'passive_wisdom');
                break;
            case "perception":
                bonus = getAttrByName(character.id, 'perception_bonus');
                break;
            case "investigation":
                bonus = getAttrByName(character.id, 'investigation_bonus');
                break;
            case "stealth":
                bonus = getAttrByName(character.id, 'stealth_bonus');
                break;
            case "str":
                if(type) {
                    bonus = getAttrByName(character.id, 'strength_save_bonus');
                } else {
                    bonus = getAttrByName(character.id, 'strength_mod');
                }
                break;
            case "dex":
                if(type) {
                    bonus = getAttrByName(character.id, 'dexterity_save_bonus');
                } else {
                    bonus = getAttrByName(character.id, 'dexterity_mod');
                }
                break;
            case "con":
                if(type) {
                    bonus = getAttrByName(character.id, 'constitution_save_bonus');
                } else {
                    bonus = getAttrByName(character.id, 'constitution_mod');
                }
                break;
            case "int":
                if(type) {
                    bonus = getAttrByName(character.id, 'intelligence_save_bonus');
                } else {
                    bonus = getAttrByName(character.id, 'intelligence_mod');
                }
                break;         
            case "wis":
                if(type) {
                    bonus = getAttrByName(character.id, 'wisdom_save_bonus');
                } else {
                    bonus = getAttrByName(character.id, 'wisdom_mod');
                }
                break;  
            case "cha":
                if(type) {
                    bonus = getAttrByName(character.id, 'charisma_save_bonus');
                } else {
                    bonus = getAttrByName(character.id, 'charisma_mod');
                }
                break;  
        }    
        bonus = parseInt(bonus);
        return bonus;
    },
	
	formatNotes = function(command, token){
	// Process the individual commands replacing elements with names and ids from tokens.
        var cmd_input = command.replace(/(<([^>]+)>)/ig,'').replace(/&nbsp;/g, " ").trim();
        
        var cmd_input = cmd_input.replace('VICTIM_NAME', token.get('name'));
        var cmd_input = cmd_input.replace('VICTIM_ID', token.get('id'));
        
        var cmd_input = cmd_input.replace('LAST_ROLL', '**'+state.DungeonTrigger.last_roll+'**');
        var cmd_input = cmd_input.replace('LAST_DC', '**'+state.DungeonTrigger.last_dc+'**');
        var cmd_input = cmd_input.replace('LAST_BONUS', '**'+state.DungeonTrigger.last_bonus+'**');
        
        return cmd_input;
	},
	
	decodeEditorText = function(w, o){
		o = Object.assign({ separator: '\r\n', asArray: false },o);

		// Decode everthing into html and set the string to utf-8 text
        w = decodeURIComponent(w).toString('utf8');
        // Swap all <br> to </p><p> for a smooth array breakdown
        w = fixBreaks(w);
        // Ensure the string starts with and ends with paragraph markup
        if (!w.startsWith('<p>')) { w = "<p>"+w }
        if (!w.endsWith('</p>')) { w = w+"</p>" }
        
		let lines = w.match(/<p>.*?<\/p>/g)
			.map( l => l.replace(/^<p>(.*?)<\/p>$/,'$1')); 
		return o.asArray ? lines : lines.join(o.separator);
	},

    fixBreaks = function(str){
        const replacers = {
            "\\<br>" : '</p><p>',
        };
        return Object.keys(replacers).reduce( (s,r)=>s.replace(RegExp(r,'g'),replacers[r]),str);
    },

    sendNotification = function(title, trigger, whisper, message, who) {
    // Sends formatted notifications to chat in public or whisper
        var who = who || 'gm';
        if(title) {var notification_header = "<thead style=\"background-color: #000 ; color: #fff ; font-weight: bold\"><tr><th> "+title+"</th></tr></thead>";} else {var notification_header = "";}
        if(trigger){var trigger_insert = "<b>Triggered: <i><span style='color:green'>"+trigger+"</span></i></b><br>";} else {var trigger_insert = "";}

        var notification = "<table style=\"background-color: #fff ; border: solid 1px #000 ; border-collapse: separate ; border-radius: 10px ; overflow: hidden ; width: 100% ; border-color: #000\">"+
                           notification_header+"<tbody><tr><td style=\"padding: 0\"><div><div style=\"padding: 1px 1em\"></div>"+
                           "<div style=\"padding: 1px 1em\">"+trigger_insert+message+"</div></div></td></tr></tbody></table>"
        
        // If whisper is true tag a /w gm to the front of the message
        if(whisper === true || whisper === "") {var to_gm="/w gm ";} else {var to_gm = "";}
        // If a who is specified also send the output to them in a whisper
        if(whisper && who != 'gm'){sendChat("Dungeon Trigger", "/w "+who+" " + notification);}
        // Send the output to chat
        sendChat("Dungeon Trigger", to_gm + notification);
    },

    sendTokenPing = function(obj) {
	// Send a Ping at the submitted tokens location and page ID for all
		var x = obj.get('left');
		var y = obj.get('top');
		var pageId = obj.get('_pageid');
		
		sendPing(x, y, pageId, null, false);
    },

    moveToken = function(token, trigger, direction, distance) {

        var cellPx = 70;
        
        // verify distance is actually a number or return
        if(isNaN(distance)) { return; } else { var dis = parseInt(distance)*cellPx; }

        // get trigger position
        let trig_x = parseInt(trigger.get("left")); let trig_y = parseInt(trigger.get("top"));

        switch (direction.toLowerCase())
        {
            case "n":
                var to_x = (trig_x); var to_y = (trig_y-dis);
                break;
            case "ne":
                var to_x = (trig_x+dis); var to_y = (trig_y-dis);
                break;
            case "nw":
                var to_x = (trig_x-dis); var to_y = (trig_y-dis);
                break;
            case "s":
                var to_x = (trig_x); var to_y = (trig_y+dis);
                break;
            case "se":
                var to_x = (trig_x+dis); var to_y = (trig_y+dis);
                break;
            case "sw":
                var to_x = (trig_x-dis); var to_y = (trig_y+dis);
                break;
            case "e":
                var to_x = (trig_x+dis); var to_y = (trig_y);
                break;
            case "w":
                var to_x = (trig_x-dis); var to_y = (trig_y);
                break;
            default:
                var to_x = trig_x; var to_y = trig_y;
                break;
        }
                
        token.set("lastmove","");
        token.set("left", trig_x);
        token.set("top", trig_y);
        
        // Set the tokens positon to the new location a fraction of a second after yanking it back to the trigger location
        setTimeout(() => {
            token.set("lastmove","");
            token.set("left", to_x);
            token.set("top", to_y);
        }, 300)
    },
    
    playFX = function(trigger,effect,direction) {
	// Function to generate visual effects from triggers
        var pageId = trigger.get('pageid');
        var fx_effect = effect || 'burst-fire';
        var direction = direction || '';
        var x = trigger.get('left'); 
        var y = trigger.get('top');
        
        switch (direction.toLowerCase())
        {
            case "n":
                var to_x = (x); var to_y = (y-1);
                break;
            case "ne":
                var to_x = (x+1); var to_y = (y-1);
                break;
            case "nw":
                var to_x = (x-1); var to_y = (y-1);
                break;
            case "s":
                var to_x = (x); var to_y = (y+1);
                break;
            case "se":
                var to_x = (x+1); var to_y = (y+1);
                break;
            case "sw":
                var to_x = (x-1); var to_y = (y+1);
                break;
            case "e":
                var to_x = (x+1); var to_y = (y);
                break;
            case "w":
                var to_x = (x-1); var to_y = (y);
                break;
            default:
                var to_x = x; var to_y = y;
                break;
        }
        // Check for custom FX
        if(fx_effect.indexOf("-") === -1) {
            var fx_custom_id = findObjs({_type: "custfx", name: fx_effect}, {caseInsensitive: true});
                if(fx_custom_id.length != 0) {
                    fx_effect = fx_custom_id[0].id;
                } else {
                    sendChat("Dungeon Trigger", "/w gm The custom effect '"+fx_effect+"' was not found");
                    fx_effect = 'burst-fire';
                }
        }
        spawnFxBetweenPoints({ x: x, y: y }, { x: to_x, y: to_y }, fx_effect, pageId);
    },
    
    setStatusMarker = function(token, markerName, tokenID) {
        // Get custom status markers
        const tokenMarkers = JSON.parse(Campaign().get("token_markers"));
        var marker_id = '';
        var target_token = getObj("graphic", tokenID) || '';
        var markerName = markerName.toLowerCase();
        
        // Check if the marker name indicates removal with a '-'
        if(markerName.startsWith('-')){
            markerName = markerName.replace("-","");
            var remove_status = true;
        } else {
            var remove_status = false;
        }
        
        _.each(tokenMarkers, marker => {
            if(marker.name.toLowerCase() === markerName) { 

                if((""+marker.id).length > 2){
                    marker_id = marker.name.toLowerCase()+'::'+marker.id || '';
                } else {
                    marker_id = marker.name.toLowerCase() || '';
                }
            };
        });

        // If no marker is found return
        if (!(marker_id)) { return; }
        
        // Check if the target is the triggering token or a supplied ID
        if (target_token) {
            var currentMarkers = target_token.get("statusmarkers");
            
            if(remove_status){
                currentMarkers = currentMarkers.replace(marker_id,'');
                target_token.set("statusmarkers", currentMarkers);
                return;
            }
            
        } else {
            var currentMarkers = token.get("statusmarkers");
            
            if(remove_status){
                currentMarkers = currentMarkers.replace(marker_id, "");
                token.set("statusmarkers", currentMarkers);
                return;
            }
        }

        currentMarkers = currentMarkers.split(',');
        
        // Avoid duplicating the status marker if it already exists
		for (var i = 0; i < currentMarkers.length; i++) {
		    if (markerName == currentMarkers[i].toLowerCase().split('::')[0]) { return;	}
		}
        
        // Add the status marker to the end of the array
        currentMarkers.push(marker_id);

        // If a target was specified set the icon on that token otherwise use the triggering token
        if (target_token) {
            target_token.set("statusmarkers", currentMarkers.join(','));
        } else {
            token.set("statusmarkers", currentMarkers.join(','));
        }
    },
    
    playSound = function(trackname) {
	// Function to play a sound
        var track = findObjs({type: 'jukeboxtrack', title: trackname})[0];
        if(track) {
            track.set('playing',false);
            track.set('softstop',false);
			track.set('playing',true);
        }
        else {
            sendChat('DT', '/w gm No Track Found...');
            log("No track found "+trackname);
        }
    },

    toggleDoor = function(path_id){
        var path_obj = findObjs({_type: "path", _id: path_id})[0];
		if (path_obj) {
		    var path_obj_layer = path_obj.get("layer");
		    if(path_obj_layer == "gmlayer") {
		        path_obj.set("layer", "walls");
		    } else {
		        path_obj.set("layer", "gmlayer");
		    }
		}
    },
    
	changeLayer = function(obj, layer){
	// change the layer of the selected token
        obj.set("layer", layer);
	},
	
    showHelp = function(help_detail)
    {
		switch (help_detail)
        {
            case "check-save":
                var help = "<table cellpadding='0'><tbody>"+
					"<tr><td><strong><span style='color: blue;'>CHECK / SAVE</span></strong></td></tr>"+
					"<tr><td><b><code><span style='color: #903;'>--check:[skill/stat]:[DC]:show</span></code></b><br><b><code><span style='color: #903;'>--save:[stat]:[DC]:show</span></code></b><br><br>You can create conditions under which your commands will execute using --check, --save, or --key commands. A check can use any of the following to pull the bonus from the triggering characters stat block and roll against the set DC. Its important to note that the conditional code after a --check command triggers on a check success where a --save triggers on a failure. Typically checks and saves are hidden and only shown to the GM however if you append <span style='color: #800000;'><strong>:show</strong></span> at the end the command the roll will be shown in public chat when the condition would trigger.<ul><li><span style='color: blue;'>acrobatics</span> Acrobatics Check</li><li><span style='color: blue;'>athletics</span> Athletics Check</li><li><span style='color: blue;'>pperception</span> Passive Perception (no roll)</li><li><span style='color: blue;'>perception</span> Perception Check</li><li><span style='color: blue;'>investigation</span> Investigation Check</li><li><span style='color: blue;'>stealth</span> Stealth Check</li><li><span style='color: blue;'>str</span> Str Check / Save</li><li><span style='color: blue;'>dex</span> Dex Check / Save</li><li><span style='color: blue;'>con</span> Con Check / Save</li><li><span style='color: blue;'>int</span> Int Check / Save</li><li><span style='color: blue;'>wis</span> Wis Check / Save</li><li><span style='color: blue;'>cha</span> Cha Check / Save</li></ul>Here are some examples:<br /><strong>--check:[SKILL/STAT]:[DC]:show</strong><br /><em>Commands run on a successful check and the roll will be output to chat.</em><br /><strong>--end</strong><br /><br /><strong>--save:dex:15</strong><br /><em>Commands here run on a failed roll of 14 or lower with the tokens Dex Save bonus. </em><br /><strong>--end</strong><br /> <br /><strong>--check:perception:17:show</strong><br /><em>Commands here run on a 17 or better perception check and the players will see the roll because of the :show tag</em><br /><strong>--end</strong><br /><em>Commands here will run either way</em><br></td></tr>"+
					"</tbody></table>";
                break;
            case "key":
                var help = "<table cellpadding='0'><tbody>"+
					"<tr><td><span style='color: #0000ff;'><strong>KEY</strong></span></td></tr>"+
					"<tr><td><b><code><span style='color: #903;'>--key:[icon_name]</span></code></b><br><br>You can use the --key command to designate the trigger target must have the selected status marker to activate.<br /><strong>--key:blue</strong><br /><em>Commands run if token has the blue dot status</em><br /><strong>--end</strong>Some examples of icon names are red, blue, green, brown, purple, pink, yellow, dead, skull, sleepy, half-heart, half-haze, interdiction...<br></td></tr>"+
					"</tbody></table>";
                break;
            case "else":
                var help = "<table cellpadding='0'><tbody>"+
					"<tr><td><span style='color: #0000ff;'><strong>ELSE</strong></span></td></tr>"+
					"<tr><td><b><code><span style='color: #903;'>--else</span></code></b><br><br>The else command toggles the triggers run state to the opposite. A trigger always starts with a run state of TRUE which allows it to execute commands. If a condition fails like a --check command then that state becomes FALSE preventing commands from running. When the --else command is encountered it switches to the opposite run state. This can be used to run a separate set of commands in the even a conditon passes or fails.<br><strong>--check:perception:17:show</strong><br /><em>Commands here run on a 17 or better perception check and the players will see the roll because of the :show tag</em><br /><strong>--else</strong><br /><em>Commands here run on 16 or lower perception check, only the GM will see the roll.</em><br /><strong>--end</strong><br /><em>Commands here will run either way</em><br></td></tr>"+
					"</tbody></table>";
                break;
            case "end":
                var help = "<table cellpadding='0'><tbody>"+
					"<tr><td><span style='color: #0000ff;'><strong>END</strong></span></td></tr>"+
					"<tr><td><b><code><span style='color: #903;'>--end</span></code></b><br><br>Forces the run state of the trigger back to TRUE allowing all further commands to be executed as normal. This can be useful if you have a condition block but you also want additional commands to run either way.<br></td></tr>"+
					"</tbody></table>";
                break;
            case "play":
                var help = "<table cellpadding='0'><tbody>"+
					"<tr><td><span style='color: #0000ff;'><strong>PLAY</strong></span></td></tr>"+
					"<tr><td><b> <code><span style='color: #903;'>--play:[track_name]</span></code></b><br><br>You can use the --play command to play a sound / track from your library. You must specify the exact track name. An example would be...<span style='color: #000080;'><strong>--play:pit_trap </strong></span>which would play the sound by the name pit_trap from your audio library.<br></td></tr>"+
					"</tbody></table>";
                break;
            case "fx":
                var help = "<table cellpadding='0'><tbody>"+
					"<tr><td><span style='color: #0000ff;'><strong>FX</strong></span></td></tr>"+
					"<tr><td><b><code><span style='color: #903;'>--fx:[style-type]:[direction]</span></code></b><br><br>Play FX at the point of the trigger, you may play custom FX as well. The format of the command is as follows...<br><br><strong>--fx:style-type:direction&nbsp;</strong><br>Direction is optional, if it's an effect with 2 points then enter it as a compass direction of N S E W or NE SW etc. Custom effects are entered as the exact name of the custom FX.<br>"+
					"<strong>--fx:breath-fire:N</strong><br></td></tr>"+
					"</tbody></table>";
                break;
            case "ping":
                var help = "<table cellpadding='0'><tbody>"+
					"<tr><td><span style='color: #0000ff;'><strong>PING</strong></span></td></tr>"+
					"<tr><td><b><code><span style='color: #903;'>--ping</span></code></b><br><br>You can use the --ping command to ping the trigger location for all players to see.<br></td></tr>"+
					"</tbody></table>";
                break;
            case "delay":
                var help = "<table cellpadding='0'><tbody>"+
					"<tr><td><span style='color: #0000ff;'><strong>DELAY</strong></span></td></tr>"+
					"<tr><td><b><code><span style='color: #903;'>--delay:[seconds]</span></code></b><br><br>You can use the --delay command to pause the execution of the commands that follow by x seconds. It's important to note that --delay has no effect on the --halt or --disable command. <strong>--delay:5&nbsp;</strong> will insert a 5 second delay before executing proceeding commands. If you only want a small subset of commands delayed then you should insert a --delay:0 command at the end of the block to disable the delay for the rest of the commands.<br></td></tr>"+
					"</tbody></table>";
                break;
            case "door":
                var help = "<table cellpadding='0'><tbody>"+
					"<tr><td><span style='color: #0000ff;'><strong>DOOR</strong></span></td></tr>"+
					"<tr><td><b><code><span style='color: #903;'>--door:[path_id]</span></code></b><br><br>You can use the --door command to toggle a path object between the dynamic lighting and GM layer. The path will be toggeled to the opposite layer each time the --door command is triggered. You must supply the ID of the path object in the door command, you can find this by using the command !dt --id while you have the path selected..<br>This is useful for automatically opening dynamic lighting areas to players or marking the trigger with a padlock icon to allow players to activate it themselves with the !dt --activate command.<br></td></tr>"+
					"</tbody></table>";
                break;
            case "setstatus":
                var help = "<table cellpadding='0'><tbody>"+
					"<tr><td><span style='color: #0000ff;'><strong>SETSTATUS</strong></span></td></tr>"+
					"<tr><td><b><code><span style='color: #903;'>--setstatus:(-)status_name:(token_id)</span></code></b><br><br>The <strong>--setstatus</strong> command will add the named status marker to the token, this command will work with custom status markers as well and is not case sensitive.<br><br>OPTIONAL: You can put a - (minus) sign in front of the token name to indicate it's removal rather than to add it and you can also specify the ID of another token to add/remove the status icon to.<br><br> Example:<br><br>--setstatus:-k</td></tr>"+
					"</tbody></table>";
                break;
            case "disable":
                var help = "<table cellpadding='0'><tbody>"+
					"<tr><td><span style='color: #0000ff;'><strong>DISABLE</strong></span></td></tr>"+
					"<tr><td><b><code><span style='color: #903;'>--disable</span></code></b><br><br>The <strong>--disable</strong> command will disable the trigger by marking it with the Interdiction icon after being successfully run. This is useful if you only want a trigger to run once.<br></td></tr>"+
					"</tbody></table>";
                break;
            case "gmlayer":
                var help = "<table cellpadding='0'><tbody>"+
					"<tr><td><span style='color: #0000ff;'><strong>GMLAYER</strong></span></td></tr>"+
					"<tr><td><b><code><span style='color: #903;'>--gmlayer</span></code></b><br><br>The <strong>--gmlayer</strong> command will send the triggering token to the GM Layer.<br></td></tr>"+
					"</tbody></table>";
                break;
            case "note":
                var help = "<table cellpadding='0'><tbody>"+
					"<tr><td><span style='color: #0000ff;'><strong>NOTE</strong></span></td></tr>"+
					"<tr><td><b><code><span style='color: #903;'>--note:[message]</span></code></b><br><br>The <strong>--note</strong> command is just a visual effect which outputs a message in chat inside a bubble.<br></td></tr>"+
					"</tbody></table>";
                break;
            case "halt":
                var help = "<table cellpadding='0'><tbody>"+
					"<tr><td><span style='color: #0000ff;'><strong>HALT</strong></span></td></tr>"+
					"<tr><td><b><code><span style='color: #903;'>--halt</span></code></b><br><br>The <strong>--halt</strong> command once executed will stop a token on the trigger even if they move past it. Its important to note that in the event a token paths across multiple triggers once a halt is executed no other triggers are processed.<br></td></tr>"+
					"</tbody></table>";
                break;
            case "move":
                var help = "<table cellpadding='0'><tbody>"+
					"<tr><td><span style='color: #0000ff;'><strong>MOVE</strong></span></td></tr>"+
					"<tr><td><b><code><span style='color: #903;'>--move:dir:dist</span></code></b><br><br>The <strong>--move</strong> is similar to the halt command it will stop a token on the trigger and then reposition it in the distance and direction you specify. For example using <strong>--move:ne:3</strong> will stop a token on the trigger then move it 3 squares to the north east. This command also follows the same rules as <strong>--halt</strong> in that it will not activae any other triggers once it hits a move command and it will not recognize a <strong>--delay</strong> command.<br></td></tr>"+
					"</tbody></table>";
                break;
            default:
                var help = "<table cellpadding='0'><tbody>"+
					"<tr><td><strong><span style='color: blue;'>Creating a Trigger</span></strong><hr style='border: 1px dashed #000; width: 50%  margin: auto; margin-top: 5%; margin-bottom: 5%;'></td></tr>"+
					"<tr><td>Place an object on the GM layer and post tag it with <span style='color: green;'><strong>_trig</strong></span>, for example door_trig would be a valid name.<br></td></tr>"+
					"<tr><td><strong><span style='color: blue;'>Trigger Actions</span></strong><hr style='border: 1px dashed #000; width: 50%  margin: auto; margin-top: 5%; margin-bottom: 5%;'></td></tr>"+
					"<tr><td>In the GM Notes section of the trigger you may type any number of commands each on their own line. All Dungeon Trigger specific commands being with a double dash -- however you may use commands for other API mods as well and these will be output to chat. You can insert <span style='color: red;'><strong>VICTIM_ID</strong></span> into the line which will be replaced with the ID of the token who stepped on the trigger and inserting <span style='color: red;'><strong>VICTIM_NAME</strong></span> into the line will replace it with the tokens name. The insert tags can be useful when you need to send the player ID or name to another mod or you can use them in normal commands, for example you could use <span style='color: #000080;'><strong>/w VICTIM_NAME You notice a trap!</strong></span> to whisper only the player who steps on the trigger.<br> You can also insert the variables of the last check or save with <span style='color: red;'><strong>LAST_ROLL</strong></span>, <span style='color: red;'><strong>LAST_BONUS</strong></span>, or <span style='color: red;'><strong>LAST_DC</strong></span> which will output the corrosponding values for the last check or save that was rolled.</td></tr>"+
					"<tr><td><strong><span style='color: blue;'>Activating a Trigger</span></strong><hr style='border: 1px dashed #000; width: 50%  margin: auto; margin-top: 5%; margin-bottom: 5%;'></td></tr>"+
					"<tr><td>Any token pathing across the square a trigger occupies will cause it to run the code in the GM Notes section. If you want the trigger to activate only if a token lands directly on it flag the trigger with the Boot Icon <img src='https://game-icons.net/icons/ffffff/000000/1x1/lorc/tread.png' alt='Boot' width='20' height='20' />.<br></td></tr>"+
					"<tr><td><strong><span style='color: blue;'>Manual Activation</span></strong><hr style='border: 1px dashed #000; width: 50%  margin: auto; margin-top: 5%; margin-bottom: 5%;'></td></tr>"+
					"<tr><td>You can set a Padlock Icon <img src='https://game-icons.net/icons/ffffff/000000/1x1/lorc/padlock.png' alt='Padlock' width='20' height='20' />on a trigger which will prevent it from being activated by a token crossing its path or stopping on it. This trigger can only be activated if a token is overlapping the trigger and while the token is selected the command <span style='color: #000080;'><strong>!dt --activate</strong></span> is run.<br></td></tr>"+
					"<tr><td><strong><span style='color: blue;'>Disabling a Trigger</span></strong><hr style='border: 1px dashed #000; width: 50%  margin: auto; margin-top: 5%; margin-bottom: 5%;'></td></tr>"+
					"<tr><td>Placing an Interdiction Icon <img src='https://s3.amazonaws.com/files.d20.io/images/8074185/cyt6rWIaUiMvq-4CnpskZQ/thumb.png?1425598647' /> on a trigger token will disable it. Also using the <span style='color: #000080;'><strong>--disable</strong></span> command inside a trigger will automatically mark the trigger disabled after it's run successfully.<br></td></tr>"+
					"<tr><td><strong><span style='color: blue;'>Flying Tokens</span></strong><hr style='border: 1px dashed #000; width: 50%  margin: auto; margin-top: 5%; margin-bottom: 5%;'></td></tr>"+
					"<tr><td>If you mark a trigger with the wing status marker <img src='https://game-icons.net/icons/ffffff/000000/1x1/lorc/fluffy-wing.png' alt='fluffy-wing' width='20' height='20' /> then any token also marked with the wing status marker will be ignored by the trigger.<br></td></tr>"+
					"<tr><td><strong><span style='color: blue;'>COMMANDS OVERVIEW</span></strong><hr style='border: 1px dashed #000; width: 50%  margin: auto; margin-top: 5%; margin-bottom: 5%;'></td></tr>"+
					"<tr><td>Dungeon Trigger has a number of its own commands you can run to do things like generate FX on the trigger, play a sound, ping the map etc. Each command should be entered on it's own line, any command that does not begin with a double dash will be output to chat exactly as written. The following is a short description of each command native to Dungeon Trigger. Click on a command below for more details on each.<br><br><ul><li><span style='color: blue;'>[--check:skill:dc:show](!dt --help-check-save)</span></li><li><span style='color: blue;'>[--save:stat:dc:show](!dt --help-check-save)</span> </li><li><span style='color: blue;'>[--key:icon-name](!dt --help-key)</span></li><li><span style='color: blue;'>[--else](!dt --help-else)</span></li><li><span style='color: blue;'>[--end](!dt --help-end)</span></li><li><span style='color: blue;'>[--play:trackname](!dt --help-play)</span></li><li><span style='color: blue;'>[--fx:style-type:direction](!dt --help-fx)</span></li><li><span style='color: blue;'>[--ping](!dt --help-ping)</span></li><li><span style='color: blue;'>[--delay:seconds](!dt --help-delay)</span></li><li><span style='color: blue;'>[--door:path_id](!dt --help-door)</span></li><li><span style='color: blue;'>[--setstatus:status_name:ID](!dt --help-setstatus)</span></li><li><span style='color: blue;'>[--disable](!dt --help-disable)</span></li><li><span style='color: blue;'>[--gmlayer](!dt --help-gmlayer)</span></li><li><span style='color: blue;'>[--note:message](!dt --help-note)</span></li><li><span style='color: blue;'>[--halt](!dt --help-halt)</span></li><li><span style='color: blue;'>[--move:dir:dis](!dt --help-move)</span></li></ul><br></td></tr>"+
					"</tbody></table>";
                break;
        }
        
        sendNotification('Dungeon Trigger Help','',true,help);      

    },
	
	checkInstall = function()
	{
	    var script_version = "2.0.1";
        if( ! state.DungeonTrigger ) {
                state.DungeonTrigger = {
                    version: script_version,
					run_delay: 0,
                    run_cmd: true,
                    halt_trig: false,
                    last_roll: 0,
                    last_dc: 0,
                    last_bonus: 0,
                };
            }    
        
        if (state.DungeonTrigger.version != script_version)
            state.DungeonTrigger.version = script_version;
        
            log("-=> Dungeon Trigger v"+state.DungeonTrigger.version+" Initialized <=-")
	},

    	
	registerEventHandlers = function() {
		on('chat:message', handleInput);
		on('change:graphic', handleTrigger);
	};

	return {
		CheckInstall: checkInstall,
		RegisterEventHandlers: registerEventHandlers
	};

}());

on("ready", function() {
    'use strict';

    // Verify if VecMath is installed as a required dependancy.
    if (typeof VecMath == 'undefined') {
        log("-=> Dungeon Trigger: [DEPENDANCY MISSING] Vector Math must be installed for DungeonTrigger.");
        sendChat('Dungeon Trigger', '/w gm Dependancy Missing - You must have TokenCollisions, PathMath, & Vector Math installed.');
        return;
    }
    
    // Verify if PathMath is installed as a required dependancy.
    if (typeof PathMath == 'undefined') {
        log("-=> Dungeon Trigger: [DEPENDANCY MISSING] PathMath must be installed for DungeonTrigger.");
        sendChat('Dungeon Trigger', '/w gm Dependancy Missing - You must have TokenCollisions, PathMath, & Vector Math installed.');
        return;
    }
    
    // Verify if TokenCollisions is installed as a required dependancy.
    if (typeof TokenCollisions == 'undefined') {
        log("-=> Dungeon Trigger: [DEPENDANCY MISSING] TokenCollisions must be installed for DungeonTrigger.");
        sendChat('Dungeon Trigger', '/w gm Dependancy Missing - You must have TokenCollisions, PathMath, & Vector Math installed.');
        return;
    }
    
	DungeonTrigger.CheckInstall();
	DungeonTrigger.RegisterEventHandlers();

});
