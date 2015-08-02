'use strict';

import uuid from 'node-uuid';
import Immutable from 'immutable';
import Promise from 'bluebird';
import _ from 'underscore';

console.log('hello world');
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

const _MY_ID = uuid.v4();

let _peer = new Peer(_MY_ID, {
  host: 'jibunmo-dev.elasticbeanstalk.com',
  port: 80
});

let _getUserMedia = () => {
  return new Promise((resolve, reject) => {
    navigator.getUserMedia({
      video: {
        mandatory: {
          maxWidth: 160,
          maxHeight: 120,
          maxFrameRate: 5
        }
      }
    }, (localStream) => {
      resolve(localStream);
    }, (error) => {
      reject(error);
    })
  })
};

let _setLocalStream = (localStream) => {
  document.getElementById('me')
    .setAttribute('src', URL.createObjectURL(localStream));
};

let _getCalleeID = (peers) => {
  return Immutable.Set(peers)
    .delete(_MY_ID)
    .toJS()[0];
};

let _setRemoteStream = (remoteStream) => {
  document.getElementById('someone')
    .setAttribute('src', URL.createObjectURL(remoteStream));
};
_getUserMedia().then(
  (localStream) => {
    _setLocalStream(localStream);

    console.log('hello getUserMedia');

    let outBoundCall;

    setInterval(() => {
        if (!_.isUndefined(outBoundCall)) {
          outBoundCall.close();
        }

        _peer.listAllPeers((peers) => {
          console.log(peers);
          let calleeId = _getCalleeID(peers);
          console.log(calleeId);

          // todo: think of ways not to send localStream
          // not sending localStream might consume less bandwidth
          outBoundCall = _peer.call(calleeId, localStream);
          console.log(outBoundCall);
          outBoundCall.on('stream', (remoteStream) => {
            _setRemoteStream(remoteStream);
          });
        });
      },
      5000);

    _peer.on('call', (inBoundCall) => {
      inBoundCall.answer(localStream)
    });
  }
);
