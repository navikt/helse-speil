import axeCore, { type AxeResults, type RunOptions, type Spec } from 'axe-core';

// jsdom does not perform real layout or rendering, so axe-core's color-contrast check cannot
// reliably compute colors there (it also depends on canvas, which jsdom does not implement).
// axe-core's own docs recommend disabling this rule when running under jsdom.
const jsdomDefaultRules = [{ id: 'color-contrast', enabled: false }];

/**
 * Run axe-core accessibility checks on a DOM element.
 */
export async function axe(container: Element, options?: RunOptions & { rules?: Spec['rules'] }): Promise<AxeResults> {
    const { rules, ...runOptions } = options ?? {};

    axeCore.configure({ rules: [...jsdomDefaultRules, ...(rules ?? [])] });

    return axeCore.run(container, runOptions);
}
