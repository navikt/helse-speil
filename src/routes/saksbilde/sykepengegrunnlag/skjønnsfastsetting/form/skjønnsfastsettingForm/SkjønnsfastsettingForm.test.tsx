import { createStore } from 'jotai';
import React from 'react';

import { SkjønnsfastsettingMal } from '@external/sanity';
import { SkjønnsfastsettingForm } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/skjønnsfastsettingForm/SkjønnsfastsettingForm';
import { usePostSkjønnsfastsattSykepengegrunnlag } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/skjønnsfastsetting';
import { PersonStoreContext } from '@state/contexts/personStore';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enArbeidsgiverinntekt } from '@test-data/arbeidsgiverinntekt';
import { enGenerasjon } from '@test-data/generasjon';
import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { etVilkårsgrunnlagFraSpleis } from '@test-data/vilkårsgrunnlag';
import { render, screen } from '@test-utils';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('@saksbilde/sykepengegrunnlag/skjønnsfastsetting/skjønnsfastsetting');

describe('SkjønnsfastsettingForm', () => {
    const periode = enBeregnetPeriode();
    const periode2 = enBeregnetPeriode();
    const generasjon = enGenerasjon({ perioder: [periode] });
    const generasjon2 = enGenerasjon({ perioder: [periode2] });
    const arbeidsgiver = enArbeidsgiver({ generasjoner: [generasjon] });
    const arbeidsgiver2 = enArbeidsgiver({
        generasjoner: [generasjon2],
        organisasjonsnummer: '123456789',
        navn: 'Arbeidsgiver to',
    });
    const arbeidsgiver3 = enArbeidsgiver({
        generasjoner: [],
        organisasjonsnummer: '123456710',
        navn: 'Arbeidsgiver tre',
    });
    const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis().medInntekter([
        enArbeidsgiverinntekt({ arbeidsgiver: arbeidsgiver.organisasjonsnummer }),
        enArbeidsgiverinntekt({ arbeidsgiver: arbeidsgiver2.organisasjonsnummer }),
        enArbeidsgiverinntekt({ arbeidsgiver: arbeidsgiver3.organisasjonsnummer, deaktivert: true }),
    ]);
    const person = enPerson({
        vilkarsgrunnlagV2: [vilkårsgrunnlag],
        arbeidsgivere: [arbeidsgiver, arbeidsgiver2, arbeidsgiver3],
    });

    const malMed25Avvik = {
        _id: '2',
        iProd: true,
        arbeidsforholdMal: [],
        arsak: 'Testårsak med 25 % avvik',
        begrunnelse: 'Testbegrunnelse med 25 % avvik',
        konklusjon: 'Testkonklusjon med 25 % avvik',
        lovhjemmel: {
            ledd: '2',
            bokstav: 'bokstav',
            lovverk: 'lovverk',
            lovverksversjon: 'lovverkversjon',
            paragraf: 'paragraf',
        },
    };
    const enMal = {
        _id: '1',
        iProd: true,
        arbeidsforholdMal: [],
        arsak: 'Testårsak',
        begrunnelse: 'Testbegrunnelse',
        konklusjon: 'Testkonklusjon',
        lovhjemmel: {
            ledd: 'ledd',
            bokstav: 'bokstav',
            lovverk: 'lovverk',
            lovverksversjon: 'lovverkversjon',
            paragraf: 'paragraf',
        },
    };
    const maler: SkjønnsfastsettingMal[] = [enMal, malMed25Avvik];

    (usePostSkjønnsfastsattSykepengegrunnlag as jest.Mock).mockReturnValue({
        isLoading: false,
        error: null,
        timedOut: false,
        setTimedOut: () => {},
        postSkjønnsfastsetting: () => {},
    });

    it('viser årsaker fra maler', async () => {
        renderWithProvider(
            <SkjønnsfastsettingForm
                person={person}
                periode={periode}
                inntekter={vilkårsgrunnlag.inntekter}
                omregnetÅrsinntekt={Number(vilkårsgrunnlag.avviksvurdering!.beregningsgrunnlag)}
                sammenligningsgrunnlag={Number(vilkårsgrunnlag.avviksvurdering!.sammenligningsgrunnlag)}
                sykepengegrunnlagsgrense={vilkårsgrunnlag.sykepengegrunnlagsgrense}
                onEndretSykepengegrunnlag={jest.fn}
                closeAndResetForm={jest.fn()}
                maler={maler}
                sisteSkjønnsfastsettelse={null}
                formValues={null}
                setFormValues={jest.fn}
            />,
        );
        expect(await screen.findByText(maler[0]?.arsak as string)).toBeInTheDocument();
        expect(await screen.findByText(maler[1]?.arsak as string)).toBeInTheDocument();
    });
    it('viser skjønnsfastsettingstyper ved valg av 25 % avvik som årsak', async () => {
        renderWithProvider(
            <SkjønnsfastsettingForm
                person={person}
                periode={periode}
                inntekter={vilkårsgrunnlag.inntekter}
                omregnetÅrsinntekt={Number(vilkårsgrunnlag.avviksvurdering!.beregningsgrunnlag)}
                sammenligningsgrunnlag={Number(vilkårsgrunnlag.avviksvurdering!.sammenligningsgrunnlag)}
                sykepengegrunnlagsgrense={vilkårsgrunnlag.sykepengegrunnlagsgrense}
                onEndretSykepengegrunnlag={jest.fn}
                closeAndResetForm={jest.fn()}
                maler={maler}
                sisteSkjønnsfastsettelse={null}
                formValues={null}
                setFormValues={jest.fn}
            />,
        );

        fireEvent.click(screen.getByText(malMed25Avvik.arsak));
        expect(await screen.findByText('Velg type skjønnsfastsettelse')).toBeInTheDocument();
        expect(screen.queryByText('Skjønnsfastsett arbeidsgivere')).not.toBeInTheDocument();
        fireEvent.click(screen.getByText('Skjønnsfastsette til omregnet årsinntekt'));
        expect(await screen.findByText('Skjønnsfastsett arbeidsgivere')).toBeInTheDocument();
    });
    it('skal ha validering av input uten fordeling', async () => {
        const user = userEvent.setup();

        renderWithProvider(
            <SkjønnsfastsettingForm
                person={person}
                periode={periode}
                inntekter={vilkårsgrunnlag.inntekter}
                omregnetÅrsinntekt={Number(vilkårsgrunnlag.avviksvurdering!.beregningsgrunnlag)}
                sammenligningsgrunnlag={Number(vilkårsgrunnlag.avviksvurdering!.sammenligningsgrunnlag)}
                sykepengegrunnlagsgrense={vilkårsgrunnlag.sykepengegrunnlagsgrense}
                onEndretSykepengegrunnlag={jest.fn}
                closeAndResetForm={jest.fn()}
                maler={maler}
                sisteSkjønnsfastsettelse={null}
                formValues={null}
                setFormValues={jest.fn}
            />,
        );

        await user.click(screen.getByText(enMal.arsak));
        await user.type(screen.getAllByLabelText('Skjønnsfastsatt årlig inntekt')[0]!, 'ikke et tall');
        await user.click(screen.getByText('Lagre'));

        expect(await screen.findByText('Skjemaet inneholder følgende feil:')).toBeInTheDocument();
        expect(screen.getAllByText('Årsinntekt må være et tall')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Du må skrive en nærmere begrunnelse')[0]).toBeInTheDocument();

        await user.type(screen.getAllByLabelText('Skjønnsfastsatt årlig inntekt')[0]!, `${1000}`);
        await user.click(screen.getByText('Lagre'));

        expect(await screen.findByText('Skjemaet inneholder følgende feil:')).toBeInTheDocument();
        expect(screen.getAllByText('Du må skrive en nærmere begrunnelse')[0]).toBeInTheDocument();

        const begrunnelseinput = screen.getAllByRole('textbox').find((it) => it.nodeName === 'TEXTAREA') ?? null;
        expect(begrunnelseinput).not.toBeNull();
        await user.type(begrunnelseinput!, 'En beskrivelse');

        await user.click(screen.getByText('Lagre'));

        expect(screen.queryByLabelText('Skjemaet inneholder følgende feil:')).not.toBeInTheDocument();
    });
    it('skal ikke ta med deaktiverte arbeidsforhold i skjønnsfastsettingen', async () => {
        const user = userEvent.setup();

        renderWithProvider(
            <SkjønnsfastsettingForm
                person={person}
                periode={periode}
                inntekter={vilkårsgrunnlag.inntekter}
                omregnetÅrsinntekt={Number(vilkårsgrunnlag.avviksvurdering!.beregningsgrunnlag)}
                sammenligningsgrunnlag={Number(vilkårsgrunnlag.avviksvurdering!.sammenligningsgrunnlag)}
                sykepengegrunnlagsgrense={vilkårsgrunnlag.sykepengegrunnlagsgrense}
                onEndretSykepengegrunnlag={jest.fn}
                closeAndResetForm={jest.fn()}
                maler={maler}
                sisteSkjønnsfastsettelse={null}
                formValues={null}
                setFormValues={jest.fn}
            />,
        );

        await user.click(screen.getByText(malMed25Avvik.arsak));
        await user.click(screen.getByText('Skjønnsfastsette til omregnet årsinntekt'));

        expect(await screen.findByText(arbeidsgiver.navn)).toBeInTheDocument();
        expect(await screen.findByText(arbeidsgiver2.navn)).toBeInTheDocument();
        expect(screen.queryByText(arbeidsgiver3.navn)).not.toBeInTheDocument();
    });

    it('skal ha validering av at inntekt fordeles ved skjønnsfastsettelse til rapportert', async () => {
        const user = userEvent.setup();

        (usePostSkjønnsfastsattSykepengegrunnlag as jest.Mock).mockReturnValue({
            isLoading: false,
            error: null,
            timedOut: false,
            setTimedOut: () => {},
            postSkjønnsfastsetting: () => {},
        });

        renderWithProvider(
            <SkjønnsfastsettingForm
                person={person}
                periode={periode}
                inntekter={vilkårsgrunnlag.inntekter}
                omregnetÅrsinntekt={Number(vilkårsgrunnlag.avviksvurdering!.beregningsgrunnlag)}
                sammenligningsgrunnlag={100000}
                sykepengegrunnlagsgrense={vilkårsgrunnlag.sykepengegrunnlagsgrense}
                onEndretSykepengegrunnlag={jest.fn}
                closeAndResetForm={jest.fn()}
                maler={maler}
                sisteSkjønnsfastsettelse={null}
                formValues={null}
                setFormValues={jest.fn}
            />,
        );

        await user.click(screen.getByText(malMed25Avvik.arsak));
        await user.click(screen.getByText('Skjønnsfastsette til rapportert årsinntekt'));
        await user.click(screen.getByText('Lagre'));

        expect(await screen.findByText('Skjemaet inneholder følgende feil:')).toBeInTheDocument();
        expect(screen.getAllByText('Du må fordele hele sammenligningsgrunnlaget')[0]).toBeInTheDocument();

        const begrunnelseinput = screen.getAllByRole('textbox').find((it) => it.nodeName === 'TEXTAREA') ?? null;
        expect(begrunnelseinput).not.toBeNull();
        await user.type(begrunnelseinput!, 'En beskrivelse');
        const inputs = screen.getAllByLabelText('Skjønnsfastsatt årlig inntekt');

        await user.type(inputs[0]!, '50000');
        await user.type(inputs[1]!, '50000');

        await user.click(screen.getByText('Lagre'));
        const actual = screen.queryByLabelText('Skjemaet inneholder følgende feil:');
        expect(actual).not.toBeInTheDocument();
    });
});

export const renderWithProvider = (ui: React.ReactNode) =>
    render(<PersonStoreContext.Provider value={createStore()}>{ui}</PersonStoreContext.Provider>);
