const socket = io('/');
const myPeer = new Peer(undefined, {
    host: 'localhost',
      port: 3100,
      path: '/'
}); 

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})

socket.on('user-connected', (userId) => {
    console.log(`User ${userId} connected`);
});
