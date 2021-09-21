import '@testing-library/jest-dom/extend-expect';
import { render, screen, within } from '@testing-library/react';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';
import { mappetPerson, mappetVedtaksperiode } from 'test-data';

import { Inngangsvilkår } from './Inngangsvilkår';

const infotrygdforlengelse = () => ({
    periodetype: 'infotrygdforlengelse',
    forlengelseFraInfotrygd: 'JA',
});

const ferdigbehandlet = (): Partial<Vedtaksperiode> => ({
    tilstand: 'utbetalt',
    godkjenttidspunkt: dayjs(),
    godkjentAv: 'En Saksbehandler',
    behandlet: true,
});

const påfølgende = () => ({
    periodetype: 'forlengelse',
});

type PersonMedModifiserteVilkårOptions = {
    vedtaksperiodeverdier?: { [K in keyof Partial<Vedtaksperiode>]: any }[];
    vilkårverdier?: { [K in keyof Partial<Vilkår>]: any }[];
};

const personMedModifiserteVilkår = ({
    vedtaksperiodeverdier,
    vilkårverdier,
}: PersonMedModifiserteVilkårOptions): Person => {
    if (vedtaksperiodeverdier && vilkårverdier && vedtaksperiodeverdier.length !== vilkårverdier.length) {
        throw Error('Antall vedtaksperioder og vilkår må stemme overens.');
    }
    const antallPerioder = Math.max(vilkårverdier?.length ?? 0, vedtaksperiodeverdier?.length ?? 0);
    const person = mappetPerson();
    let sisteTom: Dayjs | undefined;
    const vedtaksperioder = Array(antallPerioder)
        .fill({})
        .map((_, i) => {
            const periode = sisteTom
                ? mappetVedtaksperiode(sisteTom.add(1, 'day'), sisteTom.add(10, 'day'))
                : mappetVedtaksperiode();
            sisteTom = periode.tom;
            return {
                ...periode,
                ...vedtaksperiodeverdier?.[i],
                vilkår: {
                    ...periode.vilkår,
                    ...vilkårverdier?.[i],
                },
            };
        });
    return {
        ...person,
        arbeidsgivere: [
            {
                ...person.arbeidsgivere[0],
                vedtaksperioder: vedtaksperioder,
            },
        ],
    };
};

