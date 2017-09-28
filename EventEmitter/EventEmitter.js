class EventEmitter {
    constructor() {
        this.events = {};
    }

    static indexOfListener(listeners, listener) {
        let i = listeners.length;
        listener = typeof listener === 'object' ? listener.listener : listener;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
            else ()
        }
        return -1;
    }

    static isValidListener(listener) {
        if (typeof listener === 'function') {
            return true;
        }
        else if (typeof listener === 'object') {
            return isValidListener(listener.listener);
        }
        else {
            return false;
        }
    }

    getListeners(evt) {
        let events = this.events;
        let listeners;
        if (evt instanceof RegExp) {
            // TODO
        }
        else {
            listeners = events[evt] || (events[evt] = [])
        }
        return listeners;
    }

    addListener(evt, listener) {
        if (!EventEmitter.isValidListener(listener)) {
            throw new TypeError('listener 必须是一个函数');
        }
        const listeners = this.getListeners(evt);
        const listenerIsWrapped = typeof listener === 'object';
        if (EventEmitter.indexOfListener(listeners, listener) === -1) {
            listenerAsObject = listener.listener;
            listeners.push(listenerIsWrapped ? listener : {
                listener: listener,
                once: false
            });
        }
        return this;
    }

    addOnceListener(evt, listener) {
        this.addListener(evt, {
            listener: listener,
            once: true
        });
    }

    removeListener(evt, listener) {
        let listeners = this.getListeners(evt);
        listener = typeof listener === 'object' ? listener.listener : listener;
        if (!listener) {
            this.events[evt] = listeners.splice(0, listeners.length);
        }
        else if (EventEmitter.indexOfListener(listener) !== -1) {
            for (let i = 0; i < listeners.length; i++) {
                if (listeners[i].listener === listener) {
                    return listeners.splice(i, 1);
                }
            }
        }
    }

    emitEvent(evt) {
        const listeners = this.getListeners(evt);
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            listener.listener();
            if (listener.once) {
                this.removeListener(evt, listener.listener);
            }
        }
    }

    on() {
        this.addListener(...arguments);
    }

    once() {
        this.addOnceListener(...arguments);
    }

    off() {
        this.removeListener(...arguments);
    }

    emit() {
        this.emitEvent(...arguments);
    }

}

export default EventEmitter;
