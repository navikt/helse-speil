import React from 'react';
import { Mock, vi } from 'vitest';

import { useHarTotrinnsvurdering } from '@hooks/useHarTotrinnsvurdering';
import {
    ApiGraderteAndreYtelser,
    ApiGraderteAndreYtelserEvent,
    ApiGraderteAndreYtelserType,
} from '@io/rest/generated/spesialist.schemas';
import { GraderteAndreYtelserView } from '@saksbilde/andreYtelser/GraderteAndreYtelserView';
import { useGraderteAndreYtelser } from '@saksbilde/andreYtelser/useGraderteAndreYtelser';
import { useFetchPersonQuery } from '@state/person';
import { enPerson } from '@test-data/person';
import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

vi.mock('@state/person');
vi.mock('@hooks/useHarTotrinnsvurdering');
vi.mock('@saksbilde/andreYtelser/useGraderteAndreYtelser');

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
        expect(screen.getByRole('heading', { level: 2, name: 'Pleiepenger' })).toBeVisible();
        expect(screen.getByRole('img', { name: 'Nav-logo' })).toBeInTheDocument();
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

    it('viser hvem som fjernet ytelsen og når', () => {
        mockYtelse(
            enYtelse({
                fjernet: true,
                events: [
                    etOpprettetEvent(1),
                    {
                        type: 'ApiGraderteAndreYtelserFjernetEvent',
                        metadata: enMetadata(2, 'X999999'),
                    },
                ],
            }),
        );

        render(<GraderteAndreYtelserView andreYtelserId="en-id" />);

        expect(screen.getByText('Fjernet av: X999999')).toBeVisible();
        expect(screen.getByText(/^Tidspunkt: /)).toBeVisible();
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

    it('åpner endringsloggen med én rad per hendelse', async () => {
        mockYtelse(
            enYtelse({
                events: [
                    etOpprettetEvent(1),
                    {
                        type: 'ApiGraderteAndreYtelserEndretEvent',
                        metadata: enMetadata(2, 'X222222'),
                        endringer: {
                            andreYtelserType: {
                                fra: ApiGraderteAndreYtelserType.PLEIEPENGER,
                                til: ApiGraderteAndreYtelserType.OMSORGSPENGER,
                            },
                            perioder: {
                                fra: [{ periode: { fom: '2022-08-02', tom: '2022-08-13' }, grad: 50 }],
                                til: [{ periode: { fom: '2022-08-02', tom: '2022-08-20' }, grad: 80 }],
                            },
                        },
                    },
                    {
                        type: 'ApiGraderteAndreYtelserFjernetEvent',
                        metadata: enMetadata(3, 'X333333'),
                    },
                ],
            }),
        );

        render(<GraderteAndreYtelserView andreYtelserId="en-id" />);

        await userEvent.click(screen.getByRole('button', { name: 'Saksbehandler' }));

        const dialog = await screen.findByRole('dialog');
        expect(screen.getByRole('heading', { name: 'Endringslogg' })).toBeVisible();
        expect(screen.getAllByRole('row')).toHaveLength(4); // header + 3 hendelser
        expect(screen.getByText('Lagt til')).toBeVisible();
        expect(screen.getByText('Endret')).toBeVisible();
        expect(screen.getByText('Fjernet')).toBeVisible();
        expect(screen.getByText('02.08.2022 - 20.08.2022, 80 %')).toBeVisible();
        expect(dialog).toHaveTextContent('X333333');
    });
});

const enMetadata = (sekvensnummer: number, ident: string) => ({
    sekvensnummer,
    tidspunkt: '2022-09-01T12:00:00',
    utfortAvSaksbehandlerIdent: ident,
    notatTilBeslutter: '',
});

const etOpprettetEvent = (sekvensnummer: number): ApiGraderteAndreYtelserEvent => ({
    type: 'ApiGraderteAndreYtelserOpprettetEvent',
    metadata: enMetadata(sekvensnummer, 'X111111'),
    andreYtelserType: ApiGraderteAndreYtelserType.PLEIEPENGER,
    perioder: [{ fom: '2022-08-02', tom: '2022-08-13', grad: 50 }],
});

const enYtelse = (overstyringer: Partial<ApiGraderteAndreYtelser> = {}): ApiGraderteAndreYtelser => ({
    andreYtelserId: 'en-id',
    andreYtelserType: ApiGraderteAndreYtelserType.PLEIEPENGER,
    perioder: [{ fom: '2022-08-02', tom: '2022-08-13', grad: 50 }],
    fjernet: false,
    events: [],
    ...overstyringer,
});

const mockYtelse = (ytelse: ApiGraderteAndreYtelser | undefined) => {
    (useGraderteAndreYtelser as Mock).mockReturnValue({
        ytelse,
        isPending: false,
        invaliderGraderteAndreYtelser: vi.fn(),
    });
};
