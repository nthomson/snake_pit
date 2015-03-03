module.exports = {
    Game: require('./snake_pit/game'),
    Snake: require('./snake_pit/snake'),
    KeyboardControllable: require('./snake_pit/mixins/keyboard_controllable'),
    SocketControllable: require('./snake_pit/mixins/socket_controllable')
};
