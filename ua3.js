jQuery(function($) {
var elements = {
  configForm:      document.getElementById('config-form'),
  uaStatus:        document.getElementById('ua-status'),
  registerButton:  document.getElementById('ua-register'),
  newSessionForm:  document.getElementById('new-session-form'),
  inviteButton:    document.getElementById('ua-invite-submit'),
  messageButton:   document.getElementById('ua-message-submit'),
  uaVideo:         document.getElementById('ua-video'),
  uaHold:           document.getElementById('hold'),
  uaURI:           document.getElementById('ua-uri'),
  sessionList:     document.getElementById('session-list'),
  sessionTemplate: document.getElementById('session-template'),
  messageTemplate: document.getElementById('message-template')
};
var config = {
  userAgentString: 'SIP.js/0.7.0 BB',
  traceSip: true,
  register: true
};

var ua;
var sessionUIs = {};

//elements.configForm.addEventListener('submit', function (e) {
//  var form, i, l, name, value;
//  e.preventDefault();
//
//  form = elements.configForm;
//
//  for (i = 0, l = form.length; i < l; i++) {
//    name = form[i].name;
//    value = form[i].value;
//    if (name !== 'configSubmit' && value !== '') {
//      config[name] = value;
//    }
//  }


   

   display_name = $('#agentsipusername').val();
//$('#ext').text("Extension:"+display_name);
    //        sip_uri = "sip:"+$('#extension').val() +$('#sipdomain').val();


     		 sip_uri = $('#agentsipdomain').val();
            sip_password = $('#agentsippassword').val();
            ws_servers = $('#agentsipwss').val();
     
  //   display_name ="kashif";
 //    sip_uri = "kashif@home12.onsip.com";
    // sip_password = "ctrDjcgN6fntJv5W";
    // ws_servers = "wss://edge.sip.onsip.com";
     
     
     
   // alert(sip_uri);
    
    config['displayName'] = display_name;
    config['uri'] = sip_uri;
    config['authorizationUser'] = $('#agentauthusername').val();
   // config['authorizationUser'] = "home12_kashif";
    config['password'] = sip_password;
    config['wsServers'] = ws_servers; 

  elements.uaStatus.innerHTML = 'Connecting...';

  ua = new SIP.UA(config);

  ua.on('connected', function () {
    elements.uaStatus.innerHTML = 'Connected (Unregistered)';
  });

  ua.on('registered', function () {
    elements.registerButton.innerHTML = 'Unregister';
    elements.uaStatus.innerHTML = 'Connected (Registered)';
  });

  ua.on('unregistered', function () {
    elements.registerButton.innerHTML = 'Register';
    elements.uaStatus.innerHTML = 'Connected (Unregistered)';
  });



  ua.on('invite', function (session) {
$(".session").remove();
//document.getElementById('numberexist').style.display = 'none';
//document.getElementById('nonumber').style.display = 'none';
document.getElementById('toPopup').style.display = 'block';
//alert(session.remoteIdentity.displayName);
//alert("sip:102@master.gofusion1.com".split('@')[0].split(':')[1]);


    createNewSessionUI(session.remoteIdentity.uri, session);
  });

  ua.on('message', function (message) {
    if (!sessionUIs[message.remoteIdentity.uri]) {
      createNewSessionUI(message.remoteIdentity.uri, null, message);
    }
  });

  document.body.className = 'started';
//}, false);

elements.registerButton.addEventListener('click', function () {
  if (!ua) return;

  if (ua.isRegistered()) {
    ua.unregister();
  } else {
    ua.register();
  }
}, false);

function inviteSubmit(e) {
  e.preventDefault();
  e.stopPropagation();

  // Parse config options
 // var video = elements.uaVideo.checked;
  var uri = elements.uaURI.value;
  elements.uaURI.value = '';
$(".session").remove();
//alert($("#session-list").length);
  if (!uri) return;

  // Send invite
  var session = ua.invite(uri, {
    media: {
      constraints: {
        audio: true,
        video: false
      }
    }
  });

  // Create new Session and append it to list
  var ui = createNewSessionUI(uri, session);
}

elements.inviteButton.addEventListener('click', inviteSubmit, false);
//elements.newSessionForm.addEventListener('submit', inviteSubmit, false);

//elements.messageButton.addEventListener('click', function (e) {
//  e.preventDefault();
//  e.stopPropagation();
//
//  // Create new Session and append it to list
//  var uri = elements.uaURI.value;
//  elements.uaURI.value = '';
//  var ui = createNewSessionUI(uri);
//}, false);

function createNewSessionUI(uri, session, message) {
  var tpl = elements.sessionTemplate;
  var node = tpl.cloneNode(true);
  var sessionUI = {};
  var messageNode;

  uri = session ?
    session.remoteIdentity.uri :
    SIP.Utils.normalizeTarget(uri, ua.configuration.hostport_params);
  var displayName = (session && session.remoteIdentity.displayName) || uri.user;

  if (!uri) { return; }

  // Save a bunch of data on the sessionUI for later access
  sessionUI.session        = session;
  sessionUI.node           = node;
  sessionUI.displayName    = node.querySelector('.display-name');
  sessionUI.uri            = node.querySelector('.uri');
  sessionUI.green          = node.querySelector('.green');
  sessionUI.red            = node.querySelector('.red');
  sessionUI.dtmf           = node.querySelector('.dtmf');
  sessionUI.Hold           = node.querySelector('.Hold');
 sessionUI.Transfer           = node.querySelector('.Transfer');
  sessionUI.dtmfInput      = node.querySelector('.dtmf input[type="text"]');
  sessionUI.video          = node.querySelector('video');
  sessionUI.messages       = node.querySelector('.messages');
  sessionUI.messageForm    = node.querySelector('.message-form');
  sessionUI.messageInput   = node.querySelector('.message-form input[type="text"]');
  sessionUI.renderHint     = {
    remote: sessionUI.video
  };

  sessionUIs[uri] = sessionUI;

  // Update template
  node.classList.remove('template');
  sessionUI.displayName.textContent = displayName || uri.user;
  sessionUI.uri.textContent = '<' + uri + '>';

  // DOM event listeners
  sessionUI.green.addEventListener('click', function () {
   // var video = elements.uaVideo.checked;
    var options = {
      media: {
        constraints: {
          audio: true,
          video: false
        }
      }
    };

    var session = sessionUI.session;
    if (!session) {
      /* TODO - Invite new session */
      /* Don't forget to enable buttons */
      session = sessionUI.session = ua.invite(uri, options);

      setUpListeners(session);
    } else if (session.accept && !session.startTime) { // Incoming, not connected
stopRingTone();
      session.accept(options);
    }

  }, false);

  sessionUI.red.addEventListener('click', function () {
    var session = sessionUI.session;
    if (!session) {
      return;
    } else if (session.startTime) { // Connected
      session.bye();
    } else if (session.reject) { // Incoming
      session.reject();
    } else if (session.cancel) { // Outbound
      session.cancel();
    }
  }, false);


 sessionUI.Hold.addEventListener('click', function () {
    //  e.preventDefault();
    var session = sessionUI.session;
  //  alert(elements.uaHold.value);
if (document.getElementById('hold').innerHTML ==='Hold')
{
     document.getElementById('hold').innerHTML='UnHold';
 session.hold();

}
 else
 {
      document.getElementById('hold').innerHTML='Hold';
session.unhold();
 
 }
  }, false); 

 sessionUI.Transfer.addEventListener('click', function () {
    //  e.preventDefault();
    var session = sessionUI.session; 
     var clinumber = prompt("Please Enter Extension", "");                        
  if (clinumber)
{
     //  var target = 'bb@officesip.local';
        session.refer(clinumber); 
}

  }, false); 

  sessionUI.dtmf.addEventListener('submit', function (e) {
    e.preventDefault();

    var value = sessionUI.dtmfInput.value;
    if (value === '' || !session) return;

    sessionUI.dtmfInput.value = '';

    if (['0','1','2','3','4','5','6','7','8','9','*','#'].indexOf(value) > -1) {
      session.dtmf(value);
    }
  });

  // Initial DOM state
  if (session && !session.accept) {
    sessionUI.green.disabled = true;
    sessionUI.green.innerHTML = '...';
    sessionUI.red.innerHTML = 'Cancel';
  } else if (!session) {
    sessionUI.red.disabled = true;
    sessionUI.green.innerHTML = 'Invite';
    sessionUI.red.innerHTML = '...';
  } else {
    sessionUI.green.innerHTML = 'Accept';
    sessionUI.red.innerHTML = 'Reject';
  }
  sessionUI.dtmfInput.disabled = true;

  // SIP.js event listeners
  function setUpListeners(session) {
    sessionUI.red.disabled = false;

    if (session.accept) {
	 startRingTone();
      sessionUI.green.disabled = false;
      sessionUI.green.innerHTML = 'Accept';
      sessionUI.red.innerHTML = 'Reject';
    } else {
      sessionUI.green.innerHMTL = '...';
      sessionUI.red.innerHTML = 'Cancel';
    }

    session.on('accepted', function () {
      stopRingTone();
      sessionUI.green.disabled = true;
      sessionUI.green.innerHTML = '...';
      sessionUI.red.innerHTML = 'Bye';
      sessionUI.dtmfInput.disabled = false;
      sessionUI.video.className = 'on';

      session.mediaHandler.render(sessionUI.renderHint);
    });

    session.mediaHandler.on('addStream', function () {
      session.mediaHandler.render(sessionUI.renderHint);
    });

    session.on('bye', function () {
stopRingTone();
      sessionUI.green.disabled = false;
      sessionUI.red.disabled = true;
      sessionUI.dtmfInput.disable = true;
      sessionUI.green.innerHTML = 'Invite';
      sessionUI.red.innerHTML = '...';
      sessionUI.video.className = '';
      delete sessionUI.session;
    });

    session.on('failed', function () {
      sessionUI.green.disabled = false;
      sessionUI.red.disabled = true;
      sessionUI.dtmfInput.disable = true;
      sessionUI.green.innerHTML = 'Invite';
      sessionUI.red.innerHTML = '...';
      sessionUI.video.className = '';
      delete sessionUI.session;
    });

    session.on('refer', function handleRefer (request) {
      var target = request.parseHeader('refer-to').uri;
      session.bye();

      createNewSessionUI(target, ua.invite(target, {
        media: {
          constraints: {
            audio: true,
            video: false
          }
        }
      }));
    });
  }

  if (session) {
    setUpListeners(session);

  }

  // Messages
//  function appendMessage(body, className) {
//    messageNode = document.createElement('li');
//    messageNode.className = className;
//    messageNode.textContent = body;
//    sessionUI.messages.appendChild(messageNode);
//    sessionUI.messages.scrollTop = sessionUI.messages.scrollHeight;
//  }
//  if (message) {
//    appendMessage(message.body, 'remote');
//  }
//
//  ua.on('message', function (message) {
//    if (message.remoteIdentity.uri !== uri) {
//      console.warn('unmatched message: ', message.remoteIdentity.uri, uri);
//    }
//
//    appendMessage(message.body, 'remote');
//  });
//
//  sessionUI.messageForm.addEventListener('submit', function (e) {
//    e.preventDefault();
//
//    var body = sessionUI.messageInput.value;
//    sessionUI.messageInput.value = '';
//
//    ua.message(uri, body).on('failed', function (response, cause) {
//      appendMessage('Error sending message: ' + (cause || 'Unknown Error'), 'error');
//    });
//
//    appendMessage(body, 'local');
//  }, false);

  // Add node to live session list
//  elements.sessionList.clear();
 
  elements.sessionList.appendChild(node);
//elements.sessionList.removeChild( elements.sessionList.firstChild);
 //   elements.sessionList.innerHTML = node;
}

function startRingTone() {
            try { ringtone.play(); }
            catch (e) { }
        }

        function stopRingTone() {
            try { ringtone.pause(); }
            catch (e) { }
        }


});