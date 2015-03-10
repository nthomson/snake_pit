module.exports = {
    Game: require('./game'),
    Snake: require('./snake'),
    KeyboardControllable: require('./mixins/keyboard_controllable'),
    SocketControllable: require('./mixins/socket_controllable'),
    Controllable: require('./mixins/controllable')
};
