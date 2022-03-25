import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import React from 'react';

import { RadmarkeringCheckbox } from './RadmarkeringCheckbox';

jest.mock('@utils/featureToggles', () => ({
    overstyrPermisjonsdagerEnabled: true,
}));

describe('RadmarkeringCheckbox', () => {
    it('rendrer checkbox for overstyrbare dager', () => {
        render(
            <>
                <RadmarkeringCheckbox index={0} utbetalingsdagtype="Syk" dato={dayjs()} skjæringstidspunkt="" />
                <RadmarkeringCheckbox index={0} utbetalingsdagtype="Ferie" dato={dayjs()} skjæringstidspunkt="" />
                <RadmarkeringCheckbox index={0} utbetalingsdagtype="Egenmelding" dato={dayjs()} skjæringstidspunkt="" />
                <RadmarkeringCheckbox index={0} utbetalingsdagtype="Permisjon" dato={dayjs()} skjæringstidspunkt="" />;
            </>
        );

        expect(screen.getAllByRole('checkbox')).toHaveLength(4);
    });

    it('rendrer ikke checkbox for ikke-overstyrbare dager', () => {
        render(
            <>
                <RadmarkeringCheckbox index={0} utbetalingsdagtype="Helg" dato={dayjs()} skjæringstidspunkt="" />
                <RadmarkeringCheckbox index={0} utbetalingsdagtype="Avslått" dato={dayjs()} skjæringstidspunkt="" />
                <RadmarkeringCheckbox index={0} utbetalingsdagtype="Ubestemt" dato={dayjs()} skjæringstidspunkt="" />
                <RadmarkeringCheckbox index={0} utbetalingsdagtype="Arbeidsdag" dato={dayjs()} skjæringstidspunkt="" />;
                <RadmarkeringCheckbox
                    index={0}
                    utbetalingsdagtype="Arbeidsgiverperiode"
                    dato={dayjs()}
                    skjæringstidspunkt=""
                />
                ;
                <RadmarkeringCheckbox index={0} utbetalingsdagtype="Foreldet" dato={dayjs()} skjæringstidspunkt="" />;
                <RadmarkeringCheckbox index={0} utbetalingsdagtype="Annullert" dato={dayjs()} skjæringstidspunkt="" />;
            </>
        );

        expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    });

    it('kan ikke sjekkes om dato er lik skjæringstidspunkt', () => {
        render(
            <RadmarkeringCheckbox
                index={0}
                utbetalingsdagtype="Syk"
                dato={dayjs('2021-01-01')}
                skjæringstidspunkt="2021-01-01"
            />
        );
        userEvent.click(screen.getByRole('checkbox'));
        expect(screen.getAllByText('Kan foreløpig ikke endres. Mangler støtte for skjæringstidspunkt')).toHaveLength(2);
    });
});
