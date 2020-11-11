import React from 'react';
import { mappetPerson } from 'test-data';
import { render, screen, within } from '@testing-library/react';
import { Vilkår } from './Vilkår';
import { defaultPersonContext, PersonContext } from '../../../context/PersonContext';
import { Person, Vedtaksperiode, Vilkår as VilkårType } from 'internal-types';
import '@testing-library/jest-dom/extend-expect';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import { umappetVedtaksperiode } from '../../../../test/data/vedtaksperiode';
import { umappetArbeidsgiver } from '../../../../test/data/arbeidsgiver';
import { SpesialistVedtaksperiode, SpleisPeriodetype, SpleisVedtaksperiodetilstand } from 'external-types';

const FontContainer = styled.div`
    * {
        font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif !important;
    }
`;

type MedEndretVedtaksperiodeOptions = {
    vedtaksperiodeindeks: number;
    verdier: { [key: string]: any };
};

const medEndretVedtaksperiode = async ({
    vedtaksperiodeindeks,
    verdier,
}: MedEndretVedtaksperiodeOptions): Promise<Person> => {
    const person = await mappetPerson();
    return {
        ...person,
        arbeidsgivere: [
            {
                ...person.arbeidsgivere[0],
                vedtaksperioder: person.arbeidsgivere[0].vedtaksperioder.map((periode, i) =>
                    i === vedtaksperiodeindeks ? { ...periode, ...verdier } : periode
                ),
            },
        ],
    };
};

type medEndredeVilkårOptions = {
    vedtaksperiodeindeks: number;
    verdier: { [key: string]: any };
};

const medEndredeVilkår = async ({ vedtaksperiodeindeks, verdier }: medEndredeVilkårOptions): Promise<Person> => {
    const person = await mappetPerson();
    return {
        ...person,
        arbeidsgivere: [
            {
                ...person.arbeidsgivere[0],
                vedtaksperioder: vedtaksperioderMedNyeVilkår({
                    vedtaksperioder: person.arbeidsgivere[0].vedtaksperioder as Vedtaksperiode[],
                    index: vedtaksperiodeindeks,
                    verdier: verdier,
                }),
            },
        ],
    };
};

type VedtaksperioderMedNyeVilkårOptions = {
    vedtaksperioder: Vedtaksperiode[];
    index: number;
    verdier: { [key: string]: any };
};
const vedtaksperioderMedNyeVilkår = ({
    vedtaksperioder,
    index,
    verdier,
}: VedtaksperioderMedNyeVilkårOptions): Vedtaksperiode[] =>
    vedtaksperioder.map((periode, i) =>
        i === index ? { ...periode, vilkår: { ...periode.vilkår, ...verdier } as VilkårType } : periode
    );

type PåfølgendeMedEndretVedtaksperiodeOptions = {
    vedtaksperiodeindeks: number;
    verdier: { [key: string]: any };
};

const påfølgendeMedEndretVedtaksperiode = async ({
    vedtaksperiodeindeks,
    verdier,
}: PåfølgendeMedEndretVedtaksperiodeOptions): Promise<Person> => {
    const { første, påfølgende } = lagPåfølgendePar();
    const person = await mappetPerson([umappetArbeidsgiver([påfølgende, første])]);
    return {
        ...person,
        arbeidsgivere: [
            {
                ...person.arbeidsgivere[0],
                vedtaksperioder: person.arbeidsgivere[0].vedtaksperioder.map((periode, i) =>
                    i === vedtaksperiodeindeks ? { ...periode, ...verdier } : periode
                ),
            },
        ],
    };
};

type PåfølgendeMedEndredeVilkårOptions = {
    vedtaksperiodeindeks: number;
    verdier: { [key: string]: any };
};

const påfølgendeMedEndredeVilkår = async ({
    vedtaksperiodeindeks,
    verdier,
}: PåfølgendeMedEndredeVilkårOptions): Promise<Person> => {
    const { første, påfølgende } = lagPåfølgendePar();
    const person = await mappetPerson([umappetArbeidsgiver([påfølgende, første])]);
    return {
        ...person,
        arbeidsgivere: [
            {
                ...person.arbeidsgivere[0],
                vedtaksperioder: vedtaksperioderMedNyeVilkår({
                    vedtaksperioder: person.arbeidsgivere[0].vedtaksperioder as Vedtaksperiode[],
                    index: vedtaksperiodeindeks,
                    verdier: verdier,
                }),
            },
        ],
    };
};

