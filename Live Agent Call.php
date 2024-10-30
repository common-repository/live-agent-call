<?php
/*
Plugin Name: Live Agent Call
Plugin URI: http://echobyte.net/live-agent-call/
Description: Live Agent Ip Calling from Web.
Version: 0.1.1
Author: Nabeel Yasin
Author URI: http://echobyte.net
License: GPL2
*/
?>
<?php
/*  Copyright 2017  Nabeel Yasin  (email : coderslearning@gmail.com)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as 
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    along with this program; if not, write to the Free Software
    You should have received a copy of the GNU General Public License
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
?>
<?php
define('lac_VERSION','0.1.1');
add_action('admin_menu', 'register_lac_page');
add_action('admin_init', 'lac_options_init');

function register_lac_page() {
	add_submenu_page('options-general.php', 'Live Agent Call', 'Live Agent Call', 'manage_options', 'Live-Agent-Call', 'lac_live_agent_settings_page');
}
lac_set_basic_options();
// add the color picker
add_action( 'admin_enqueue_scripts', 'lac_enqueue_color_picker' );
add_action('wp_enqueue_scripts', 'lac_callback_for_setting_scripts');
add_action( 'admin_enqueue_scripts', 'lac_admin_callback_for_setting_scripts' );


function lac_callback_for_setting_scripts() {

  wp_enqueue_script( 'lac-script-handle1', plugins_url('gui.js', __FILE__), array( 'jquery' ),false, true );
  wp_enqueue_script( 'lac-script-handle2', plugins_url('init.js', __FILE__), array( 'jquery' ),false, true );
  wp_enqueue_script( 'lac-script-handle3', plugins_url('sip-0.7.3.js', __FILE__), array( 'jquery' ),false, true );
  wp_enqueue_script('jquery-ui-draggable');
		
  wp_enqueue_script( 'lac-script-handle5', plugins_url('ua4.js', __FILE__), array( 'jquery' ),false, true );
// wp_enqueue_script( 'namespaceformyscript5', plugins_url('ua3.js'), array( 'jquery' ) );
}


function lac_admin_callback_for_setting_scripts() {

  wp_enqueue_script( 'lac-script-handle1', plugins_url('gui.js', __FILE__), array( 'jquery' ),false, true );
  wp_enqueue_script( 'lac-script-handle2', plugins_url('init.js', __FILE__), array( 'jquery' ),false, true );
  wp_enqueue_script( 'lac-script-handle3', plugins_url('sip-0.7.3.js', __FILE__), array( 'jquery' ),false, true );
  wp_enqueue_script('jquery-ui-draggable');
		
  wp_enqueue_script( 'lac-script-handle5', plugins_url('ua3.js', __FILE__), array( 'jquery' ),false, true );
}


function lac_enqueue_color_picker( $hook_suffix ) {
    wp_enqueue_style( 'wp-color-picker' );
    wp_enqueue_script( 'lac-script-handle', plugins_url('call.js', __FILE__ ), array( 'wp-color-picker' ), false, true );
}
function lac_getstyle()
{
    // moved the js to an external file, you may want to change the path
   wp_enqueue_style('hrw', plugins_url('css.css', __FILE__ ), null, null, false);
}
add_action('wp_enqueue_scripts', 'lac_getstyle');
add_action('admin_enqueue_scripts', 'lac_getstyle');
function lac_options_init() {
	register_setting('lac_options','lac');
}
function lac_live_agent_settings_page() { ?>
<div class="wrap"><h2>Live Agent Call<span > by <a href="http://www.echobyte.net" rel="help">Nabeel Yasin</a></span></h2>


<form method="post" action="options.php">
 <?php settings_fields('lac_options'); ?>
<?php $options = lac_get_options(); ?>
			<h4 style="max-width:700px; text-align:right; margin:0;cursor:pointer; color:#21759b" class="lac_settings"><span class="plus">+</span><span class="minus">-</span> Advanced settings</h4>
           
             <input class="phonebookbtn"  id='phonemainbtn' value=" PhoneBook" />
                        <table class="form-table">
            	<tr valign="top"><th scope="row">Enabled/Disabled</th>
                	<td>
                    	<input name="lac[active]" type="radio" value="1" <?php checked('1', $options['active']); ?> /> Enabled<br />
                        <input name="lac[active]" type="radio" value="0" <?php checked('0', $options['active']); ?> /> Disabled
                    </td>
                </tr>
             <tr valign="top"><th scope="row"></th>
                      <td><h2>Customer Side Configuration</h2></td>
                 </tr>
                 <tr valign="top"><th scope="row">Customer Sip Domain</th>
                    <td><input type="text" name="lac[customersipdomain]" value="<?php echo $options['customersipdomain']; ?>" /></td>
                 </tr>
                 <tr valign="top"><th scope="row">Customer WSS Server</th>
                    <td><input type="text" name="lac[customerwss]" value="<?php echo $options['customerwss']; ?>" /></td>
                 </tr>
                  <tr valign="top"><th scope="row">Customer Auth Username</th>
                    <td><input type="text" name="lac[customerauthusername]" value="<?php echo $options['customerauthusername']; ?>" /></td>
                 </tr>
                 <tr valign="top"><th scope="row">Customer Sip User Name</th>
                    <td><input type="text" name="lac[customersipusername]" value="<?php echo $options['customersipusername']; ?>" /></td>
                 </tr>
                 <tr valign="top"><th scope="row">Customer Sip Password</th>
                    <td><input type="text" name="lac[customersippassword]" value="<?php echo $options['customersippassword']; ?>" /></td>
                 </tr>
                  <tr valign="top"><th scope="row"></th>
                      <td><h2>Agent Side Configuration</h2></td>
                 </tr>
                   <tr valign="top"><th scope="row">Agent Sip Domain</th>
                    <td><input type="text" name="lac[agentsipdomain]" value="<?php echo $options['agentsipdomain']; ?>" /></td>
                 </tr>
                 <tr valign="top"><th scope="row">Agent WSS Server</th>
                    <td><input type="text" name="lac[agentwss]" value="<?php echo $options['agentwss']; ?>" /></td>
                 </tr>
                  <tr valign="top"><th scope="row">Agent Auth Username</th>
                    <td><input type="text" name="lac[agentauthusername]" value="<?php echo $options['agentauthusername']; ?>" /></td>
                 </tr>
                 <tr valign="top"><th scope="row">Agent Sip User Name</th>
                    <td><input type="text" name="lac[agentsipusername]" value="<?php echo $options['agentsipusername']; ?>" /></td>
                 </tr>
                 <tr valign="top"><th scope="row">Agent Sip Password</th>
                    <td><input type="text" name="lac[agentsippassword]" value="<?php echo $options['agentsippassword']; ?>" /></td>
                 </tr>
                 
			</table>
            <div id="settings">
            	<table class="form-table">
				<tr valign="top"><th scope="row">Icon color</th>
                	<td><input name="lac[color]" type="text" value="<?php echo $options['color']; ?>" class="lac-color-field" data-default-color="#F20000" /></td>
                </tr>
                <tr valign="top"><th scope="row">Icon color hover</th>
                	<td><input name="lac[colorhover]" type="text" value="<?php echo $options['colorhover']; ?>" class="lac-color-field-hover" data-default-color="#75eb50" /></td>
                </tr>
				<tr valign="top"><th scope="row">Appearance</th>
                	<td>
                    	<label title="right">
                        	<input type="radio" name="lac[appearance]" value="right" <?php checked('right', $options['appearance']); ?>>
                            <span>Right bottom</span>
                        </label><br />
                    	<label title="left">
                        	<input type="radio" name="lac[appearance]" value="left" <?php checked('left', $options['appearance']); ?>>
                            <span>Left bottom</span>
                        </label><br />
                    </td>
                </tr>
             </table>
			</div><!--#settings-->
             <p class="submit">
             <input type="submit" class="button button-primary" value="<?php _e('Save Changes') ?>" />
             </p>
             </form>
    </div>
<div id="toPopup">
<p  class="cancel"  onclick="HidePhone()">&times;</p>
 <center>
<div class="ext" id="ext">Extension:</div>
                    <div class="status">
                      
                        <div id="conn-status">
                            <span class="field">status: </span>
                            <span id="ua-status">Disconnected</span>
<!--                            <span id="ua-status" class="value"></span>-->
   <button id="ua-register"  style="display:none" class="btnclass">Register</button>
<!--          <span class="field">user: </span>
  <span class="value user"></span>-->
                        </div>
                    </div>
                </center>

  <div class='phonebook'>
    <ul id="session-list"></ul>

                           <ul id="templates">
      <li id="session-template" class="template session">
        <h2><strong class="display-name"></strong> <span style="display:none" class="uri"></span></h2>
<div>
        <button    class="phonechildbtn green btnclass">Green</button>
        <button   class="phonechildbtn red btnclass">Red</button>
</div>
<div style="margin-top: 10px;">
  <button  style=""  id="hold" class="phonechildbtn Hold btnclass">Hold</button>           <button  style=""  id="Transfer" class="phonechildbtn Transfer btnclass">Transfer</button>
</div> 
        <form class="dtmf" action="" style="display:none">
          <label>DTMF <input type="text" maxlength="1" /></label>
          <input type="submit" value="Send" />
        </form>
        <video autoplay>Video Disabled or Unavailable</video>
<!--        <ul class="messages"></ul>
        <form class="message-form" action="">
          <input type="text" placeholder="Type to send a message"/><input type="submit" value="Send" />
        </form>-->
      </li>

    </ul>  
                  
                        </div>

 <div id="phone">
                        <div class="controls">

                            <div class="ws-disconnected"></div>

                            <div class="dialbox">
                                <input type="text" id="ua-uri" class="destination" value=""/>
                                <div class="to">To:</div>
                                <div class="dial-buttons">
                                    <center><input type="submit" class="phonechildbtn btnclass" id="ua-invite-submit" value="Call" /> 
				      <input type="submit" style="display:none" id="ua-invite-hangup" value="HangUp" /> 
</center>
                                     
<!--                                    <div class="button call">call</div> -->
                                </div>
                            </div>

                            <div class="dialpad">
                                <div class="line">
                                    <div class="button digit-1">1</div>
                                    <div class="button digit-2">2</div>
                                    <div class="button digit-3">3</div>
                                </div>
                                <div class="line-separator"></div>
                                <div class="line">
                                    <div class="button digit-4">4</div>
                                    <div class="button digit-5">5</div>
                                    <div class="button digit-6">6</div>
                                </div>
                                <div class="line-separator"></div>
                                <div class="line">
                                    <div class="button digit-7">7</div>
                                    <div class="button digit-8">8</div>
                                    <div class="button digit-9">9</div>
                                </div>
                                <div class="line-separator"></div>
                                <div class="line">
                                    <div class="button digit-asterisk">*</div>
                                    <div class="button digit-0">0</div>
                                    <div class="button digit-pound">#</div>
                                </div>
                            </div><!-- .dialpad -->



    <!-- Templates to clone Sessions and Messages -->

                        </div><!-- .controls -->

 
</div>
                    </div>
<audio id="ringtone" src="<?php echo plugins_url( 'ringtone.wav', __FILE__ ) ?>"  ></audio>



<?php  $alloptions = get_option('lac'); ?>
<input type="hidden" id="agentsipdomain" value="<?php echo $alloptions['agentsipdomain']?>"/>
        <input type="hidden" id="agentsipwss" value="<?php echo $alloptions['agentwss']?>"/>
        <input type="hidden" id="agentsipusername" value="<?php echo $alloptions['agentsipusername']?>"/>
        <input type="hidden" id="agentauthusername" value="<?php echo $alloptions['agentauthusername']?>"/>
         <input type="hidden" id="agentsippassword" value="<?php echo $alloptions['agentsippassword']?>"/>

<?php }
if(get_option('lac') && !is_admin()) {
	
	// Color functions to calculate borders
	function lac_changeColor($color, $direction) {
		if(!preg_match('/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i', $color, $parts));
		if(!isset($direction) || $direction == "lighter") { $change = 45; } else { $change = -50; }
		for($i = 1; $i <= 3; $i++) {
		  $parts[$i] = hexdec($parts[$i]);
		  $parts[$i] = round($parts[$i] + $change);
		  if($parts[$i] > 255) { $parts[$i] = 255; } elseif($parts[$i] < 0) { $parts[$i] = 0; }
		  $parts[$i] = dechex($parts[$i]);
		} 
		$output = '#' . str_pad($parts[1],2,"0",STR_PAD_LEFT) . str_pad($parts[2],2,"0",STR_PAD_LEFT) . str_pad($parts[3],2,"0",STR_PAD_LEFT);
		return $output;
	}
	
	
	$options = get_option('lac');
	if(isset($options['active'])) $enabled = $options['active']; else $enabled = 0;
	if($enabled == '1') {
		// it's enables so put footer stuff here
		function lac_head() {
			$options = get_option('lac');
	       $credits = "\n<!-- Live Agent Call".lac_VERSION." by Nabeel Yasin -->\n";
			$credits .="<style>";  
			$credits .=".mypage-alo-ph-circle {border-color: ".lac_changeColor($options['color'], 'darker').";}
                        .mypage-alo-ph-circle-fill {background-color:".lac_changeColor($options['color'], 'darker').";}
                        .mypage-alo-ph-img-circle {background-color: ".lac_changeColor($options['color'], 'darker').";}";
			$credits .=".mypage-alo-phone:hover .mypage-alo-ph-circle {border-color: ".lac_changeColor($options['colorhover'], 'darker').";}
                        .mypage-alo-phone:hover .mypage-alo-ph-circle-fill {background-color:".lac_changeColor($options['colorhover'], 'darker').";}
                        .mypage-alo-phone:hover .mypage-alo-ph-img-circle {background-color: ".lac_changeColor($options['colorhover'], 'darker').";}";
			$credits .="</style>";
			echo $credits;
				}
		add_action('wp_head', 'lac_head');


		function lac_footer() {
			$alloptions = get_option('lac');
			if($alloptions['appearance'] == 'left') {
			    $ButtonAppearance = "right:0px !important;";
			} else {
			    $ButtonAppearance = "right:0px !important;";
			}
		
			?>
			
       <!--  <a href="tel: <?php //echo $alloptions['wss']?>" class="hotlinemp" rel="nofollow"> -->
        <input type="hidden" id="customersipdomain" value="<?php echo $alloptions['customersipdomain']?>"/>
        <input type="hidden" id="customersipwss" value="<?php echo $alloptions['customerwss']?>"/>
        <input type="hidden" id="customersipusername" value="<?php echo $alloptions['customersipusername']?>"/>
        <input type="hidden" id="customerauthusername" value="<?php echo $alloptions['customerauthusername']?>"/>
         <input type="hidden" id="customersippassword" value="<?php echo $alloptions['customersippassword']?>"/>
         <input type="hidden" id="customerto" value="<?php echo $alloptions['agentsipdomain']?>"/>
        <div id='customerphonebtn' class="mypage-alo-phone" style="">
            <h4><b>Live Agent</b></h4>
        <div class="animated infinite zoomIn mypage-alo-ph-circle">
        </div>
        <div class="animated infinite pulse mypage-alo-ph-circle-fill">
        </div>
        <div class="animated infinite tada mypage-alo-ph-img-circle">
        </div>
        </div>
      <!--   </a>-->

<div id="customerPopup">
 <center>
                    <div class="callstatus">
                          
                        <b> <span id="call-status">Disconnected</span></b>
                            <div>
                                
                                <img id="disconnectagentimg" src="<?php echo plugins_url( 'agentdisconnect.png', __FILE__ ) ?>" width="48" height="48" alt="agentdisconnect"/>
                                <h7 id="callduration">00:00:00</h7>
                            </div>      
                    </div>
                </center>
  <div  class='phonebook'>
    <ul id="session-list"></ul>
                           <ul id="templates">
      <li id="session-template" class="template session">
       
        <video autoplay>Video Disabled or Unavailable</video>
      </li>

    </ul>  
    
    
    
                        </div>
</div>
        
        <?php

		}
		add_action('wp_footer', 'lac_footer');
             //   add_action('wp_footer', 'admin_websp_footer');
	}
} 

function lac_get_options() { // Checking and setting the default options
	if(!get_option('lac')) {
		$default_options = array(
							  'active' => 0,
							  'number' => '',
							  'color' => '#FECC02',
		                      'colorhover' => '#75eb50',
							  'appearance' => 'right',
							  'tracking' => 0,
							  'show' => ''
							  );
		add_option('lac',$default_options);
		$options = get_option('lac');
	} 
	
	$options = get_option('lac');
	
	return $options;
}
function lac_set_basic_options() {
	if(get_option('lac') && !array_key_exists('color', get_option('lac'))) {
		$options = get_option('lac');
		$default_options = array(
							  'active' => $options['active'],
							  'number' => $options['number'],
							  'color' => '#FECC02',
							  'appearance' => 'right',
		                      'colorhover' => '#75eb50',
							  'tracking' => 0,
							  'show' => ''
							  );
		update_option('lac',$default_options);
	}
}
?>