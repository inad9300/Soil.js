/// <reference types="intern" />

const {suite, test} = intern.getInterface('tdd')
const {assert} = intern.getPlugin('chai')

import {createElement} from '../testing/createElement'
import {h} from './h'
import {s} from './s'
import {assignProps} from './assignProps'

suite('assignProps()', () => {

    test('properties of various kinds', () => {
        function fun() {}

        const div = createElement('<div></div>') as h.Div
        assignProps(div, {
            id: 'i',
            className: 'c',
            title: 't',
            style: {
                color: 'black',
                backgroundColor: 'green'
            },
            onclick: fun,
            contentEditable: 'true',
            tabIndex: 8,
            'aria-label': 'blah blah blah'
        })

        assert.strictEqual(div.id, 'i')
        assert.strictEqual(div.getAttribute('id'), 'i')

        assert.strictEqual(div.className, 'c')
        assert.strictEqual(div.getAttribute('class'), 'c')

        assert.strictEqual(div.title, 't')
        assert.strictEqual(div.getAttribute('title'), 't')

        assert.strictEqual(div.style.color, 'black')
        assert.strictEqual(div.style.backgroundColor, 'green')
        assert.strictEqual(div.getAttribute('style'), 'color: black; background-color: green;')

        assert.strictEqual(div.onclick, fun)
        assert.strictEqual(div.getAttribute('onclick'), null)

        assert.strictEqual(div.isContentEditable, true)
        assert.strictEqual(div.contentEditable, 'true')
        assert.strictEqual(div.getAttribute('contenteditable'), 'true')

        assert.strictEqual(div.tabIndex, 8)
        assert.strictEqual(div.getAttribute('tabindex'), '8')

        assert.strictEqual(div.getAttribute('aria-label'), 'blah blah blah')
    })

    test('nested SVG properties', () => {
        const circle = createElement(`<circle />`, true) as s.Circle
        assignProps(circle, {
            cx: {baseVal: {value: 50}},
            cy: {baseVal: {value: 50}},
            r: {baseVal: {value: 40}},
            style: {
                stroke: 'green',
                strokeWidth: '4px',
                fill: 'yellow'
            }
        })

        assert.strictEqual(circle.cx.baseVal.value, 50)
        assert.strictEqual(circle.cy.baseVal.value, 50)
        assert.strictEqual(circle.r.baseVal.value, 40)
        assert.strictEqual(circle.style.stroke, 'green')
        assert.strictEqual(circle.style.strokeWidth, '4px')
        assert.strictEqual(circle.style.fill, 'yellow')
    })

    test('nested object properties not present in target', () => {
        const target = {o1: {}}
        const source = {o1: {o2: {x: 3}}}

        assignProps(target as any, source)

        assert.strictEqual((target as any).o1.o2.x, 3)
    })
})