const tilUtbetalt = (vedtaksperiode: SpesialistVedtaksperiode): SpesialistVedtaksperiode => ({
    ...vedtaksperiode,
    tilstand: SpleisVedtaksperiodetilstand.Utbetalt,
    godkjenttidspunkt: vedtaksperiode.tom,
    godkjentAv: 'En Saksbehandler',
});

type PåfølgendePar = {
    første: SpesialistVedtaksperiode;
    påfølgende: SpesialistVedtaksperiode;
};
const lagPåfølgendePar = (): PåfølgendePar => {
    const førstePeriode = tilUtbetalt(umappetVedtaksperiode());
    const påfølgende = umappetVedtaksperiode({
        fom: dayjs(førstePeriode.tom).add(1, 'day'),
        tom: dayjs(førstePeriode.tom).add(10, 'day'),
    });

    return { første: førstePeriode, påfølgende: { ...påfølgende, periodetype: SpleisPeriodetype.FORLENGELSE } };
};

const renderVilkår = (person: Person) =>
    render(
        <PersonContext.Provider
            value={{
                ...defaultPersonContext,
                personTilBehandling: person,
                aktivVedtaksperiode: person.arbeidsgivere[0].vedtaksperioder[0] as Vedtaksperiode,
            }}
        >
            <FontContainer>
                <Vilkår />
            </FontContainer>
        </PersonContext.Provider>
    );

const expectGroupToContainVisible = (groupName: string, ...ids: string[]) => {
    const group = screen.getByTestId(groupName);
    expect(group).toBeVisible();
    expectHTMLGroupToContainVisible(group, ...ids);
};

const expectHTMLGroupToContainVisible = (group: HTMLElement, ...ids: string[]) => {
    ids.forEach((id) => expect(within(group).getByTestId(id)).toBeVisible());
};

const expectGroupsToNotExist = (...groups: string[]) =>
    groups.forEach((group) => expect(screen.queryByTestId(group)).toBeNull());

