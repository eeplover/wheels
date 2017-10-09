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
        }
        return -1;
    }

    static isValidListener(listener) {
        if (typeof listener === 'function') {
            return true;
        }
        else if (typeof listener === 'object') {
            return EventEmitter.isValidListener(listener.listener);
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
            // listenerAsObject = listener.listener;
            listeners.push(listenerIsWrapped ? listener : {
                listener: listener,
                once: false
            });
        }
        return this;
    }

    addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    }

    removeListener(evt, listener) {
        let listeners = this.getListeners(evt);
        if (!listener) {
            listeners.length = 0;
        }
        else if (EventEmitter.indexOfListener(listeners, listener) !== -1) {
            for (let i = 0; i < listeners.length; i++) {
                if (listeners[i].listener === listener) {
                    return listeners.splice(i, 1);
                }
            }
        }
        return this;
    }

    addListeners(evt, listeners) {
        return this.manipulateListeners(false, evt, listeners);
    }

    removeListeners(evt, listeners) {
        return this.manipulateListeners(true, evt, listeners);
    }

    manipulateListeners(remove, evt, listeners) {
        let i;
        let value;
        let single = remove ? this.removeListener : this.addListener;
        let multiple = remove ? this.removeListeners : this.addListeners;
        if (typeof evt === 'object') {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    if (Array.isArray(value)) {
                        multiple.call(this, i, value);
                    }
                    else {
                        single.call(this, i, value);
                    }
                }
            }
        }
        else {
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }
        return this;
    }

    emitEvent(evt, ...args) {
        const listeners = this.getListeners(evt);
        // const args = [].slice.call(arguments, 1);
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            if (listener.once) {
                this.removeListener(evt, listener.listener);
            }
            listener.listener(...args.slice(1));
        }
        return this;
    }

    on(...args) {
        return this.addListener(...args);
    }

    once(...args) {
        return this.addOnceListener(...args);
    }

    off(...args) {
        return this.removeListener(...args);
    }

    emit(...args) {
        return this.emitEvent(...args);
    }

}

export default EventEmitter;
