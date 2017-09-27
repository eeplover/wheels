import 'babel-polyfill';
import EventEmitter from '../EventEmitter.js';
import chai from 'chai';

const ee = new EventEmitter();
const expect = chai.expect;

describe('_getEvents方法测试', function() {
    it('应该返回一个对象', function() {
        expect(ee._getEvents()).to.be.an('object');
    });
});

// describe('getListeners方法测试', function() {
//     it('应该返回一个数组', function() {
//         expect(ee.getListeners()).to.be.an('array');
//     });
// });

// describe('isValidListener', function() {
//     it('isValidListener(function () {})应该返回true', function() {
//         expect(ee.isValidListener(function () {})).to.be.true;
//     });
//     it('isValidListener(undefined)应该返回false', function() {
//         expect(ee.isValidListener(undefined)).to.be.false;
//     });
// });

describe('addEventListener方法测试', function() {
    const l = () => {};
    ee.addEventListener('click', l);
    describe('_getEvents方法测试', function() {
        it('应该返回一个事件集对象', function() {
            const result = {
                click: [{
                    listener: l,
                    once: false
                }]
            };
            console.log(result);
            console.log(ee._getEvents());
            expect(ee._getEvents()).to.deep.equal(result);
        });
    });
    describe('getListeners方法测试', function() {
        it('应该返回一个click事件对象', function() {
            expect(ee.getListeners('click')).to.deep.equal([{
                listener: l,
                once: false
            }]);
        });
        it('应该返回一个空数组', function() {
            expect(ee.getListeners()).to.be.an('array');
        });
    });

});
