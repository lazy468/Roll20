<table cellpadding='0'><tbody>
<tr><td><h2>Dungeon Trigger</h2></td></tr>
<tr><td><strong><span style='color: blue;'>What this script does.</span></strong><hr style='border: 1px dashed #000; width: 50%  margin: auto; margin-top: 5%; margin-bottom: 5%;'>
<tr><td>Dungeon Trigger allows you to take an object on the GM layer and aftering appending <b>_trig</b> to the object name you can add commands in the GM notes section and flags on the object itself to manipulate how it interacts with tokens that step on or move through it. It has a number of its own commands you can run to do things like generate FX on the trigger, play a sound, ping the map etc. Each command should be entered on it's own line, any command that does not begin with a double dash (--) will be output to chat exactly as written. The following is a short description of each command native to Dungeon Trigger. You can access this help in the script with <b>!dt</b>.<br><br> 
  <ul>
  <lh>Conditional Checks</lh>
  <li>--check:skill_abbreviation:dc:show</li>
  <li>--save:stat:dc:show</li>
  <li>--key:icon-name</li>
  <li>--else</li>
  <li>--end</li>
  </ul>
  
  <ul>
  <lh>Action Commands</lh>
  <li>--play:trackname</li>
  <li>--fx:style-type:direction</li>
  <li>--ping</li>
  <li>--delay:seconds</li>
  <li>--door:path_id</li>
  <li>--setstatus:status_name:ID</li>
  <li>--disable</li>
  <li>--gmlayer</li>
  <li>--note:message</li>
  <li>--halt</li>
  <li>--move:dir:dis</li>
  </ul>
  
  <ul>
    <lh>Text Replacers</lh>
    <li>VICTIM_NAME - Replaces with the name of the triggering token</li>
    <li>VICTIM_ID - Replaces with the ID of the triggering token</li>
    <li>LAST_ROLL - Replaces with the value of the last check/save roll</li>
    <li>LAST_DC - Replaces with the value of the last DC check/save</li>
    <li>LAST_BONUS - Replaces with the last bonus check/save</li>
  </ul>
  Because lines not marked with double dash (--) are directly output to game chace you can use replacers to do things like send whispers to specific players or even trigger other mod commands such as...<br>
  <ul>
  <li>/w VICTIM_NAME You notice a trap! - will whisper the user who triggered the action</li>
  <li>!someAPI VICTIM_ID - would trigger another api with the ID of the triggering token</li>
  </ul>
  </td></tr>
<tr><td>Commands:<br><ul><li>!dt - displays the command help menu</li><li>!dt --id - returns the ID of the selected object in chat</li><li>!dt --activate - used for activating a trigger marked as manual with the padlock icon, triggered from a token overlapping the trigger</li></ul></td></tr>
<tr><td><strong><span style='color: blue;'>Creating a Trigger</span></strong><hr style='border: 1px dashed #000; width: 50%  margin: auto; margin-top: 5%; margin-bottom: 5%;'></td></tr>
<tr><td>Place an object on the GM layer and post tag it with <span style='color: green;'><strong>_trig</strong></span>, for example door_trig would be a valid name.<br></td></tr>
<tr><td><strong><span style='color: blue;'>Trigger Actions</span></strong><hr style='border: 1px dashed #000; width: 50%  margin: auto; margin-top: 5%; margin-bottom: 5%;'></td></tr>
<tr><td>In the GM Notes section of the trigger you may type any number of commands each on their own line. All Dungeon Trigger specific commands being with a double dash -- however you may use commands for other API mods as well and these will be output to chat. You can insert <span style='color: red;'><strong>VICTIM_ID</strong></span> into the line which will be replaced with the ID of the token who stepped on the trigger and inserting <span style='color: red;'><strong>VICTIM_NAME</strong></span> into the line will replace it with the tokens name. The insert tags can be useful when you need to send the player ID or name to another mod or you can use them in normal commands, for example you could use <span style='color: #000080;'><strong>/w VICTIM_NAME You notice a trap!</strong></span> to whisper only the player who steps on the trigger.<br> You can also insert the variables of the last check or save with <span style='color: red;'><strong>LAST_ROLL</strong></span>, <span style='color: red;'><strong>LAST_BONUS</strong></span>, or <span style='color: red;'><strong>LAST_DC</strong></span> which will output the corrosponding values for the last check or save that was rolled.</td></tr>
<tr><td><strong><span style='color: blue;'>Activating a Trigger</span></strong><hr style='border: 1px dashed #000; width: 50%  margin: auto; margin-top: 5%; margin-bottom: 5%;'></td></tr>
<tr><td>Any token pathing across the square a trigger occupies will cause it to run the code in the GM Notes section. If you want the trigger to activate only if a token lands directly on it flag the trigger with the Boot Icon <img src='https://game-icons.net/icons/ffffff/000000/1x1/lorc/tread.png' alt='Boot' width='20' height='20' />.<br></td></tr>
<tr><td><strong><span style='color: blue;'>Manual Activation</span></strong><hr style='border: 1px dashed #000; width: 50%  margin: auto; margin-top: 5%; margin-bottom: 5%;'></td></tr>
<tr><td>You can set a Padlock Icon <img src='https://game-icons.net/icons/ffffff/000000/1x1/lorc/padlock.png' alt='Padlock' width='20' height='20' />on a trigger which will prevent it from being activated by a token crossing its path or stopping on it. This trigger can only be activated if a token is overlapping the trigger and while the token is selected the command <span style='color: #000080;'><strong>!dt --activate</strong></span> is run.<br></td></tr>
<tr><td><strong><span style='color: blue;'>Disabling a Trigger</span></strong><hr style='border: 1px dashed #000; width: 50%  margin: auto; margin-top: 5%; margin-bottom: 5%;'></td></tr>
<tr><td>Placing an Interdiction Icon <img src='https://s3.amazonaws.com/files.d20.io/images/8074185/cyt6rWIaUiMvq-4CnpskZQ/thumb.png?1425598647' /> on a trigger token will disable it. Also using the <span style='color: #000080;'><strong>--disable</strong></span> command inside a trigger will automatically mark the trigger disabled after it's run successfully.<br></td></tr>
<tr><td><strong><span style='color: blue;'>Flying Tokens</span></strong><hr style='border: 1px dashed #000; width: 50%  margin: auto; margin-top: 5%; margin-bottom: 5%;'></td></tr>
<tr><td>If you mark a trigger with the wing status marker <img src='https://game-icons.net/icons/ffffff/000000/1x1/lorc/fluffy-wing.png' alt='fluffy-wing' width='20' height='20' /> then any token also marked with the wing status marker will be ignored by the trigger.<br></td></tr>
</td></tr>
</tbody></table>
