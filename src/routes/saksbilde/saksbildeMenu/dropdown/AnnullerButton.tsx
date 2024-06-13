import React, { ReactElement, useState } from 'react';

import { Dropdown } from '@navikt/ds-react';

import { ArbeidsgiverFragment, BeregnetPeriodeFragment, PersonFragment, Utbetalingstatus } from '@io/graphql';
import { Annulleringsmodal } from '@saksbilde/annullering/Annulleringsmodal';
import { harPeriodeTilBeslutterFor } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonUtils';
import { isBeregnetPeriode } from '@utils/typeguards';

interface AnnullerButtonWithContentProps {
    vedtaksperiodeId: string;
    utbetalingId: string;
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
}

const AnnullerButtonWithContent = ({
    utbetalingId,
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
                <Annulleringsmodal
                    fødselsnummer={fødselsnummer}
                    aktørId={aktørId}
                    organisasjonsnummer={organisasjonsnummer}
                    vedtaksperiodeId={vedtaksperiodeId}
                    utbetalingId={utbetalingId}
                    onClose={() => {
                        setShowModal(false);
                    }}
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

export const AnnullerButton = ({ person, periode, arbeidsgiver }: AnnullerButtonProps): ReactElement | null => {
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
            aktørId={person.aktorId}
            fødselsnummer={person.fodselsnummer}
            organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
        />
    );
};
