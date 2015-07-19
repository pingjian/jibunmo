'use strict';

import uuid from 'node-uuid';
import Immutable from 'immutable';
import Promise from 'bluebird';

console.log('hello world');
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// todo: get uuid
const MY_ID = uuid.v4();

let peer = new Peer(MY_ID, {
  host: 'jibunmo-dev.elasticbeanstalk.com',
  port: 80
});

let getUserMedia = () => {
  return new Promise((resolve, reject) => {
    navigator.getUserMedia({video: true, audio: false}, (localStream) => {
      resolve(localStream);
    }, (error) => {
      reject(error);
    })
  })
};

getUserMedia().then(
  (localStream) => {
    document.getElementById('me')
      .setAttribute('src', URL.createObjectURL(localStream));

    console.log('hello getUserMedia');
    peer.listAllPeers(
      (peers) => {
        console.log(peers);
        let calleeId = Immutable.Set(peers)
          .delete(MY_ID)
          .toJS()[0];
        console.log(calleeId);

        // todo: think of ways not to send localStream
        // not sending localStream might consume less bandwidth
        let outBoundCall = peer.call(calleeId, localStream);
        console.log(outBoundCall);
        outBoundCall.on('stream', (remoteStream) => {
          // todo: display remoteStream
        });
      }
    );

    peer.on('call', (inBoundCall) => {
      inBoundCall.answer(localStream)
    });
  }
);