describe('Vilkår', () => {
    describe('førstegangsbehandling', () => {
        it('har alle vilkår oppfylt', () => {
            const medAlleVilkårOppfylt = personMedModifiserteVilkår({
                vedtaksperiodeverdier: [{ periodetype: 'førstegangsbehandling' }],
            });
            render(
                <Inngangsvilkår
                    person={medAlleVilkårOppfylt}
                    vedtaksperiode={medAlleVilkårOppfylt.arbeidsgivere[0].vedtaksperioder[0] as Vedtaksperiode}
                />
            );

            const gruppe = screen.getByTestId('oppfylte-vilkår');
            expect(gruppe).toBeVisible();
            expect(within(gruppe).getByText('Opptjeningstid')).toBeVisible();
            expect(within(gruppe).getByText('Lovvalg og medlemskap')).toBeVisible();
            expect(within(gruppe).getByText('Krav til minste sykepengegrunnlag')).toBeVisible();
        });

        it('har noen vilkår ikke oppfylt', () => {
            const medNoenVilkårIkkeOppfylt = personMedModifiserteVilkår({
                vilkårverdier: [{ opptjening: { oppfylt: false } }],
            });
            render(
                <Inngangsvilkår
                    person={medNoenVilkårIkkeOppfylt}
                    vedtaksperiode={medNoenVilkårIkkeOppfylt.arbeidsgivere[0].vedtaksperioder[0] as Vedtaksperiode}
                />
            );

            const oppfylteVilkår = screen.getByTestId('oppfylte-vilkår');
            expect(oppfylteVilkår).toBeVisible();

            expect(within(oppfylteVilkår).queryByText('Opptjeningstid')).toBeNull();
            expect(within(oppfylteVilkår).getByText('Lovvalg og medlemskap')).toBeVisible();
            expect(within(oppfylteVilkår).getByText('Krav til minste sykepengegrunnlag')).toBeVisible();

            const ikkeOppfylteVilkår = screen.getByTestId('ikke-oppfylte-vilkår');
            expect(ikkeOppfylteVilkår).toBeVisible();
            expect(within(ikkeOppfylteVilkår).getByText('Opptjeningstid')).toBeVisible();
        });

        it('er godkjent', async () => {
            const medGodkjentPeriode = await personMedModifiserteVilkår({ vedtaksperiodeverdier: [ferdigbehandlet()] });
            render(
                <Inngangsvilkår
                    person={medGodkjentPeriode}
                    vedtaksperiode={medGodkjentPeriode.arbeidsgivere[0].vedtaksperioder[0] as Vedtaksperiode}
                />
            );

            const gruppe = screen.getByTestId('vurdert-av-saksbehandler');
            expect(gruppe).toBeVisible();
            expect(within(gruppe).getByText('Opptjeningstid')).toBeVisible();
            expect(within(gruppe).getByText('Lovvalg og medlemskap')).toBeVisible();
            expect(within(gruppe).getByText('Krav til minste sykepengegrunnlag')).toBeVisible();
        });

        it('er automatisk godkjent', async () => {
            const medGodkjentPeriode = await personMedModifiserteVilkår({
                vedtaksperiodeverdier: [{ automatiskBehandlet: true, behandlet: true }],
            });
            render(
                <Inngangsvilkår
                    person={medGodkjentPeriode}
                    vedtaksperiode={medGodkjentPeriode.arbeidsgivere[0].vedtaksperioder[0] as Vedtaksperiode}
                />
            );

            const gruppe = screen.getByTestId('vurdert-automatisk');
            expect(gruppe).toBeVisible();
            expect(within(gruppe).getByText('Opptjeningstid')).toBeVisible();
            expect(within(gruppe).getByText('Lovvalg og medlemskap')).toBeVisible();
            expect(within(gruppe).getByText('Krav til minste sykepengegrunnlag')).toBeVisible();
        });
    });

    describe('påfølgende', () => {
        it('har alle vilkår oppfylt', async () => {
            const påfølgendeMedOppfylteVilkår = await personMedModifiserteVilkår({
                vedtaksperiodeverdier: [{ ...påfølgende() }, ferdigbehandlet()],
            });
            render(
                <Inngangsvilkår
                    person={påfølgendeMedOppfylteVilkår}
                    vedtaksperiode={påfølgendeMedOppfylteVilkår.arbeidsgivere[0].vedtaksperioder[0] as Vedtaksperiode}
                />
            );

            const gruppe = screen.getByTestId('vurdert-av-saksbehandler');
            expect(gruppe).toBeVisible();
            expect(within(gruppe).getByText('Opptjeningstid')).toBeVisible();
            expect(within(gruppe).getByText('Lovvalg og medlemskap')).toBeVisible();
            expect(within(gruppe).getByText('Krav til minste sykepengegrunnlag')).toBeVisible();
        });
    });

    describe('forlengelse fra Infotrygd', () => {
        it('har alle vilkår oppfylt', async () => {
            const infotrygdforlengelseMedOppfylteVilkår = await personMedModifiserteVilkår({
                vedtaksperiodeverdier: [{ ...infotrygdforlengelse() }],
            });
            render(
                <Inngangsvilkår
                    person={infotrygdforlengelseMedOppfylteVilkår}
                    vedtaksperiode={
                        infotrygdforlengelseMedOppfylteVilkår.arbeidsgivere[0].vedtaksperioder[0] as Vedtaksperiode
                    }
                />
            );

            const gruppe = screen.getByTestId('vurdert-i-infotrygd');
            expect(gruppe).toBeVisible();
            expect(within(gruppe).getByText('Opptjeningstid')).toBeVisible();
            expect(within(gruppe).getByText('Lovvalg og medlemskap')).toBeVisible();
            expect(within(gruppe).getByText('Krav til minste sykepengegrunnlag')).toBeVisible();
        });
    });
});
