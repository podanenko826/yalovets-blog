/*
 * highlight.js terraform syntax highlighting definition
 */

import { LanguageFn, Mode } from 'highlight.js';

// Define the Terraform language for Highlight.js
const hljsDefineTerraform: LanguageFn = hljs => {
    const NUMBERS: Mode = {
        className: 'number',
        begin: '\\b\\d+(\\.\\d+)?',
        relevance: 0,
    };

    const VARIABLE: Mode = {
        className: 'variable',
        begin: '\\${',
        end: '\\}',
        relevance: 9,
        contains: [], // Filled later to allow recursive reference
    };

    const STRINGS: Mode = {
        className: 'string',
        begin: '"',
        end: '"',
        contains: [VARIABLE],
    };

    VARIABLE.contains = [
        STRINGS,
        {
            className: 'meta',
            begin: '[A-Za-z_0-9]*\\(',
            end: '\\)',
            contains: [NUMBERS, STRINGS, VARIABLE], // Recursive nesting
        },
    ];

    return {
        name: 'Terraform',
        aliases: ['tf', 'hcl'],
        keywords: {
            keyword: 'resource variable provider output locals module data terraform',
            literal: 'false true null',
        },
        contains: [hljs.COMMENT('\\#', '$'), NUMBERS, STRINGS],
    };
};

// Register the Terraform language with Highlight.js
const registerTerraform = (hljs: any): void => {
    hljs.registerLanguage('terraform', hljsDefineTerraform);
};

// Export the Terraform language definition and the registration function
export default hljsDefineTerraform;
export { registerTerraform };
