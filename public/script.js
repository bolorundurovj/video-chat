const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myPeer = new Peer(undefined, {
  host: 'localhost',
  port: 3100,
  path: '/',
});

const myVideo = document.createElement('video');
myVideo.muted = true;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);

    myPeer.on('call', (call) => {
      console.log('call');
      call.answer(stream);
      const vid = document.createElement('video');

      call.on('stream', (userVideoStream) => {
        addVideoStream(vid, userVideoStream);
      });
    });

    socket.on('user-connected', (userId) => {
      connectToNewUser(userId, stream);
    });
  });

myPeer.on('open', (id) => {
  console.log('open');
  socket.emit('join-room', ROOM_ID, id);
});

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
}

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement('video');

  call.on('stream', (userVideoStream) => {
    console.log('stream');
    addVideoStream(video, userVideoStream);
  });
  call.on('close', () => {
    console.log('close');
    video.remove();
  });
}
