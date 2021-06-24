import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import { Dagtype } from 'internal-types';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { OverstyrbarDagtypeCell } from './OverstyrbarDagtypeCell';

const Wrapper: React.FC = ({ children }) => {
    const form = useForm();
    return <FormProvider {...form}>{children}</FormProvider>;
};

const kanRevurdere = (type: Dagtype) => {
    const dag = {
        type: type,
        dato: dayjs(),
        gradering: 100,
    };
    render(
        <OverstyrbarDagtypeCell erRevurdering={true} onOverstyr={() => null} sykdomsdag={dag} utbetalingsdag={dag} />,
        { wrapper: Wrapper }
    );
    expect(screen.getByTestId('overstyrbar-dagtype')).toBeVisible();
};

const kanIkkeRevurdere = (type: Dagtype) => {
    const dag = {
        type: type,
        dato: dayjs(),
        gradering: 100,
    };
    render(
        <OverstyrbarDagtypeCell erRevurdering={true} onOverstyr={() => null} sykdomsdag={dag} utbetalingsdag={dag} />,
        { wrapper: Wrapper }
    );
    expect(screen.queryByTestId('overstyrbar-dagtype')).toBeNull();
    expect(screen.queryAllByTestId('overstyrbar-dagtype-option')).toHaveLength(0);
};

describe('OverstyrbarDagtypeCell', () => {
    test('Kan revurdere syk til ferie', () => {
        kanRevurdere(Dagtype.Syk);
        const options = screen.queryAllByTestId('overstyrbar-dagtype-option');
        expect(options).toHaveLength(2);
        expect(options[0]).toHaveTextContent('Syk');
        expect(options[1]).toHaveTextContent('Ferie');
    });

    test('Kan revurdere ferie', () => {
        kanRevurdere(Dagtype.Ferie);
        const options = screen.queryAllByTestId('overstyrbar-dagtype-option');
        expect(options).toHaveLength(2);
        expect(options[0]).toHaveTextContent('Syk');
        expect(options[1]).toHaveTextContent('Ferie');
    });

    test('Kan ikke revurdere egenmelding', () => {
        kanIkkeRevurdere(Dagtype.Egenmelding);
    });

    test('Kan ikke revurdere permisjon', () => {
        kanIkkeRevurdere(Dagtype.Permisjon);
    });

    test('Kan ikke revurdere helg', () => {
        kanIkkeRevurdere(Dagtype.Helg);
    });

    test('Kan ikke revurdere annullert dag', () => {
        kanIkkeRevurdere(Dagtype.Annullert);
    });

    test('Kan ikke revurdere arbeidsdag', () => {
        kanIkkeRevurdere(Dagtype.Arbeidsdag);
    });

    test('Kan ikke revurdere arbeidsgiverperiodedag', () => {
        kanIkkeRevurdere(Dagtype.Arbeidsgiverperiode);
    });

    test('Kan ikke revurdere avvist', () => {
        kanIkkeRevurdere(Dagtype.Avvist);
    });

    test('Kan ikke revurdere foreldet', () => {
        kanIkkeRevurdere(Dagtype.Foreldet);
    });

    test('Kan ikke revurdere ubestemt dag', () => {
        kanIkkeRevurdere(Dagtype.Ubestemt);
    });
});
