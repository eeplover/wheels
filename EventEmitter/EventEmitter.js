const EventEmitter = () => {};
const proto = EventEmitter.prototype;
const indexOfListener = (listeners, listener) => {
    let i = listeners.length;

    while (i--) {
        if (listeners[i].listener === listener) {
            return i;
        }
    }

    return -1;
};

proto._getEvents = function () {
    this._events = this._events || {};
    return this._events;
};

proto.getListeners = function (evt) {
    const evts = this._getEvents();
    evts[evt] = evts[evt] || [];
    return evts[evt];
};

function isValidListener(listener) {
    return typeof listener === 'function';
};

proto.addEventListener = function (evt, listener) {
    if (!isValidListener(listener)) {
        throw new TypeError('事件监听器类型错误。');
    }
    const listeners = this.getListeners(evt);
    const index = indexOfListener(listeners, listener);
    if (index === -1) {
        listeners.push({
            listener: listener,
            once: false
        });
        return true;
    }
    return false;
};

proto.addOnceEventListener = function (evt, listener) {
    if (!isValidListener(listener)) {
        throw new TypeError('事件监听器类型错误。');
    }
    const listeners = this.getListeners(evt);
    const index = indexOfListener(listeners, listener);
    if (index === -1) {
        listeners.push({
            listener: listener,
            once: true
        });
        return true;
    }
    return false;
};

proto.removeEventListener = (evt, listener) => {
    const listeners = this.getListeners(evt);
    if (isValidListener(listener)) {
        for (let i = 0; i < listeners.length; i++) {
            if (listeners[i].listener === listener) {
                return listeners.splice(i, 1);
            }
        }
    }
    else if (typeof listener === undefined) {
        const evts = this._getEvents(evt);
        evts[evt] = [];
    }
};

proto.emitEvent = function (evt) {
    const listeners = this.getListeners(evt);
    for (let i = 0; i < listeners.length; i++) {
        const listener = listeners[i];
        listener.listener();
        if (listener.once) {
            listeners.splice(i, 1);
        }
    }
};


function alias(name) {
    return function () {
        return this[name].apply(this, arguments);
    };
}

proto.on = alias('addEventListener');
proto.once = alias('addOnceEventListener');
proto.off = alias('removeEventListener');
proto.emit = alias('emitEvent');

export default EventEmitter;
