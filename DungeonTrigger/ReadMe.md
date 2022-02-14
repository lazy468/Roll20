<table cellpadding='0'><tbody>
<tr><td><h2 id='top'>Dungeon Trigger</h2></td></tr>
<tr><td><strong>What this script does.</span></strong></td></tr>
<tr><td><p>Dungeon Trigger allows you to take an object on the GM layer and aftering appending <b>_trig</b> to the object name you can add commands in the GM notes section and flags on the object itself to manipulate how it interacts with tokens that step on or move through it.</p>
<p>Once a trigger is activated it essentially runs through the GM notes section line by line either running the command or outputting the text in chat, commands are prefaced with a double dash (--). Commands can be run to do things like generate FX on the trigger, play a sound, ping the map etc. Each command should be entered on it's own line, any command that does not begin with a double dash (--) will be output to chat exactly as written, which means you can use this feature to trigger other mods commands giving you an almost unlimited variety of combinations that you can do with triggers.</p>
<p>The following is a short description of each command native to Dungeon Trigger. You can access this help in the script with <b>!dt</b>.</p><br>
  
  <ul>
  <lh>Conditional Checks</lh>
  <li><a href='#check/save'>--check:skill_abbreviation:dc:show</a></li>
    <ul><li>Rolls a skill check for the triggering token to determin if the following commands will be run</li></ul>
  <li><a href='#check/save'>--save:stat:dc:show</a></li>
    <ul><li>Rolls a save for the triggering token to determin if the following commands will be run</li></ul>
  <li><a href='#key'>--key:icon-name</a></li>
    <ul><li>Checks if the token has the designated icon status before running</li></ul>
  <li><a href='#else'>--else</a></li>
    <ul><li>Swaps the current run state to the opposite of what it currently is.</li></ul>
  <li><a href='#end'>--end</a></li>
    <ul><li>Set the current run state to TRUE</li></ul>
  </ul>
<h4>Conditional Checks & Run State...</h4>
When a trigger is activated the default run state is TRUE until it encounters a conditional command which sets the state to FALSE, such as failing a check or not meeting the requirements for KEY. Each line can change depending on the command for example if a check was failed but the <code>--else</code> command is encountered it will filp flop the run state to the opposite which is now TRUE again. You can always use the <code>--end</code> command to set the state back to TRUE.
<br>
<br>
  <ul>
  <lh>Action Commands</lh>
  <li><a href='#play'>--play:trackname</a></li>
    <ul><li>Plays a sound with the specified track name.</li></ul>
  <li><a href='#fx'>--fx:style-type:direction</a></li>
    <ul><li>Displays an effect (or custom effect) when triggered.</li></ul>
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
  Because lines not marked with double dash (--) are directly output to game chace you can use replacers to do things like send whispers to specific players or even trigger other mod commands such as...<br><br>
  <ul>
  <li>/w VICTIM_NAME You notice a trap! - will whisper the user who triggered the action</li>
  <li>!someAPI VICTIM_ID - would trigger another api with the ID of the triggering token</li>
  </ul>
  </td></tr>
