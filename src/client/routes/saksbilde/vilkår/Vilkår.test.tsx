import '@testing-library/jest-dom/extend-expect';
import { screen } from '@testing-library/react';
import React from 'react';

import { Vilkår } from './Vilkår';
import {
    expectGroupsToNotExist,
    expectGroupToContainVisible,
    expectHTMLGroupToContainVisible,
    ferdigbehandlet,
    ferdigbehandletAutomatisk,
    Group,
    ikkeOppfyltAlder,
    infotrygdforlengelse,
    oppfyltInstitusjonsopphold,
    personMedModifiserteVilkår,
    påfølgende,
    renderVilkår,
    TestId,
} from './testutils';

describe('Vilkår', () => {
    describe('førstegangsbehandling', () => {
        it('har alle vilkår oppfylt', async () => {
            const medAlleVilkårOppfylt = await personMedModifiserteVilkår({
                vedtaksperiodeverdier: [oppfyltInstitusjonsopphold()],
            });
            await renderVilkår(medAlleVilkårOppfylt);

            expectGroupToContainVisible(
                Group.OppfylteVilkår,
                TestId.Alder,
                TestId.Søknadsfrist,
                TestId.Opptjening,
                TestId.Sykepengegrunnlag,
                TestId.DagerIgjen,
                TestId.Medlemskap,
                TestId.Arbeidsuførhet,
                TestId.Institusjonsopphold
            );

            expectGroupsToNotExist(
                Group.VurdertAvSaksbehandler,
                Group.VurdertAutomatisk,
                Group.VurdertIInfotrygd,
                Group.IkkeOppfylteVilkår,
                Group.IkkeVurderteVilkår
            );
        });
        it('har noen vilkår ikke oppfylt', async () => {
            const medNoenVilkårIkkeOppfylt = await personMedModifiserteVilkår({
                vilkårverdier: [{ opptjening: { oppfylt: false } }],
            });

            await renderVilkår(medNoenVilkårIkkeOppfylt);

            expectGroupToContainVisible(
                Group.OppfylteVilkår,
                TestId.Alder,
                TestId.Søknadsfrist,
                TestId.Sykepengegrunnlag,
                TestId.DagerIgjen,
                TestId.Medlemskap,
                TestId.Arbeidsuførhet,
                TestId.Institusjonsopphold
            );

            expectGroupToContainVisible(Group.IkkeOppfylteVilkår, TestId.Opptjening);
            expectGroupsToNotExist(Group.VurdertAvSaksbehandler, Group.VurdertAutomatisk, Group.VurdertIInfotrygd);
        });
        it('er godkjent', async () => {
            const medGodkjentPeriode = await personMedModifiserteVilkår({ vedtaksperiodeverdier: [ferdigbehandlet()] });
            await renderVilkår(medGodkjentPeriode);

            expectGroupToContainVisible(
                Group.VurdertAvSaksbehandler,
                TestId.Alder,
                TestId.Søknadsfrist,
                TestId.Sykepengegrunnlag,
                TestId.DagerIgjen,
                TestId.Medlemskap,
                TestId.Arbeidsuførhet,
                TestId.Institusjonsopphold,
                TestId.Opptjening
            );

            expectGroupsToNotExist(
                Group.VurdertAutomatisk,
                Group.VurdertIInfotrygd,
                Group.IkkeOppfylteVilkår,
                Group.IkkeVurderteVilkår
            );
        });
        it('er automatisk godkjent', async () => {
            const medGodkjentPeriode = await personMedModifiserteVilkår({
                vedtaksperiodeverdier: [{ automatiskBehandlet: true, behandlet: true }],
            });
            await renderVilkår(medGodkjentPeriode);

            expectGroupToContainVisible(
                Group.VurdertAutomatisk,
                TestId.Alder,
                TestId.Søknadsfrist,
                TestId.Sykepengegrunnlag,
                TestId.DagerIgjen,
                TestId.Medlemskap,
                TestId.Arbeidsuførhet,
                TestId.Institusjonsopphold,
                TestId.Opptjening
            );

            expectGroupsToNotExist(
                Group.VurdertAvSaksbehandler,
                Group.VurdertIInfotrygd,
                Group.IkkeOppfylteVilkår,
                Group.IkkeVurderteVilkår
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
                Group.OppfylteVilkår,
                TestId.Alder,
                TestId.Søknadsfrist,
                TestId.DagerIgjen,
                TestId.Arbeidsuførhet,
                TestId.Institusjonsopphold
            );

            expectGroupToContainVisible(
                Group.VurdertAvSaksbehandler,
                TestId.Opptjening,
                TestId.Sykepengegrunnlag,
                TestId.Medlemskap
            );

            expectGroupsToNotExist(
                Group.VurdertAutomatisk,
                Group.VurdertIInfotrygd,
                Group.IkkeOppfylteVilkår,
                Group.IkkeVurderteVilkår
            );
        });
        it('har noen vilkår ikke oppfylt', async () => {
            const utenOppfyltAlder = await personMedModifiserteVilkår({
                vedtaksperiodeverdier: [påfølgende(), ferdigbehandlet()],
                vilkårverdier: [ikkeOppfyltAlder(), {}],
            });
            await renderVilkår(utenOppfyltAlder);

            expectGroupToContainVisible(Group.IkkeOppfylteVilkår, TestId.Alder);
            expectGroupToContainVisible(
                Group.OppfylteVilkår,
                TestId.Søknadsfrist,
                TestId.DagerIgjen,
                TestId.Arbeidsuførhet,
                TestId.Institusjonsopphold
            );
            expectGroupToContainVisible(
                Group.VurdertAvSaksbehandler,
                TestId.Opptjening,
                TestId.Sykepengegrunnlag,
                TestId.Medlemskap
            );
            expectGroupsToNotExist(Group.VurdertAutomatisk, Group.VurdertIInfotrygd);
        });
        it('er godkjent', async () => {
            const medGodkjenteVedtaksperioder = await personMedModifiserteVilkår({
                vedtaksperiodeverdier: [{ ...påfølgende(), ...ferdigbehandlet() }, ferdigbehandlet()],
            });
            await renderVilkår(medGodkjenteVedtaksperioder);

            const [vilkårVurdertDennePerioden, vilkårVurdertVedSkjeringstidspunkt] = screen.getAllByTestId(
                Group.VurdertAvSaksbehandler
            );

            expect(vilkårVurdertDennePerioden).toBeVisible();
            expectHTMLGroupToContainVisible(
                vilkårVurdertDennePerioden,
                TestId.Alder,
                TestId.Søknadsfrist,
                TestId.DagerIgjen,
                TestId.Institusjonsopphold,
                TestId.Arbeidsuførhet
            );

            expect(vilkårVurdertVedSkjeringstidspunkt).toBeVisible();
            expectHTMLGroupToContainVisible(
                vilkårVurdertVedSkjeringstidspunkt,
                TestId.Opptjening,
                TestId.Sykepengegrunnlag,
                TestId.Medlemskap
            );

            expectGroupsToNotExist(
                Group.VurdertAutomatisk,
                Group.VurdertIInfotrygd,
                Group.OppfylteVilkår,
                Group.IkkeOppfylteVilkår,
                Group.IkkeVurderteVilkår
            );
        });
        it('er automatisk godkjent', async () => {
            const medAutomatiskGodkjenning = await personMedModifiserteVilkår({
                vedtaksperiodeverdier: [{ ...påfølgende(), ...ferdigbehandletAutomatisk() }, ferdigbehandlet()],
            });
            await renderVilkår(medAutomatiskGodkjenning);

            expectGroupToContainVisible(
                Group.VurdertAutomatisk,
                TestId.Alder,
                TestId.Søknadsfrist,
                TestId.DagerIgjen,
                TestId.Institusjonsopphold,
                TestId.Arbeidsuførhet
            );

            expectGroupToContainVisible(
                Group.VurdertAvSaksbehandler,
                TestId.Opptjening,
                TestId.Sykepengegrunnlag,
                TestId.Medlemskap
            );

            expectGroupsToNotExist(
                Group.VurdertIInfotrygd,
                Group.OppfylteVilkår,
                Group.IkkeOppfylteVilkår,
                Group.IkkeVurderteVilkår
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
                Group.OppfylteVilkår,
                TestId.Alder,
                TestId.Søknadsfrist,
                TestId.DagerIgjen,
                TestId.Arbeidsuførhet,
                TestId.Institusjonsopphold
            );

            expectGroupToContainVisible(
                Group.VurdertIInfotrygd,
                TestId.Opptjening,
                TestId.Sykepengegrunnlag,
                TestId.Medlemskap
            );

            expectGroupsToNotExist(
                Group.VurdertAutomatisk,
                Group.VurdertAvSaksbehandler,
                Group.IkkeOppfylteVilkår,
                Group.IkkeVurderteVilkår
            );
        });
        it('har noen vilkår ikke oppfylt', async () => {
            const infotrygdforlengelseMedIkkeOppfyltAlder = await personMedModifiserteVilkår({
                vedtaksperiodeverdier: [infotrygdforlengelse()],
                vilkårverdier: [ikkeOppfyltAlder()],
            });
            renderVilkår(infotrygdforlengelseMedIkkeOppfyltAlder);

            expectGroupToContainVisible(
                Group.OppfylteVilkår,
                TestId.Søknadsfrist,
                TestId.DagerIgjen,
                TestId.Arbeidsuførhet,
                TestId.Institusjonsopphold
            );
            expectGroupToContainVisible(Group.IkkeOppfylteVilkår, TestId.Alder);
            expectGroupToContainVisible(
                Group.VurdertIInfotrygd,
                TestId.Opptjening,
                TestId.Sykepengegrunnlag,
                TestId.Medlemskap
            );

            expectGroupsToNotExist(Group.VurdertAutomatisk, Group.VurdertAvSaksbehandler);
        });
        it('er godkjent', async () => {
            const medGodkjenteVedtaksperioder = await personMedModifiserteVilkår({
                vedtaksperiodeverdier: [{ ...infotrygdforlengelse(), ...ferdigbehandlet() }],
            });
            await renderVilkår(medGodkjenteVedtaksperioder);

            expectGroupToContainVisible(
                Group.VurdertAvSaksbehandler,
                TestId.Alder,
                TestId.Søknadsfrist,
                TestId.DagerIgjen,
                TestId.Institusjonsopphold,
                TestId.Arbeidsuførhet
            );

            expectGroupToContainVisible(
                Group.VurdertIInfotrygd,
                TestId.Opptjening,
                TestId.Sykepengegrunnlag,
                TestId.Medlemskap
            );

            expectGroupsToNotExist(
                Group.VurdertAutomatisk,
                Group.OppfylteVilkår,
                Group.IkkeOppfylteVilkår,
                Group.IkkeVurderteVilkår
            );
        });
        it('er automatisk godkjent', async () => {
            const medGodkjenteVedtaksperioder = await personMedModifiserteVilkår({
                vedtaksperiodeverdier: [{ ...infotrygdforlengelse(), ...ferdigbehandletAutomatisk() }],
            });
            await renderVilkår(medGodkjenteVedtaksperioder);

            expectGroupToContainVisible(
                Group.VurdertAutomatisk,
                TestId.Alder,
                TestId.Søknadsfrist,
                TestId.DagerIgjen,
                TestId.Institusjonsopphold,
                TestId.Arbeidsuførhet
            );

            expectGroupToContainVisible(
                Group.VurdertIInfotrygd,
                TestId.Opptjening,
                TestId.Sykepengegrunnlag,
                TestId.Medlemskap
            );

            expectGroupsToNotExist(
                Group.VurdertAvSaksbehandler,
                Group.OppfylteVilkår,
                Group.IkkeOppfylteVilkår,
                Group.IkkeVurderteVilkår
            );
        });
    });
});