describe('Vilkår', () => {
    describe('førstegangsbehandling', () => {
        it('har alle vilkår oppfylt', async () => {
            const personUtenInstitusjonsopphold = await medEndretVedtaksperiode({
                vedtaksperiodeindeks: 0,
                verdier: { godkjenttidspunkt: dayjs('11-04-2020') },
            });
            await renderVilkår(personUtenInstitusjonsopphold);

            expectGroupToContainVisible(
                'oppfylte-vilkår',
                'alder',
                'søknadsfrist',
                'opptjening',
                'sykepengegrunnlag',
                'dagerIgjen',
                'medlemskap',
                'arbeidsuførhet',
                'institusjonsopphold'
            );

            expectGroupsToNotExist(
                'vurdert-av-saksbehandler',
                'vurdert-automatisk',
                'vurdert-i-infotrygd',
                'ikke-oppfylte-vilkår',
                'ikke-vurderte-vilkår'
            );
        });
        it('har noen vilkår ikke oppfylt', async () => {
            const personMedIkkeOppfyltVilkår = await medEndredeVilkår({
                vedtaksperiodeindeks: 0,
                verdier: { opptjening: { oppfylt: false } },
            });

            await renderVilkår(personMedIkkeOppfyltVilkår);

            expectGroupToContainVisible(
                'oppfylte-vilkår',
                'alder',
                'søknadsfrist',
                'sykepengegrunnlag',
                'dagerIgjen',
                'medlemskap',
                'arbeidsuførhet'
            );

            expectGroupToContainVisible('ikke-vurderte-vilkår', 'institusjonsopphold');
            expectGroupToContainVisible('ikke-oppfylte-vilkår', 'opptjening');

            expectGroupsToNotExist('vurdert-av-saksbehandler', 'vurdert-automatisk', 'vurdert-i-infotrygd');
        });
        it('er godkjent', async () => {
            const personMedGodkjentPeriode = await medEndretVedtaksperiode({
                vedtaksperiodeindeks: 0,
                verdier: { behandlet: true },
            });
            await renderVilkår(personMedGodkjentPeriode);

            expectGroupToContainVisible(
                'vurdert-av-saksbehandler',
                'alder',
                'søknadsfrist',
                'sykepengegrunnlag',
                'dagerIgjen',
                'medlemskap',
                'arbeidsuførhet',
                'institusjonsopphold',
                'opptjening'
            );

            expectGroupsToNotExist(
                'vurdert-automatisk',
                'vurdert-i-infotrygd',
                'ikke-oppfylte-vilkår',
                'ikke-vurderte-vilkår'
            );
        });
        it('er automatisk godkjent', async () => {
            const personMedGodkjentPeriode = await medEndretVedtaksperiode({
                vedtaksperiodeindeks: 0,
                verdier: { automatiskBehandlet: true, behandlet: true },
            });
            await renderVilkår(personMedGodkjentPeriode);

            expectGroupToContainVisible(
                'vurdert-automatisk',
                'alder',
                'søknadsfrist',
                'sykepengegrunnlag',
                'dagerIgjen',
                'medlemskap',
                'arbeidsuførhet',
                'institusjonsopphold',
                'opptjening'
            );

            expectGroupsToNotExist(
                'vurdert-av-saksbehandler',
                'vurdert-i-infotrygd',
                'ikke-oppfylte-vilkår',
                'ikke-vurderte-vilkår'
            );
        });
    });
    describe('påfølgende', () => {
        it('har alle vilkår oppfylt', async () => {
            const personUtenInstitusjonsopphold = await påfølgendeMedEndretVedtaksperiode({
                vedtaksperiodeindeks: 0,
                verdier: { godkjenttidspunkt: dayjs('11-04-2020') },
            });
            await renderVilkår(personUtenInstitusjonsopphold);

            expectGroupToContainVisible(
                'oppfylte-vilkår',
                'alder',
                'søknadsfrist',
                'dagerIgjen',
                'arbeidsuførhet',
                'institusjonsopphold'
            );

            expectGroupToContainVisible('vurdert-av-saksbehandler', 'opptjening', 'sykepengegrunnlag', 'medlemskap');

            expectGroupsToNotExist(
                'vurdert-automatisk',
                'vurdert-i-infotrygd',
                'ikke-oppfylte-vilkår',
                'ikke-vurderte-vilkår'
            );
        });
        it('har noen vilkår ikke oppfylt', async () => {
            const personUtenInstitusjonsopphold = await påfølgendeMedEndredeVilkår({
                vedtaksperiodeindeks: 0,
                verdier: { alder: { oppfylt: false, alderSisteSykedag: 90 } },
            });
            await renderVilkår(personUtenInstitusjonsopphold);

            expectGroupToContainVisible('oppfylte-vilkår', 'søknadsfrist', 'dagerIgjen', 'arbeidsuførhet');

            expectGroupToContainVisible('vurdert-av-saksbehandler', 'opptjening', 'sykepengegrunnlag', 'medlemskap');

            expectGroupToContainVisible('ikke-oppfylte-vilkår', 'alder');

            expectGroupToContainVisible('ikke-vurderte-vilkår', 'institusjonsopphold');

            expectGroupsToNotExist('vurdert-automatisk', 'vurdert-i-infotrygd');
        });
        it('er godkjent', async () => {
            const personUtenInstitusjonsopphold = await påfølgendeMedEndretVedtaksperiode({
                vedtaksperiodeindeks: 0,
                verdier: { behandlet: true },
            });
            await renderVilkår(personUtenInstitusjonsopphold);

            const [vilkårVurdertDennePerioden, vilkårVurdertVedSkjeringstidspunkt] = screen.getAllByTestId(
                'vurdert-av-saksbehandler'
            );

            expect(vilkårVurdertDennePerioden).toBeVisible();
            expectHTMLGroupToContainVisible(
                vilkårVurdertDennePerioden,
                'alder',
                'søknadsfrist',
                'dagerIgjen',
                'institusjonsopphold',
                'arbeidsuførhet'
            );

            expect(vilkårVurdertVedSkjeringstidspunkt).toBeVisible();
            expectHTMLGroupToContainVisible(
                vilkårVurdertVedSkjeringstidspunkt,
                'opptjening',
                'sykepengegrunnlag',
                'medlemskap'
            );

            expectGroupsToNotExist(
                'vurdert-automatisk',
                'vurdert-i-infotrygd',
                'oppfylte-vilkår',
                'ikke-oppfylte-vilkår',
                'ikke-vurderte-vilkår'
            );
        });
        it('er automatisk godkjent', async () => {
            const personUtenInstitusjonsopphold = await påfølgendeMedEndretVedtaksperiode({
                vedtaksperiodeindeks: 0,
                verdier: { automatiskBehandlet: true, behandlet: true },
            });
            await renderVilkår(personUtenInstitusjonsopphold);

            expectGroupToContainVisible(
                'vurdert-automatisk',
                'alder',
                'søknadsfrist',
                'dagerIgjen',
                'institusjonsopphold',
                'arbeidsuførhet'
            );

            expectGroupToContainVisible('vurdert-av-saksbehandler', 'opptjening', 'sykepengegrunnlag', 'medlemskap');

            expectGroupsToNotExist(
                'vurdert-i-infotrygd',
                'oppfylte-vilkår',
                'ikke-oppfylte-vilkår',
                'ikke-vurderte-vilkår'
            );
        });
    });
});
