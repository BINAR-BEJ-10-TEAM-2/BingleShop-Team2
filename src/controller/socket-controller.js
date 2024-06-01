const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY } = process.env;

let connectedAdmins = [];
const connectedUsers = {};
let standByCostumers = []; //

const setup = (io) => {
  //middleware for authorization
  io.use((socket, next) => {
    //using token for authorization
    const token = socket.handshake.headers.authorization;
    if (token === undefined) {
      return io.close();
    }

    //add user information to socket instance
    const user = jwt.verify(token, JWT_SECRET_KEY);
    socket.handshake.user = user;

    //store costumer socket information with key-value format
    if (!user.is_admin) {
      connectedUsers[user.user_id] = socket;
    }

    //store admin socket information to array
    if (user.is_admin) {
      connectedAdmins.push(socket);
    }

    //send message to connected client when admin available
    if (standByCostumers.length > 0) {
      standByCostumers.forEach((userId) => connectedUsers[userId].emit('chat-user', { message: 'admin join chat!' }));
    }
    next();
  });

  io.on('connection', (socket) => {
    //event from client to send message to admin
    socket.on('chat-admin', (data) => {
      //if theres no admin subscribe to the event
      if (connectedAdmins.length < 1) {
        standByCostumers = standByCostumers.filter((id) => id !== socket.handshake.user.id);
        standByCostumers.push(socket.handshake.user.id);
        return socket.emit('chat-user', { message: 'There is no admin online, wait for a while...' });
      }
      while (standByCostumers.length > 0) {
        standByCostumers.pop();
      }

      //send message to connected admin
      connectedAdmins.forEach((sc) => sc.emit('chat-admin', { user_id: socket.handshake.user.id, message: data.message }));
    });

    //event listener for send message to costumer
    socket.on('chat-user', (data) => {
      const { to, message } = data;

      //send message base on user_id
      if (connectedUsers[to]) {
        connectedUsers[to].emit('chat-user', { message });
      }
    });

    socket.on('disconnect', () => {
      if (!socket.handshake.user.is_admin) {
        //remove disconnected socket from memory
        delete connectedUsers[socket.handshake.user.id];

        //send message to admin connected when costumer terminate connection
        connectedAdmins.forEach(() => socket.emit('chat-admin', { messages: `costumer with id: ${socket.handshake.user.id} leave chat!` }));
      }

      if (socket.handshake.user.is_admin) {
        //remove disconnected socket from memory
        connectedAdmins = connectedAdmins.filter((admin) => admin.id === socket.handshake.user.id);
      }
    });
  });
};

module.exports = { setup };
