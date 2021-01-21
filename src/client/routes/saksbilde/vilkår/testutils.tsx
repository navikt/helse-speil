import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Periodetype, Person, Vedtaksperiode, Vilkår as VilkårType } from 'internal-types';
import { SpesialistArbeidsgiver, SpleisForlengelseFraInfotrygd, SpleisVedtaksperiodetilstand } from 'external-types';
import { mappetPerson } from 'test-data';
import { mappetVedtaksperiode, umappetVedtaksperiode } from '../../../../test/data/vedtaksperiode';
import { render, screen, within } from '@testing-library/react';
import { Vilkår } from './Vilkår';
import { VedtaksperiodeBuilder } from '../../../mapping/vedtaksperiode';
import { Vilkårdata, Vilkårstype } from '../../../mapping/vilkår';
import { HookResult } from '@testing-library/react-hooks';
import { KategoriserteVilkår } from './tilKategoriserteVilkår';

export enum Group {
    OppfylteVilkår = 'oppfylte-vilkår',
    VurdertAvSaksbehandler = 'vurdert-av-saksbehandler',
    IkkeVurderteVilkår = 'ikke-vurderte-vilkår',
    IkkeOppfylteVilkår = 'ikke-oppfylte-vilkår',
    VurdertAutomatisk = 'vurdert-automatisk',
    VurdertIInfotrygd = 'vurdert-i-infotrygd',
}

export enum TestId {
    Alder = 'alder',
    Søknadsfrist = 'søknadsfrist',
    Opptjening = 'opptjening',
    Sykepengegrunnlag = 'sykepengegrunnlag',
    DagerIgjen = 'dagerIgjen',
    Medlemskap = 'medlemskap',
    Arbeidsuførhet = 'arbeidsuførhet',
    Institusjonsopphold = 'institusjonsopphold',
}

export const oppfyltInstitusjonsopphold = () => ({
    godkjenttidspunkt: dayjs('2020-10-05'),
});

export const oppfyltMedlemskap = () => ({
    oppfylt: true,
});

export const ikkeOppfyltOpptjening = () => ({
    antallOpptjeningsdagerErMinst: 0,
    opptjeningFra: dayjs('2018-11-21'),
    oppfylt: false,
});

export const oppfyltSøknadsfrist = () => ({
    søknadTom: dayjs('2020-03-27'),
    sendtNav: dayjs('2020-04-16T00:00:00'),
    oppfylt: true,
});

export const oppfyltSykepengegrunnlag = () => ({
    sykepengegrunnlag: 300000,
    grunnebeløp: 99858,
    oppfylt: true,
});

export const oppfyltDagerIgjen = () => ({
    dagerBrukt: 50,
    skjæringstidspunkt: dayjs('2020-01-20'),
    førsteSykepengedag: dayjs('2020-03-02'),
    maksdato: dayjs('2020-12-30'),
    gjenståendeDager: 198,
    tidligerePerioder: [],
    oppfylt: true,
});

export const oppfyltAlder = () => ({
    alderSisteSykedag: 19,
    oppfylt: true,
});

export const ikkeOppfyltAlder = () => ({
    alder: { oppfylt: false, alderSisteSykedag: 90 },
});

export const påfølgende = () => ({
    periodetype: Periodetype.Forlengelse,
});

export const infotrygdforlengelse = () => ({
    periodetype: Periodetype.Infotrygdforlengelse,
    forlengelseFraInfotrygd: SpleisForlengelseFraInfotrygd.JA,
});

export const ferdigbehandlet = () => ({
    tilstand: SpleisVedtaksperiodetilstand.Utbetalt,
    godkjenttidspunkt: dayjs(),
    godkjentAv: 'En Saksbehandler',
    behandlet: true,
});

export const ferdigbehandletAutomatisk = () => ({
    ...ferdigbehandlet(),
    automatiskBehandlet: true,
});

type PersonMedModifiserteVilkårOptions = {
    vedtaksperiodeverdier?: { [K in keyof Partial<Vedtaksperiode>]: any }[];
    vilkårverdier?: { [K in keyof Partial<VilkårType>]: any }[];
};

