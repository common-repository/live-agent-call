jQuery(function($) {
var elements = {
  configForm:      document.getElementById('config-form'),
  uaStatus:        document.getElementById('call-status'),
  registerButton:  document.getElementById('ua-register'),
  newSessionForm:  document.getElementById('new-session-form'),
  inviteButton:    document.getElementById('customerphonebtn'),
  messageButton:   document.getElementById('ua-message-submit'),
  uaVideo:         document.getElementById('ua-video'),
  uaURI:           document.getElementById('ua-uri'),
  sessionList:     document.getElementById('session-list'),
  disconnectagent:  document.getElementById('disconnectagentimg'),
  sessionTemplate: document.getElementById('session-template'),
  messageTemplate: document.getElementById('message-template')
};
var config = {
  userAgentString: 'SIP.js/0.7.0 BB',
  traceSip: true,
  register: true
};

var callduration = document.getElementById('callduration');
var seconds = 0, minutes = 0, hours = 0,t;
var ua;
var sessionUIs = {};
   
   display_name = $('#customersipusername').val();
//$('#ext').text("Extension:"+display_name);
    //        sip_uri = "sip:"+$('#extension').val() +$('#sipdomain').val();


     		 sip_uri = $('#customersipdomain').val();
            sip_password = $('#customersippassword').val();
            ws_servers = $('#customersipwss').val();
     
  //   display_name ="kashif";
 //    sip_uri = "kashif@home12.onsip.com";
    // sip_password = "ctrDjcgN6fntJv5W";
    // ws_servers = "wss://edge.sip.onsip.com";
     
     
     
   // alert(sip_uri);
    
    config['displayName'] = display_name;
    config['uri'] = sip_uri;
    config['authorizationUser'] = $('#customerauthusername').val();
   // config['authorizationUser'] = "home12_kashif";
    config['password'] = sip_password;
    config['wsServers'] = ws_servers; 

 
  ua = new SIP.UA(config);

  ua.on('connected', function () {
   
  });

  ua.on('registered', function () {

  });

  ua.on('unregistered', function () {

  });



  ua.on('invite', function (session) {
$(".session").remove();
//document.getElementById('numberexist').style.display = 'none';
//document.getElementById('nonumber').style.display = 'none';
document.getElementById('customerPopup').style.display = 'block';
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
function inviteSubmit(e) {
  e.preventDefault();
  e.stopPropagation();

  // Parse config options
 // var video = elements.uaVideo.checked;
 // var uri = elements.uaURI.value;
 var uri = $('#customerto').val();
 // elements.uaURI.value = '';
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
  sessionUI.uri            = node.querySelector('.uri');
  sessionUI.video          = node.querySelector('video');
  sessionUI.renderHint     = {
    remote: sessionUI.video
  };

  sessionUIs[uri] = sessionUI;

  // Update template
  node.classList.remove('template');
 // sessionUI.displayName.textContent = displayName || uri.user;
//  sessionUI.uri.textContent = '<' + uri + '>';

  

  // Initial DOM state
  if (session && !session.accept) {
 
  } else if (!session) {

  } else {

  }

elements.disconnectagent.addEventListener('click', function () {
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



  // SIP.js event listeners
  function setUpListeners(session) {
 elements.uaStatus.innerHTML = 'Connecting...';
 callduration.textContent = "00:00:00";
 seconds = 0; minutes = 0; hours = 0;
    if (session.accept) {
    } else {
    }

    session.on('accepted', function () {
      sessionUI.video.className = 'on';
      elements.uaStatus.innerHTML = 'Connected...';
      timer();
      
      session.mediaHandler.render(sessionUI.renderHint);
    });

    session.mediaHandler.on('addStream', function () {
      session.mediaHandler.render(sessionUI.renderHint);
    });

    session.on('bye', function () {
      sessionUI.video.className = '';
       elements.uaStatus.innerHTML = 'disconnected...';
      delete sessionUI.session;
      clearTimeout(t);
    });

    session.on('failed', function () {
      sessionUI.video.className = '';
       elements.uaStatus.innerHTML = 'failed...';
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
 
  elements.sessionList.appendChild(node);
}


function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    
    callduration.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}
function timer() {
    t = setTimeout(add, 1000);
}

});