<tr><td>Chat Commands:<br><ul><li>!dt - displays the command help menu</li><li>!dt --id - returns the ID of the selected object in chat</li><li>!dt --activate - used for activating a trigger marked as manual with the padlock icon, triggered from a token overlapping the trigger</li></ul></td></tr>
<tr><td><strong>Creating a Trigger</strong></td></tr>
<tr><td>Place an object on the GM layer and post tag it with <code><strong>_trig</strong></code>, for example door_trig would be a valid name.<br></td></tr>
<tr><td><strong>Trigger Actions</strong></td></tr>
<tr><td>In the GM Notes section of the trigger you may type any number of commands each on their own line. All Dungeon Trigger specific commands being with a double dash -- however you may use commands for other API mods as well and these will be output to chat. You can insert <code><strong>VICTIM_ID</strong></code> into the line which will be replaced with the ID of the token who stepped on the trigger and inserting <code><strong>VICTIM_NAME</strong></code> into the line will replace it with the tokens name. The insert tags can be useful when you need to send the player ID or name to another mod or you can use them in normal commands, for example you could use <code><strong>/w VICTIM_NAME You notice a trap!</strong></code> to whisper only the player who steps on the trigger.<br> You can also insert the variables of the last check or save with <code><strong>LAST_ROLL</strong></code>, <code><strong>LAST_BONUS</strong></code>, or <code><strong>LAST_DC</strong></code> which will output the corrosponding values for the last check or save that was rolled.</td></tr>
<tr><td><strong><span style='color: blue;'>Activating a Trigger</span></strong></td></tr>
<tr><td>Any token pathing across the square a trigger occupies will cause it to run the code in the GM Notes section. If you want the trigger to activate only if a token lands directly on it flag the trigger with the Boot Icon <img src='https://game-icons.net/icons/ffffff/000000/1x1/lorc/tread.png' alt='Boot' width='20' height='20' />.<br></td></tr>
<tr><td><strong><span style='color: blue;'>Manual Activation</span></strong></td></tr>
<tr><td>You can set a Padlock Icon <img src='https://game-icons.net/icons/ffffff/000000/1x1/lorc/padlock.png' alt='Padlock' width='20' height='20' />on a trigger which will prevent it from being activated by a token crossing its path or stopping on it. This trigger can only be activated if a token is overlapping the trigger and while the token is selected the command <span style='color: #000080;'><strong>!dt --activate</strong></span> is run.<br></td></tr>
<tr><td><strong><span style='color: blue;'>Disabling a Trigger</span></strong></td></tr>
<tr><td>Placing an Interdiction Icon <img src='https://s3.amazonaws.com/files.d20.io/images/8074185/cyt6rWIaUiMvq-4CnpskZQ/thumb.png?1425598647' /> on a trigger token will disable it. Also using the <span style='color: #000080;'><strong>--disable</strong></span> command inside a trigger will automatically mark the trigger disabled after it's run successfully.<br></td></tr>
<tr><td><strong><span style='color: blue;'>Flying Tokens</span></strong></td></tr>
<tr><td>If you mark a trigger with the wing status marker <img src='https://game-icons.net/icons/ffffff/000000/1x1/lorc/fluffy-wing.png' alt='fluffy-wing' width='20' height='20' /> then any token also marked with the wing status marker will be ignored by the trigger.<br></td></tr>
</td></tr>
</tbody></table>
<br>
<br>
<table cellpadding='0'><tbody>
<tr><td><h2>Command Details</h2></td></tr>
  <tr><td>
  <tr><td><strong><h3 id='check/save'>CHECK / SAVE</h3></strong><a href='#top'>back to top</a></td></tr>
  <tr><td><b><code>--check:[skill/stat]:[DC]:show</code></b>
    <br>
    <b><code>--save:[stat]:[DC]:show</code></b>
    <br>
    <br>
    You can create conditions under which your commands will execute using --check, --save, or --key commands. A check can use any of the following to pull the bonus from the triggering characters stat block and roll against the set DC. Its important to note that the conditional code after a --check command triggers on a check success where a --save triggers on a failure. Typically checks and saves are hidden and only shown to the GM however if you append <span style='color: #800000;'><strong>:show</strong></span> at the end the command the roll will be shown in public chat when the condition would trigger.
    <ul>
      <li><code>acrobatics</code> Acrobatics Check</li>
      <li><code>athletics</code> Athletics Check</li>
      <li><code>pperception</code> Passive Perception (no roll)</li>
      <li><code>perception</code> Perception Check</li>
      <li><code>investigation</code> Investigation Check</li>
      <li><code>stealth</code> Stealth Check</li>
      <li><code>str</code> Str Check / Save</li>
      <li><code>dex</code> Dex Check / Save</li>
      <li><code>con</code> Con Check / Save</li>
      <li><code>int</code> Int Check / Save</li>
      <li><code>wis</code> Wis Check / Save</li>
      <li><code>cha</code> Cha Check / Save</li>
  </ul>
  Here are some examples:<br /><strong>--check:[SKILL/STAT]:[DC]:show</strong>
  <br />
  <em>Commands run on a successful check and the roll will be output to chat.</em><br /><strong>--end</strong><br /><br /><strong>--save:dex:15</strong><br /><em>Commands here run on a failed roll of 14 or lower with the tokens Dex Save bonus. </em><br /><strong>--end</strong><br /> <br /><strong>--check:perception:17:show</strong><br /><em>Commands here run on a 17 or better perception check and the players will see the roll because of the :show tag</em><br /><strong>--end</strong><br /><em>Commands here will run either way</em>