export const personMedModifiserteVilkår = async ({
    vedtaksperiodeverdier,
    vilkårverdier,
}: PersonMedModifiserteVilkårOptions): Promise<Person> => {
    if (vedtaksperiodeverdier && vilkårverdier && vedtaksperiodeverdier.length !== vilkårverdier.length) {
        throw Error('Antall vedtaksperioder og vilkår må stemme overens.');
    }
    const antallPerioder = Math.max(vilkårverdier?.length ?? 0, vedtaksperiodeverdier?.length ?? 0);
    const person = await mappetPerson();
    let sisteTom: Dayjs | undefined;
    const vedtaksperioder = await Promise.all(
        Array(antallPerioder)
            .fill({})
            .map(async (_, i) => {
                const periode = sisteTom
                    ? await mappetVedtaksperiode(sisteTom.add(1, 'day'), sisteTom.add(10, 'day'))
                    : await mappetVedtaksperiode();
                sisteTom = periode.tom;
                return {
                    ...periode,
                    ...vedtaksperiodeverdier?.[i],
                    vilkår: {
                        ...periode.vilkår,
                        ...vilkårverdier?.[i],
                    },
                };
            })
    );
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

export const renderVilkår = (person: Person) =>
    render(<Vilkår person={person} vedtaksperiode={person.arbeidsgivere[0].vedtaksperioder[0] as Vedtaksperiode} />);

export const expectGroupToContainVisible = (groupName: Group, ...ids: TestId[]) => {
    const group = screen.getByTestId(groupName);
    expect(group).toBeVisible();
    expectHTMLGroupToContainVisible(group, ...ids);
};

export const expectHTMLGroupToContainVisible = (group: HTMLElement, ...ids: TestId[]) => {
    ids.forEach((id) => expect(within(group).getByTestId(id)).toBeVisible());
};

export const expectGroupsToNotExist = (...groups: Group[]) =>
    groups.forEach((group) => expect(screen.queryByTestId(group)).toBeNull());

interface EnSpeilVedtaksperiodeOptions {
    vilkår: VilkårType;
    behandlet?: boolean;
    forlengelseFraInfotrygd?: boolean;
    automatiskBehandlet?: boolean;
    periodetype?: Periodetype;
}

export const enSpeilVedtaksperiode = async ({
    vilkår,
    behandlet = false,
    forlengelseFraInfotrygd = false,
    automatiskBehandlet = false,
    periodetype = Periodetype.Førstegangsbehandling,
}: EnSpeilVedtaksperiodeOptions): Promise<Vedtaksperiode> => {
    const { vedtaksperiode } = new VedtaksperiodeBuilder()
        .setVedtaksperiode(umappetVedtaksperiode())
        .setArbeidsgiver({ organisasjonsnummer: '123456789' } as SpesialistArbeidsgiver)
        .setOverstyringer([])
        .build();
    return {
        ...vedtaksperiode,
        vilkår,
        behandlet,
        forlengelseFraInfotrygd,
        automatiskBehandlet,
        periodetype,
    } as Vedtaksperiode;
};

const harVilkårstype = (vilkårstype: Vilkårstype) => (vilkårdata: Vilkårdata) => vilkårdata.type === vilkårstype;

const assertHarVilkår = (key: keyof KategoriserteVilkår, type: Vilkårstype, result: HookResult<KategoriserteVilkår>) =>
    expect(result.current[key]?.filter(harVilkårstype(type))).toHaveLength(1);

export const assertHarOppfyltVilkår = (type: Vilkårstype, result: HookResult<KategoriserteVilkår>) =>
    assertHarVilkår('oppfylteVilkår', type, result);

export const assertHarIkkeOppfyltVilkår = (type: Vilkårstype, result: HookResult<KategoriserteVilkår>) =>
    assertHarVilkår('ikkeOppfylteVilkår', type, result);

export const assertHarAutomatiskVurdertVilkår = (type: Vilkårstype, result: HookResult<KategoriserteVilkår>) =>
    assertHarVilkår('vilkårVurdertAutomatisk', type, result);

export const assertHarVilkårVurdertAvSaksbehandler = (type: Vilkårstype, result: HookResult<KategoriserteVilkår>) =>
    assertHarVilkår('vilkårVurdertAvSaksbehandler', type, result);

export const assertHarVilkårVurdertIInfotrygd = (type: Vilkårstype, result: HookResult<KategoriserteVilkår>) =>
    assertHarVilkår('vilkårVurdertIInfotrygd', type, result);

export const assertHarVilkårVurdertFørstePeriode = (type: Vilkårstype, result: HookResult<KategoriserteVilkår>) =>
    assertHarVilkår('vilkårVurdertFørstePeriode', type, result);
