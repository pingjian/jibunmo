'use strict';

import uuid from 'node-uuid';

console.log('hello world');
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// todo: get uuid
const MY_ID = uuid.v4();

let peer = new Peer(MY_ID, {
  host: 'jibunmo-dev.elasticbeanstalk.com',
  port: 80
});

navigator.getUserMedia({video: true, audio: false}, (localStream) => {
  document.getElementById('me')
    .setAttribute('src', URL.createObjectURL(localStream));

  console.log('hello getUserMedia');
  // todo: get it from PeerServer
  let calleeId = '1';
  let outBoundCall = peer.call(calleeId);

  outBoundCall.on('stream', (remoteStream) => {
    // todo: display remoteStream
  });

  peer.on('call', (inBoundCall) => {
    inBoundCall.answer(localStream)
  });

}, (err) => {
});
