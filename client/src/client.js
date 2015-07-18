'use strict';

console.log('hello world');
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// todo: get uuid
const MY_ID = '1';

let peer = new Peer(MY_ID, {
  host: 'jibunmo-dev.elasticbeanstalk.com',
  port: 80
});

navigator.getUserMedia({video: true, audio: false}, (localStream) => {
  // todo: display localStream

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
