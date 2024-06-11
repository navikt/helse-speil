import React, { useState } from 'react';

import { Dropdown } from '@navikt/ds-react';

import { ArbeidsgiverFragment, BeregnetPeriodeFragment, PersonFragment, Utbetalingstatus } from '@io/graphql';
import { isBeregnetPeriode } from '@utils/typeguards';

import { Annulleringsmodal } from '../../annullering/Annulleringsmodal';
import { harPeriodeTilBeslutterFor } from '../../sykepengegrunnlag/inntekt/inntektOgRefusjonUtils';

interface AnnullerButtonWithContentProps {
    vedtaksperiodeId: string;
    utbetalingId: string;
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
}

const AnnullerButtonWithContent: React.FC<AnnullerButtonWithContentProps> = ({
    utbetalingId,
    vedtaksperiodeId,
    aktørId,
    fødselsnummer,
    organisasjonsnummer,
}) => {
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

export const AnnullerButton: React.FC<AnnullerButtonProps> = ({ person, periode, arbeidsgiver }) => {
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
