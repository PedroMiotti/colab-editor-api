module.exports = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',

  CLIENT_CREATE_ROOM: 'create:room',
  CLIENT_JOIN_ROOM: 'join:room',
  CLIENT_CREATE_FILE: 'create:file',
  CLIENT_JOIN_FILE: 'join:file',
  CLIENT_UPDATE_CODE: 'update:code',
  CLIENT_USER_LEFT: 'user-left:room',

  SERVER_UPDATE_ROOM: 'update:room',
  SERVER_UPDATE_USER: 'update:user',
  SERVER_UPDATE_FILES: 'update:files',
  SERVER_USER_JOINED_FILE: 'user-joined:file',
  SERVER_UPDATE_CODE: 'realtime:code',
  SERVER_USER_LEFT: 'user-left:room'

};
