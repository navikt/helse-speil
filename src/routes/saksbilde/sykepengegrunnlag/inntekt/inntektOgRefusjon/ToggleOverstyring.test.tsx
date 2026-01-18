import { Mock, vi } from 'vitest';

import { Periodetilstand } from '@io/graphql';
import { ToggleOverstyring } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/ToggleOverstyring';
import { useActivePeriod } from '@state/periode';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBehandling } from '@test-data/behandling';
import { enBeregnetPeriode, enUberegnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { render, screen } from '@test-utils';

vi.mock('@state/periode');

describe('ToggleOverstyring', () => {
    it('skal vise overstyringsknapp for beregnet periode', () => {
        const periode = enBeregnetPeriode();
        const behandling = enBehandling({ perioder: [periode] });
        const arbeidsgiver = enArbeidsgiver({ behandlinger: [behandling] });
        const person = enPerson({ arbeidsgivere: [arbeidsgiver] });
        (useActivePeriod as Mock).mockReturnValue(periode);
        render(
            <ToggleOverstyring
                person={person}
                arbeidsgiver={arbeidsgiver}
                periode={periode}
                vilkårsgrunnlagId="vilkårsgrunnlagId"
                organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                erDeaktivert={false}
                editing={false}
                setEditing={vi.fn()}
            />,
        );
        expect(screen.getByText('Revurder')).toBeInTheDocument();
    });
    it('skal vise avbryt knapp når editing', () => {
        const periode = enBeregnetPeriode();
        const behandling = enBehandling({ perioder: [periode] });
        const arbeidsgiver = enArbeidsgiver({ behandlinger: [behandling] });
        const person = enPerson({ arbeidsgivere: [arbeidsgiver] });
        (useActivePeriod as Mock).mockReturnValue(periode);
        render(
            <ToggleOverstyring
                person={person}
                arbeidsgiver={arbeidsgiver}
                periode={periode}
                vilkårsgrunnlagId="vilkårsgrunnlagId"
                organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                erDeaktivert={false}
                editing={true}
                setEditing={vi.fn()}
            />,
        );
        expect(screen.getByText('Avbryt')).toBeInTheDocument();
    });
    it('skal ikke vise noe om perioden ikke er i siste behandling', () => {
        const periode = enBeregnetPeriode();
        const valgtPeriode = enBeregnetPeriode();
        const enBehandling1 = enBehandling({ perioder: [periode] });
        const behandling2 = enBehandling({ perioder: [valgtPeriode] });
        const arbeidsgiver = enArbeidsgiver({ behandlinger: [enBehandling1, behandling2] });
        const person = enPerson({ arbeidsgivere: [arbeidsgiver] });
        (useActivePeriod as Mock).mockReturnValue(valgtPeriode);
        const { baseElement } = render(
            <ToggleOverstyring
                person={person}
                arbeidsgiver={arbeidsgiver}
                periode={valgtPeriode}
                vilkårsgrunnlagId="vilkårsgrunnlagId"
                organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                erDeaktivert={false}
                editing={true}
                setEditing={vi.fn()}
            />,
        );
        expect(baseElement.firstChild).toBeEmptyDOMElement();
    });
    describe('skal vise help text når perioden ikke kan overstyres på grunn av', () => {
        it('perioden er uberegnet og ikke lik eller før periode til godkjenning', () => {
            const beregnetPeriode = enBeregnetPeriode({
                periodetilstand: Periodetilstand.TilGodkjenning,
                fom: '2020-01-01',
                tom: '2020-01-31',
            }).medOppgave();
            const valgtPeriode = enUberegnetPeriode({ fom: '2020-02-01', tom: '2020-02-28' });
            const behandling = enBehandling({ perioder: [valgtPeriode, beregnetPeriode] });
            const arbeidsgiver = enArbeidsgiver({ behandlinger: [behandling] });
            const person = enPerson({ arbeidsgivere: [arbeidsgiver] });
            (useActivePeriod as Mock).mockReturnValue(valgtPeriode);
            render(
                <ToggleOverstyring
                    person={person}
                    arbeidsgiver={arbeidsgiver}
                    periode={valgtPeriode}
                    vilkårsgrunnlagId="vilkårsgrunnlagId"
                    organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                    erDeaktivert={false}
                    editing={false}
                    setEditing={vi.fn()}
                />,
            );
            expect(
                screen.getByText('Perioden kan ikke overstyres fordi det finnes en oppgave på en tidligere periode'),
            ).toBeInTheDocument();
        });
        it('perioden er uberegnet og mangler vilkårsgrunnlag', () => {
            const uberegnetPeriode = enUberegnetPeriode();
            const behandling = enBehandling({ perioder: [uberegnetPeriode] });
            const arbeidsgiver = enArbeidsgiver({ behandlinger: [behandling] });
            const person = enPerson({ arbeidsgivere: [arbeidsgiver] });
            (useActivePeriod as Mock).mockReturnValue(uberegnetPeriode);
            render(
                <ToggleOverstyring
                    person={person}
                    arbeidsgiver={arbeidsgiver}
                    periode={uberegnetPeriode}
                    vilkårsgrunnlagId={null}
                    organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                    erDeaktivert={false}
                    editing={false}
                    setEditing={vi.fn()}
                />,
            );
            expect(
                screen.getByText('Perioden kan ikke overstyres fordi den mangler vilkårsgrunnlag'),
            ).toBeInTheDocument();
        });
    });
});
