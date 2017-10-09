import 'babel-polyfill';
import EventEmitter from '../EventEmitter.js';
import chai from 'chai';

const expect = chai.expect;

describe('events', function() {
    const ee = new EventEmitter();
    it('应该返回一个空对象', function() {
        expect(ee.events).to.be.an('object');
    });
});

describe('on(\'click\', listener)', function() {
    const ee = new EventEmitter();
    const listener = () => {};
    ee.on('click', listener);
    describe('on 后执行 events', function() {
        it('应该返回: {click: [{ listener: [Function], once: false }]}', function() {
            const result = {
                click: [{
                    listener: listener,
                    once: false
                }]
            };
            expect(ee.events).to.deep.equal(result);
        });
    });
    describe('on 后执行 getListeners(\'click\')', function() {
        it('应该返回: [{ listener: [Function], once: false }]', function() {
            expect(ee.getListeners('click')).to.deep.equal([{
                listener: listener,
                once: false
            }]);
        });
    });
});


describe('once(\'click\', listener)', function() {
    const ee = new EventEmitter();
    const listener = () => {};
    ee.once('click', listener);
    describe('once 后执行 events', function() {
        it('应该返回：{ click: [{ listener: [Function], once: true }] }', function() {
            const result = {
                click: [{
                    listener: listener,
                    once: true
                }]
            };
            expect(ee.events).to.deep.equal(result);
        });
    });
    describe('once 后执行 getListeners(\'click\')', function() {
        it('应该返回：[{ listener: [Function], once: true }]', function() {
            expect(ee.getListeners('click')).to.deep.equal([{
                listener: listener,
                once: true
            }]);
        });
    });
});


describe('off(\'click\', listener)', function() {
    const ee = new EventEmitter();
    const listener = () => {};
    ee.on('click', listener);
    ee.off('click', listener);
    describe('off 后执行 events', function() {
        it('应该返回：{ click: [] }', function() {
            const result = {
                click: []
            };
            expect(ee.events).to.deep.equal(result);
        });
    });
    describe('off 后执行 getListeners(\'click\')', function() {
        it('应该返回：[]', function() {
            expect(ee.getListeners('click')).to.deep.equal([]);
        });
    });
});

describe('off(\'click\')', function() {
    const ee = new EventEmitter();
    const listener = () => {};
    ee.on('click', listener);
    ee.off('click');

    describe('off 后执行 events', function() {
        it('应该返回：{ click: [] }', function() {
            expect(ee.events).to.deep.equal({click: []});
        });
    });
    describe('off 后执行 getListeners(\'click\')', function() {
        it('应该返回：[]', function() {
            expect(ee.getListeners('click')).to.deep.equal([]);
        });
    });
});

describe('emit(\'click\')', function() {
    const ee = new EventEmitter();
    const listener = () => {};
    ee.on('click', listener);

    describe('emit(\'click\') 前执行 events', function() {
        it('应该返回：{ click: [{ listener: [Function], once: false }] }', function() {
            expect(ee.events).to.deep.equal({
                click: [{
                    listener: listener,
                    once: false
                }]
            });
        });
    });

    ee.emit('click');

    describe('emit(\'click\') 后执行 events', function() {
        it('应该返回：{ click: [{ listener: [Function], once: false }] }', function() {
            expect(ee.events).to.deep.equal({
                click: [{
                    listener: listener,
                    once: false
                }]
            });
        });
    });
});

describe('emit(\'clickOnce\')', function() {
    const ee = new EventEmitter();
    const listener = () => {};
    ee.once('clickOnce', listener);

    describe('emit(\'clickOnce\') 前执行 events', function() {
        it('应该返回：{ clickOnce: [{ listener: [Function], once: true }] }', function() {
            expect(ee.events).to.deep.equal({
                clickOnce: [{
                    listener: listener,
                    once: true
                }]
            });
            ee.emit('clickOnce');
        });
    });

    describe('emit(\'clickOnce\') 后执行 events', function() {
        it('应该返回：{ clickOnce: [] }', function() {
            ee.emit('clickOnce');
            expect(ee.events).to.deep.equal({
                clickOnce: []
            });
        });
    });
});

describe(`addListeners('click, [listener1, listener2]')`, function () {
    const ee = new EventEmitter();
    const listener1 = () => {};
    const listener2 = () => {};
    ee.addListeners('click', [listener1, listener2]);
    it('应该返回：{ click: [{ listener: listener2, once: false }, { listener: listener1, once: false }] }', function () {
        expect(ee.events).to.deep.equal({
            click: [
                {
                    listener: listener2,
                    once: false
                },
                {
                    listener: listener1,
                    once: false
                }
            ]
        });
    });
});

describe(`removeListeners('click, [listener2]')`, function () {
    const ee = new EventEmitter();
    const listener1 = () => {};
    const listener2 = () => {};
    ee.addListeners('click', [listener1, listener2]);
    ee.removeListeners('click', [listener1]);
    it('应该返回：{ click: [{ listener: listener2, once: false }] }', function () {
        expect(ee.events).to.deep.equal({
            click: [
                {
                    listener: listener2,
                    once: false
                }
            ]
        });
    });
});

describe(`manipulateListeners`, function () {
    describe(`manipulateListeners(false, { 'click': [listener1, listener2] })`, function () {
        const ee = new EventEmitter();
        const listener1 = () => {};
        const listener2 = () => {};
        ee.manipulateListeners(false, { click: [listener1, listener2] });

        it(`应该返回：{ click: [{ listener: listener2, once: false }, { listener: listener1, once: false }] }`, function () {
            expect(ee.events).to.deep.equal({
                click: [
                    {
                        listener: listener2,
                        once: false
                    },
                    {
                        listener: listener1,
                        once: false
                    }
                ]
            });
        });
    });
    describe(`manipulateListeners(true, { 'click': [listener1] })`, function () {
        const ee = new EventEmitter();
        const listener1 = () => {};
        const listener2 = () => {};
        ee.manipulateListeners(false, { click: [listener1, listener2] });
        ee.manipulateListeners(true, { click: [listener1, listener2] });

        it(`应该返回：{ click: [] }`, function () {
            expect(ee.events).to.deep.equal({
                click: []
            });
        });
    });
});
