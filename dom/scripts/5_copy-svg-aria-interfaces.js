// Source: https://www.w3.org/TR/SVG2/attindex.html.
// Target: ../src/BuiltTimeDom.ts.

const firstsUp = (str, count) => str.slice(0, count).toUpperCase() + str.slice(count)

const getInterface = tag => {
    for (let i = 0; i < tag.length; ++i) {
        let iface = 'SVG' + firstsUp(tag, i + 1) + 'Element'
        try {
            eval(iface)
            return iface
        } catch (e) {}
    }
}

// Map from SVG interface to the ARIA attributes accepted by the respective element.
const svgAriaAttrs = {}
const unknownElems = []

Array
    .from(document.querySelector('.attrtable tbody').rows)
    .forEach(row => {
        const [attrCell, elemsCell] = row.cells
        const attrName = attrCell.querySelector('.attr-name').textContent.trim()
        if (!attrName.startsWith('aria-') && attrName !== 'role') {
            return
        }
        Array
            .from(elemsCell.querySelectorAll('.element-name'))
            .map(el => el.textContent.trim())
            .forEach(tag => {
                const iface = getInterface(tag)
                if (!iface) {
                    unknownElems.push(tag)
                    return
                }
                if (svgAriaAttrs[iface]) {
                    svgAriaAttrs[iface].push(attrName)
                } else {
                    svgAriaAttrs[iface] = [attrName]
                }
            })
    })

console.warn(
    'Elements for which no interface was found in the current browser:',
    unknownElems
        .filter((val, idx, arr) => arr.indexOf(val) === idx)
        .sort()
        .join(', ')
        + '.'
)

const htmlAriaAttributesCount = 49

copy(
`/// Script-generated.

export namespace BuiltTimeDom {

` +
    Object.keys(svgAriaAttrs).map(iface =>
        svgAriaAttrs[iface].length === htmlAriaAttributesCount
            ? `export interface ${iface} extends AriaAttributes {}`
            : `export interface ${iface} {\n` +
                  svgAriaAttrs[iface]
                      .map(attr => attr === 'role'
                          ? '    role?: AriaRole'
                          : `    '${attr}'?: string`)
                      .join('\n')
              + `\n}`
    )
    .join('\n')
+ '\n\n}'
)