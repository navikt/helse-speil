import axeCore, { type AxeResults, type RunOptions, type Spec } from 'axe-core';

/**
 * Run axe-core accessibility checks on a DOM element.
 */
export async function axe(container: Element, options?: RunOptions & { rules?: Spec['rules'] }): Promise<AxeResults> {
    const { rules, ...runOptions } = options ?? {};

    if (rules) {
        axeCore.configure({ rules });
    }

    return axeCore.run(container, runOptions);
}
