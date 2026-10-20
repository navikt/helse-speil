import { useAtomValue, useSetAtom } from 'jotai';
import React, { ReactElement } from 'react';

import { Accordion } from '@navikt/ds-react';

import { datofilterAtom } from '@oversikt/table/state/filter';
import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { DatoFilter } from './DatoFilter';

describe('DatoFilter', () => {
    it('setter filter når innskrevet dato er gyldig, uten å miste fokus', async () => {
        render(<DatoFilterMedVerdi />, { atomValues: [[datofilterAtom, {}]] });

        const fom = screen.getAllByRole('textbox', { name: 'Fra og med' })[0]!;
        await userEvent.type(fom, '01.02.2026');

        expect(screen.getByTestId('datofilter')).toHaveTextContent('"oppgaveKlarFom":"2026-02-01"');
        expect(fom).toHaveFocus();
        expect(fom).toHaveValue('01.02.2026');
    });

    it('fjerner filteret når feltet tømmes', async () => {
        render(<DatoFilterMedVerdi />, { atomValues: [[datofilterAtom, { oppgaveKlarFom: '2026-02-01' }]] });

        const fom = screen.getAllByRole('textbox', { name: 'Fra og med' })[0]!;
        expect(fom).toHaveValue('01.02.2026');

        await userEvent.clear(fom);

        expect(screen.getByTestId('datofilter')).toHaveTextContent('{}');
    });

    it('dupliserer ikke felt når fra og til er samme dato', async () => {
        render(<DatoFilterMedVerdi />, {
            atomValues: [[datofilterAtom, { oppgaveKlarFom: '2026-02-01', oppgaveKlarTom: '2026-02-01' }]],
        });

        const fom = screen.getAllByRole('textbox', { name: 'Fra og med' })[0]!;
        await userEvent.clear(fom);
        await userEvent.type(fom, '01.01.2026');
        const tom = screen.getAllByRole('textbox', { name: 'Til og med' })[0]!;
        await userEvent.clear(tom);
        await userEvent.type(tom, '01.03.2026');

        expect(screen.getAllByRole('textbox', { name: 'Fra og med' })).toHaveLength(1);
        expect(screen.getAllByRole('textbox', { name: 'Til og med' })).toHaveLength(1);
    });

    it('tømmer feltet når filteret nullstilles utenfra', async () => {
        render(<DatoFilterMedVerdi />, { atomValues: [[datofilterAtom, { oppgaveKlarFom: '2026-02-01' }]] });

        await userEvent.click(screen.getByRole('button', { name: 'Nullstill' }));

        expect(screen.getAllByRole('textbox', { name: 'Fra og med' })[0]).toHaveValue('');
    });
});

function DatoFilterMedVerdi(): ReactElement {
    const datofilter = useAtomValue(datofilterAtom);
    const setDatofilter = useSetAtom(datofilterAtom);
    return (
        <>
            <Accordion>
                <DatoFilter />
            </Accordion>
            <span data-testid="datofilter">{JSON.stringify(datofilter)}</span>
            <button onClick={() => setDatofilter({})}>Nullstill</button>
        </>
    );
}
