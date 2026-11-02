import { act, render, screen } from '@test-utils';

import { AnimatedExpandableDiv } from './AnimatedExpandableDiv';

describe('AnimatedExpandableDiv', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('rendrer ikke innhold når den er lukket', () => {
        render(<AnimatedExpandableDiv expanded={false}>Innhold</AnimatedExpandableDiv>);

        expect(screen.queryByText('Innhold')).not.toBeInTheDocument();
    });

    it('rendrer innhold når den er åpen', () => {
        render(<AnimatedExpandableDiv expanded>Innhold</AnimatedExpandableDiv>);

        expect(screen.getByText('Innhold')).toBeInTheDocument();
    });

    it('fjerner innholdet først etter lukkeanimasjonen', () => {
        const { rerender } = render(<AnimatedExpandableDiv expanded>Innhold</AnimatedExpandableDiv>);

        rerender(<AnimatedExpandableDiv expanded={false}>Innhold</AnimatedExpandableDiv>);
        expect(screen.getByText('Innhold')).toBeInTheDocument();

        act(() => vi.advanceTimersByTime(200));
        expect(screen.queryByText('Innhold')).not.toBeInTheDocument();
    });

    it('beholder innholdet hvis den åpnes igjen under lukking', () => {
        const { rerender } = render(<AnimatedExpandableDiv expanded>Innhold</AnimatedExpandableDiv>);

        rerender(<AnimatedExpandableDiv expanded={false}>Innhold</AnimatedExpandableDiv>);
        act(() => vi.advanceTimersByTime(100));
        rerender(<AnimatedExpandableDiv expanded>Innhold</AnimatedExpandableDiv>);
        act(() => vi.advanceTimersByTime(500));

        expect(screen.getByText('Innhold')).toBeInTheDocument();
    });
});
