import React from 'react';
import { screen } from '@testing-library/react';
import { Vilkår } from './Vilkår';
import '@testing-library/jest-dom/extend-expect';
import {
    expectGroupsToNotExist,
    expectGroupToContainVisible,
    expectHTMLGroupToContainVisible,
    ferdigbehandlet,
    ferdigbehandletAutomatisk,
    ikkeOppfyltAlder,
    infotrygdforlengelse,
    oppfyltInstitusjonsopphold,
    personMedModifiserteVilkår,
    påfølgende,
    renderVilkår,
} from './testutils';

describe('Vilkår', () => {
    describe('førstegangsbehandling', () => {
        it('har alle vilkår oppfylt', async () => {
            const medAlleVilkårOppfylt = await personMedModifiserteVilkår({
                vedtaksperiodeverdier: [oppfyltInstitusjonsopphold()],
            });
            await renderVilkår(medAlleVilkårOppfylt);

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
            const medNoenVilkårIkkeOppfylt = await personMedModifiserteVilkår({
                vilkårverdier: [{ opptjening: { oppfylt: false } }],
            });

            await renderVilkår(medNoenVilkårIkkeOppfylt);

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
            const medGodkjentPeriode = await personMedModifiserteVilkår({ vedtaksperiodeverdier: [ferdigbehandlet()] });
            await renderVilkår(medGodkjentPeriode);

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
            const medGodkjentPeriode = await personMedModifiserteVilkår({
                vedtaksperiodeverdier: [{ automatiskBehandlet: true, behandlet: true }],
            });
            await renderVilkår(medGodkjentPeriode);

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
            const påfølgendeMedOppfylteVilkår = await personMedModifiserteVilkår({
                vedtaksperiodeverdier: [{ ...oppfyltInstitusjonsopphold(), ...påfølgende() }, ferdigbehandlet()],
            });
            await renderVilkår(påfølgendeMedOppfylteVilkår);

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
            const utenOppfyltAlder = await personMedModifiserteVilkår({
                vedtaksperiodeverdier: [påfølgende(), ferdigbehandlet()],
                vilkårverdier: [ikkeOppfyltAlder(), {}],
            });
            await renderVilkår(utenOppfyltAlder);

            expectGroupToContainVisible('ikke-oppfylte-vilkår', 'alder');
            expectGroupToContainVisible('oppfylte-vilkår', 'søknadsfrist', 'dagerIgjen', 'arbeidsuførhet');
            expectGroupToContainVisible('vurdert-av-saksbehandler', 'opptjening', 'sykepengegrunnlag', 'medlemskap');
            expectGroupToContainVisible('ikke-vurderte-vilkår', 'institusjonsopphold');
            expectGroupsToNotExist('vurdert-automatisk', 'vurdert-i-infotrygd');
        });
        it('er godkjent', async () => {
            const medGodkjenteVedtaksperioder = await personMedModifiserteVilkår({
                vedtaksperiodeverdier: [{ ...påfølgende(), ...ferdigbehandlet() }, ferdigbehandlet()],
            });
            await renderVilkår(medGodkjenteVedtaksperioder);

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
            const medAutomatiskGodkjenning = await personMedModifiserteVilkår({
                vedtaksperiodeverdier: [{ ...påfølgende(), ...ferdigbehandletAutomatisk() }, ferdigbehandlet()],
            });
            await renderVilkår(medAutomatiskGodkjenning);

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
    describe('forlengelse fra Infotrygd', () => {
        it('har alle vilkår oppfylt', async () => {
            const infotrygdforlengelseMedOppfylteVilkår = await personMedModifiserteVilkår({
                vedtaksperiodeverdier: [{ ...oppfyltInstitusjonsopphold(), ...infotrygdforlengelse() }],
            });
            renderVilkår(infotrygdforlengelseMedOppfylteVilkår);

            expectGroupToContainVisible(
                'oppfylte-vilkår',
                'alder',
                'søknadsfrist',
                'dagerIgjen',
                'arbeidsuførhet',
                'institusjonsopphold'
            );

            expectGroupToContainVisible('vurdert-i-infotrygd', 'opptjening', 'sykepengegrunnlag', 'medlemskap');

            expectGroupsToNotExist(
                'vurdert-automatisk',
                'vurdert-av-saksbehandler',
                'ikke-oppfylte-vilkår',
                'ikke-vurderte-vilkår'
            );
        });
        it('har noen vilkår ikke oppfylt', async () => {
            const infotrygdforlengelseMedIkkeOppfyltAlder = await personMedModifiserteVilkår({
                vedtaksperiodeverdier: [infotrygdforlengelse()],
                vilkårverdier: [ikkeOppfyltAlder()],
            });
            renderVilkår(infotrygdforlengelseMedIkkeOppfyltAlder);

            expectGroupToContainVisible('oppfylte-vilkår', 'søknadsfrist', 'dagerIgjen', 'arbeidsuførhet');
            expectGroupToContainVisible('ikke-vurderte-vilkår', 'institusjonsopphold');
            expectGroupToContainVisible('ikke-oppfylte-vilkår', 'alder');
            expectGroupToContainVisible('vurdert-i-infotrygd', 'opptjening', 'sykepengegrunnlag', 'medlemskap');

            expectGroupsToNotExist('vurdert-automatisk', 'vurdert-av-saksbehandler');
        });
        it('er godkjent', async () => {
            const medGodkjenteVedtaksperioder = await personMedModifiserteVilkår({
                vedtaksperiodeverdier: [{ ...infotrygdforlengelse(), ...ferdigbehandlet() }],
            });
            await renderVilkår(medGodkjenteVedtaksperioder);

            expectGroupToContainVisible(
                'vurdert-av-saksbehandler',
                'alder',
                'søknadsfrist',
                'dagerIgjen',
                'institusjonsopphold',
                'arbeidsuførhet'
            );

            expectGroupToContainVisible('vurdert-i-infotrygd', 'opptjening', 'sykepengegrunnlag', 'medlemskap');

            expectGroupsToNotExist(
                'vurdert-automatisk',
                'oppfylte-vilkår',
                'ikke-oppfylte-vilkår',
                'ikke-vurderte-vilkår'
            );
        });
        it('er automatisk godkjent', async () => {
            const medGodkjenteVedtaksperioder = await personMedModifiserteVilkår({
                vedtaksperiodeverdier: [{ ...infotrygdforlengelse(), ...ferdigbehandletAutomatisk() }],
            });
            await renderVilkår(medGodkjenteVedtaksperioder);

            expectGroupToContainVisible(
                'vurdert-automatisk',
                'alder',
                'søknadsfrist',
                'dagerIgjen',
                'institusjonsopphold',
                'arbeidsuførhet'
            );

            expectGroupToContainVisible('vurdert-i-infotrygd', 'opptjening', 'sykepengegrunnlag', 'medlemskap');

            expectGroupsToNotExist(
                'vurdert-av-saksbehandler',
                'oppfylte-vilkår',
                'ikke-oppfylte-vilkår',
                'ikke-vurderte-vilkår'
            );
        });
    });
});
