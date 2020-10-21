import React from 'react';
import dayjs from 'dayjs';
import { render, screen } from '@testing-library/react';
import { Vedtaksperiode, Vilkår } from 'internal-types';
import { KategoriserteVilkår, useKategoriserteVilkår } from './useKategoriserteVilkår';
import '@testing-library/jest-dom/extend-expect';
import { Vilkårstype } from '../../../mapping/vilkår';

const alder = {
    alderSisteSykedag: 50,
    oppfylt: true,
};

const dagerIgjen = {
    dagerBrukt: 0,
    skjæringstidspunkt: dayjs('2020-01-01'),
    førsteSykepengedag: dayjs('2020-01-01'),
    maksdato: dayjs('2021-01-01'),
    gjenståendeDager: 345,
    tidligerePerioder: [],
    oppfylt: true,
};

const sykepengegrunnlag = {
    sykepengegrunnlag: 654321,
    grunnebeløp: 100000,
    oppfylt: true,
};

const opptjening = {
    antallOpptjeningsdagerErMinst: 300,
    opptjeningFra: dayjs('2019-01-01'),
    oppfylt: true,
};

const søknadsfrist = {
    søknadTom: dayjs('2020-01-31'),
    sendtNav: dayjs('2020-01-31'),
    oppfylt: true,
};

const vilkår: Vilkår = {
    alder,
    dagerIgjen,
    sykepengegrunnlag,
    opptjening,
    søknadsfrist,
};

type VilkårProp = { vilkår: Vilkår };

const KategoriserteVilkårWrapper = (vilkår: VilkårProp) => {
    const kategoriserteVilkår = useKategoriserteVilkår(vilkår as Vedtaksperiode) as KategoriserteVilkår;

    const labelDict: { [key: string]: string } = {
        'Under 70 år': 'alder',
        Søknadsfrist: 'søknadsfrist',
        Opptjening: 'opptjening',
        'Krav til minste sykepengegrunnlag': 'sykepengegrunnlag',
        'Dager igjen': 'dagerIgjen',
    };

    return (
        <>
            <div data-testid="oppfylteVilkår">
                {kategoriserteVilkår.oppfylteVilkår.map((vilkår) => (
                    <div key={vilkår.type}>{vilkår.type} er oppfylt</div>
                ))}
            </div>
            <div data-testid="ikkeOppfylteVilkår">
                {kategoriserteVilkår.ikkeOppfylteVilkår.map((vilkår) => (
                    <div key={vilkår.type}>{vilkår.type} er ikke oppfylt</div>
                ))}
            </div>
            <div data-testid="ikkeVurderteVilkår">
                {kategoriserteVilkår.ikkeVurderteVilkår.map((vilkår) => (
                    <div key={vilkår.label}>{labelDict[vilkår.label]} er ikke vurdert</div>
                ))}
            </div>
        </>
    );
};

const renderKategoriserteVilkår = async (vilkår: Vilkår) => render(<KategoriserteVilkårWrapper vilkår={vilkår} />);

const assertAlder = (status: 'er oppfylt' | 'er ikke oppfylt' | 'er ikke vurdert') => async () =>
    expect(screen.getByText(`${Vilkårstype.Alder} ${status}`)).toBeInTheDocument();

const assertDagerIgjen = (status: 'er oppfylt' | 'er ikke oppfylt' | 'er ikke vurdert') => async () =>
    expect(screen.getByText(`${Vilkårstype.DagerIgjen} ${status}`)).toBeInTheDocument();

const assertKravTilSykepengegrunnlag = (status: 'er oppfylt' | 'er ikke oppfylt' | 'er ikke vurdert') => async () =>
    expect(screen.getByText(`${Vilkårstype.KravTilSykepengegrunnlag} ${status}`)).toBeInTheDocument();

const assertOpptjening = (status: 'er oppfylt' | 'er ikke oppfylt' | 'er ikke vurdert') => async () =>
    expect(screen.getByText(`${Vilkårstype.Opptjeningstid} ${status}`)).toBeInTheDocument();

const assertSøknadsfrist = (status: 'er oppfylt' | 'er ikke oppfylt' | 'er ikke vurdert') => async () =>
    expect(screen.getByText(`${Vilkårstype.Søknadsfrist} ${status}`)).toBeInTheDocument();

const assertAlleVilkårErOppfylte = async () =>
    Promise.all([
        assertAlder('er oppfylt'),
        assertDagerIgjen('er oppfylt'),
        assertKravTilSykepengegrunnlag('er oppfylt'),
        assertOpptjening('er oppfylt'),
        assertSøknadsfrist('er oppfylt'),
    ]);

describe('useKategoriserteVilkår', () => {
    test('mapper oppfylte vilkår', async () => {
        await renderKategoriserteVilkår(vilkår).then(assertAlleVilkårErOppfylte);
    });
    test('mapper delvis oppfylte vilkår', async () => {
        const ikkeOppfylteVilkår = { dagerIgjen: { ...vilkår.dagerIgjen, oppfylt: false } };
        const delvisOppfylteVilkår = { ...vilkår, ...ikkeOppfylteVilkår };
        await renderKategoriserteVilkår(delvisOppfylteVilkår)
            .then(assertAlder('er oppfylt'))
            .then(assertDagerIgjen('er ikke oppfylt'))
            .then(assertKravTilSykepengegrunnlag('er oppfylt'))
            .then(assertOpptjening('er oppfylt'))
            .then(assertSøknadsfrist('er oppfylt'));
    });
    test('mapper ikke vurderte vilkår', async () => {
        const ikkeOppfylteVilkår = { søknadsfrist: { ...vilkår.søknadsfrist, oppfylt: false } };
        const ikkeVurderteVilkår = { dagerIgjen: { ...vilkår.dagerIgjen, oppfylt: undefined } };
        const delvisVurderteVilkår = { ...vilkår, ...ikkeOppfylteVilkår, ...ikkeVurderteVilkår };
        await renderKategoriserteVilkår(delvisVurderteVilkår)
            .then(assertAlder('er oppfylt'))
            .then(assertDagerIgjen('er ikke vurdert'))
            .then(assertKravTilSykepengegrunnlag('er oppfylt'))
            .then(assertOpptjening('er oppfylt'))
            .then(assertSøknadsfrist('er ikke oppfylt'));
    });
});