<br>
</td></tr>

<tr><td><strong><h3 id='key'>KEY</h3></strong><a href='#top'>back to top</a></td></tr>
<tr><td>
<b><code>--key:[icon_name]</span></code></b><br><br>You can use the --key command to designate the trigger target must have the selected status marker to activate.
<br>
<br>
Here are some examples:<br />
<strong>--key:blue</strong><br /><em>Commands run if token has the blue dot status</em><br /><strong>--end</strong>
<br>
Some examples of icon names are red, blue, green, brown, purple, pink, yellow, dead, skull, sleepy, half-heart, half-haze, interdiction...<br>
</td></tr>


<tr><td><strong><h3 id='else'>ELSE</h3></strong><a href='#top'>back to top</a></td></tr>
<tr><td>
<b><code>--else</code></b>
<br>
<br>
The else command toggles the triggers run state to the opposite. A trigger always starts with a run state of TRUE which allows it to execute commands. If a condition fails like a <code>--check</code> command then that state becomes FALSE preventing commands from running. When the <code>--else</code> command is encountered it switches to the opposite run state. This can be used to run a separate set of commands in the even a conditon passes or fails.
<br>
<br>
Here are some examples:<br />
<strong>--check:perception:17:show</strong><br /><em>Commands here run on a 17 or better perception check and the players will see the roll because of the :show tag</em><br /><strong>--else</strong><br /><em>Commands here run on 16 or lower perception check, only the GM will see the roll.</em><br /><strong>--end</strong><br /><em>Commands here will run either way</em><br>
</td></tr>

<tr><td><strong><h3 id='end'>END</h3></strong><a href='#top'>back to top</a></td></tr>
<tr><td>
<b><code>--end</code></b>
<br>
<br>
Forces the run state of the trigger back to TRUE allowing all further commands to be executed as normal. This can be useful if you have a condition block but you also want additional commands to run either way.<br>
</td></tr>

<tr><td><strong><h3 id='play'>PLAY</h3></strong><a href='#top'>back to top</a></td></tr>
<tr><td>
  <b><code>--play:[track_name]</code></b><br><br>You can use the <code>--play</code> command to play a sound / track from your library. You must specify the exact track name.<br>
<br>
  Here are some examples:<br />
  <code><strong>--play:pit_trap </strong></code>which would play the sound by the name pit_trap from your audio library.<br>
</td></tr>

<tr><td><strong><h3 id='fx'>FX</h3></strong><a href='#top'>back to top</a></td></tr>
<tr><td>
<b><code>--fx:[style-type]:[direction]</code></b>
<br>
<br>
Play FX at the point of the trigger, you may play custom FX as well. The format of the command is as follows...
<br>
<br>
<code><strong>--fx:style-type:direction</strong></code>
<br>
Direction is optional, if it's an effect with 2 points then enter it as a compass direction of N S E W or NE SW etc. Custom effects are entered as the exact name of the custom FX.
<br>
<br>
Here are some examples:<br />
<code><strong>--fx:breath-fire:N</strong></code> - Fire Breath North<br>
<code><strong>--fx:custom_lightning:NE</strong></code> - Your 'custom_lightning' effect NE<br>
<code><strong>--fx:nova-charm</strong></code> - Nova effect (purple) charm<br>
</td></tr>  
  
</table>
