import React from 'react';
import { Mock, vi } from 'vitest';

import { useHarTotrinnsvurdering } from '@hooks/useHarTotrinnsvurdering';
import { ApiGraderteAndreYtelser, ApiGraderteAndreYtelserType } from '@io/rest/generated/spesialist.schemas';
import { GraderteAndreYtelserView } from '@saksbilde/andreYtelser/GraderteAndreYtelserView';
import { useGraderteAndreYtelser } from '@saksbilde/andreYtelser/useGraderteAndreYtelser';
import { useFetchPersonQuery } from '@state/person';
import { enPerson } from '@test-data/person';
import { render, screen } from '@test-utils';

vi.mock('@state/person');
vi.mock('@hooks/useHarTotrinnsvurdering');
vi.mock('@saksbilde/andreYtelser/useGraderteAndreYtelser');

const enYtelse = (overstyringer: Partial<ApiGraderteAndreYtelser> = {}): ApiGraderteAndreYtelser => ({
    andreYtelserId: 'en-id',
    andreYtelserType: ApiGraderteAndreYtelserType.PLEIEPENGER,
    perioder: [{ fom: '2022-08-02', tom: '2022-08-13', grad: 50 }],
    fjernet: false,
    ...overstyringer,
});

const mockYtelse = (ytelse: ApiGraderteAndreYtelser | undefined) => {
    (useGraderteAndreYtelser as Mock).mockReturnValue({
        ytelse,
        isPending: false,
        invaliderGraderteAndreYtelser: vi.fn(),
    });
};

describe('GraderteAndreYtelserView', () => {
    beforeEach(() => {
        (useFetchPersonQuery as Mock).mockReturnValue({ data: { person: enPerson() } });
        (useHarTotrinnsvurdering as Mock).mockReturnValue(false);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('viser endre- og fjern-knapp for en aktiv ytelse', () => {
        mockYtelse(enYtelse());

        render(<GraderteAndreYtelserView andreYtelserId="en-id" />);

        expect(screen.getByRole('button', { name: 'Endre' })).toBeVisible();
        expect(screen.getByRole('button', { name: 'Fjern ytelse' })).toBeVisible();
        expect(screen.queryByText('Ytelsen er fjernet')).not.toBeInTheDocument();
    });

    it('viser fjernet-varsel og gjenopprett-lenke for en fjernet ytelse', () => {
        mockYtelse(enYtelse({ fjernet: true }));

        render(<GraderteAndreYtelserView andreYtelserId="en-id" />);

        expect(screen.getByText('Ytelsen er fjernet')).toBeVisible();
        expect(screen.getByRole('link', { name: /Legg til ytelsen likevel/ })).toBeVisible();
        expect(screen.queryByRole('button', { name: 'Endre' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Fjern ytelse' })).not.toBeInTheDocument();
    });

    it('skjuler alle endringsknapper når saken er til totrinnsvurdering', () => {
        (useHarTotrinnsvurdering as Mock).mockReturnValue(true);
        mockYtelse(enYtelse());

        render(<GraderteAndreYtelserView andreYtelserId="en-id" />);

        expect(screen.queryByRole('button', { name: 'Endre' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Fjern ytelse' })).not.toBeInTheDocument();
    });

    it('skjuler gjenopprett-lenken når saken er til totrinnsvurdering', () => {
        (useHarTotrinnsvurdering as Mock).mockReturnValue(true);
        mockYtelse(enYtelse({ fjernet: true }));

        render(<GraderteAndreYtelserView andreYtelserId="en-id" />);

        expect(screen.getByText('Ytelsen er fjernet')).toBeVisible();
        expect(screen.queryByRole('link', { name: /Legg til ytelsen likevel/ })).not.toBeInTheDocument();
    });

    it('rendrer ingenting når ytelsen ikke finnes', () => {
        mockYtelse(undefined);

        const { container } = render(<GraderteAndreYtelserView andreYtelserId="ukjent-id" />);

        expect(container).toBeEmptyDOMElement();
    });
});
