// Source: https://www.w3.org/TR/html52/fullindex.html.

const firstUp = str => str.charAt(0).toUpperCase() + str.slice(1)

/// Script-generated.
const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']

const htmlInterfaces = Array
    .from(
        document
            .querySelector('#element-interfaces')
            .nextElementSibling
            .nextElementSibling
            .querySelectorAll('tbody tr')
    )
    .map(row => [
        row.cells[0].textContent.trim(),
        row.cells[1].querySelector('.idl').textContent.trim()
    ])

// Target: ./generate-built-time.dom.js.
copy(
`/// Script-generated.
// Array containing the names of all interfaces of HTML elements (does not include ancestors).
const htmlInterfaces = ` + JSON.stringify(
        htmlInterfaces
            .map(([tag, iface]) => iface)
            .filter((iface, idx, arr) => arr.indexOf(iface) === idx)
            .sort()
    )
    .replace(/"/g, `'`)
    .replace(/,/g, `, `)
)

// Target: ../src/html/HtmlTypesMap.ts
copy(
`/// Script-generated.

/**
 * Map from HTML tag names to their corresponding types.
 */
export interface HtmlTypesMap {
${
    htmlInterfaces
        .map(([tag, iface]) => `    ${tag}: ${iface}`)
        .join('\n')
}
}`)

// Target: ../src/html/BuiltTimeHtmlTypesMap.ts
copy(
`/// Script-generated.

import {BuiltTimeDom} from '../BuiltTimeDom'

/**
 * Map from HTML tag names to their corresponding built-time types.
 */
export interface BuiltTimeHtmlTypesMap {
${
    htmlInterfaces
        .map(([tag, iface]) => `    ${tag}: BuiltTimeDom.${iface}`)
        .join('\n')
}
}`)

// Target: ../src/html/h.ts
copy(
`/// Script-generated.

/**
 * Helpers to facilitate the concise creation of any HTML element.
 *
 * NOTE The following functions silently depend on the \`document\` variable
 * being globally available. Therefore, unit tests of components that use them
 * must be run inside a browser, or must expose \`document\` globally, e.g.
 * through PhantomJS or jsdom.
 */
export const h = {
${
    htmlInterfaces
        .map(([tag, iface]) => voidElements.indexOf(tag) > -1
            ? `    ${tag}: (props?: BuiltTimeDom.${iface}): HtmlTypesMap['${tag}'] => _h('${tag}', props),`
            : `    ${tag}: (props?: BuiltTimeDom.${iface}, children?: HtmlChildrenMap['${tag}']): HtmlTypesMap['${tag}'] => _h('${tag}', props, children),`)
        .join('\n')
}
}`)

// Target: ../src/html/h.ts
copy(
`/// Script-generated.

/**
 * Nice-to-remember aliases for all HTML element interfaces.
 */
export namespace h {
${
    htmlInterfaces
        .map(([tag, iface]) => `    export type ${firstUp(tag)} = ${iface}`)
        .join('\n')
}
}`)
