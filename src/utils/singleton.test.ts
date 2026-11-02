import { singleton } from './singleton';

describe('singleton', () => {
    afterEach(() => {
        delete (globalThis as Record<string, unknown>)['singleton-test'];
    });

    it('lager instansen én gang og gjenbruker den', () => {
        const create = vi.fn(() => ({}));

        const first = singleton('singleton-test', create);
        const second = singleton('singleton-test', create);

        expect(second).toBe(first);
        expect(create).toHaveBeenCalledTimes(1);
    });
});
