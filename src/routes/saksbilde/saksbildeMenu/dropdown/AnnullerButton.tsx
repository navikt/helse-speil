import React, { ReactElement, useState } from 'react';

import { Dropdown } from '@navikt/ds-react';

import { ArbeidsgiverFragment, BeregnetPeriodeFragment, Maybe, PersonFragment, Utbetalingstatus } from '@io/graphql';
import { AnnulleringsModal } from '@saksbilde/annullering/AnnulleringsModal';
import { harPeriodeTilBeslutterFor } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/inntektOgRefusjonUtils';
import { isBeregnetPeriode } from '@utils/typeguards';

interface AnnullerButtonWithContentProps {
    vedtaksperiodeId: string;
    utbetalingId: string;
    arbeidsgiverFagsystemId: string;
    personFagsystemId: string;
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
}

const AnnullerButtonWithContent = ({
    utbetalingId,
    arbeidsgiverFagsystemId,
    personFagsystemId,
    vedtaksperiodeId,
    aktørId,
    fødselsnummer,
    organisasjonsnummer,
}: AnnullerButtonWithContentProps): ReactElement => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Dropdown.Menu.List.Item onClick={() => setShowModal(true)}>Annuller</Dropdown.Menu.List.Item>
            {showModal && (
                <AnnulleringsModal
                    onClose={() => setShowModal(false)}
                    showModal={showModal}
                    fødselsnummer={fødselsnummer}
                    aktørId={aktørId}
                    organisasjonsnummer={organisasjonsnummer}
                    vedtaksperiodeId={vedtaksperiodeId}
                    utbetalingId={utbetalingId}
                    arbeidsgiverFagsystemId={arbeidsgiverFagsystemId}
                    personFagsystemId={personFagsystemId}
                />
            )}
        </>
    );
};

const kanAnnullere = (harBeslutteroppgavePåSykefraværet: boolean, harMinstEnUtbetaltPeriode: boolean): boolean => {
    return !harBeslutteroppgavePåSykefraværet && harMinstEnUtbetaltPeriode;
};

interface AnnullerButtonProps {
    person: PersonFragment;
    periode: BeregnetPeriodeFragment;
    arbeidsgiver: ArbeidsgiverFragment;
}

export const AnnullerButton = ({ person, periode, arbeidsgiver }: AnnullerButtonProps): Maybe<ReactElement> => {
    const harMinstEnUtbetaltPeriode =
        arbeidsgiver.generasjoner
            .flatMap((it) => it.perioder)
            .filter(
                (it) =>
                    isBeregnetPeriode(it) &&
                    it.skjaeringstidspunkt === periode.skjaeringstidspunkt &&
                    it.utbetaling.vurdering?.godkjent === true &&
                    it.utbetaling.status !== Utbetalingstatus.Annullert,
            ).length !== 0;
    const harBeslutteroppgavePåSykefraværet = harPeriodeTilBeslutterFor(person, periode.skjaeringstidspunkt);

    if (!kanAnnullere(harBeslutteroppgavePåSykefraværet, harMinstEnUtbetaltPeriode)) {
        return null;
    }

    return (
        <AnnullerButtonWithContent
            vedtaksperiodeId={periode.vedtaksperiodeId}
            utbetalingId={periode.utbetaling.id}
            arbeidsgiverFagsystemId={periode.utbetaling.arbeidsgiverFagsystemId}
            personFagsystemId={periode.utbetaling.personFagsystemId}
            aktørId={person.aktorId}
            fødselsnummer={person.fodselsnummer}
            organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
        />
    );
};
