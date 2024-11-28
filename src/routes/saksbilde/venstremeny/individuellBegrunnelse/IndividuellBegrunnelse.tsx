import React, { Dispatch, ReactElement, SetStateAction, useState } from 'react';

import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import {
    AvslagInput,
    Avslagshandling,
    Avslagstype,
    BeregnetPeriodeFragment,
    Dag,
    Maybe,
    PersonFragment,
    Utbetalingsdagtype,
} from '@io/graphql';
import { BegrunnelseModal } from '@saksbilde/venstremeny/individuellBegrunnelse/BegrunnelseModal';
import { IndividuellBegrunnelseContent } from '@saksbilde/venstremeny/individuellBegrunnelse/IndividuellBegrunnelseContent';

interface BegrunnelseVedtakProps {
    visIndividuellBegrunnelse: boolean;
    setVisIndividuellBegrunnelse: Dispatch<SetStateAction<boolean>>;
    avslag: Maybe<AvslagInput>;
    setAvslag: Dispatch<SetStateAction<Maybe<AvslagInput>>>;
    periode: BeregnetPeriodeFragment;
    person: PersonFragment;
}

export const IndividuellBegrunnelse = ({
    visIndividuellBegrunnelse,
    setVisIndividuellBegrunnelse,
    avslag,
    setAvslag,
    periode,
    person,
}: BegrunnelseVedtakProps): Maybe<ReactElement> => {
    const [modalÅpen, setModalÅpen] = useState(false);

    const erReadOnly = useIsReadOnlyOppgave(person);

    const erBeslutteroppgave = periode.totrinnsvurdering?.erBeslutteroppgave ?? false;
    const tidslinjeUtenAGPogHelg = getTidslinjeUtenAGPogHelg(periode);
    const avvisteDager = getAvvisteDager(tidslinjeUtenAGPogHelg);

    const avslagstype =
        tidslinjeUtenAGPogHelg.length === avvisteDager.length ? Avslagstype.Avslag : Avslagstype.DelvisAvslag;

    const lokalAvslagstekst = avslag?.data?.begrunnelse;
    const innsendtAvslagstekst =
        periode.avslag[0] != undefined && !periode.avslag[0].invalidert
            ? (periode.avslag[0].begrunnelse as string)
            : undefined;

    if (avvisteDager.length === 0 && !innsendtAvslagstekst) return null;

    const åpneModal = () => setModalÅpen(true);
    const lukkModal = () => setModalÅpen(false);

    const preutfyltVerdi = lokalAvslagstekst ?? innsendtAvslagstekst ?? '';

    const skalÅpnesMedUtfylteVerdier =
        !erReadOnly && !erBeslutteroppgave && preutfyltVerdi !== '' && avslag?.handling !== Avslagshandling.Invalider;

    const onClose = () => {
        if (!lokalAvslagstekst && !innsendtAvslagstekst) {
            setVisIndividuellBegrunnelse(false);
            lukkModal();
        }
    };

    const åpneIndividuellBegrunnelse = () => {
        if (visIndividuellBegrunnelse) {
            onClose();
        } else {
            setVisIndividuellBegrunnelse(true);
        }
    };

    return (
        <>
            <IndividuellBegrunnelseContent
                erReadOnly={erReadOnly}
                erBeslutteroppgave={erBeslutteroppgave}
                avslagstype={avslagstype}
                preutfyltVerdi={preutfyltVerdi}
                skalÅpnesMedUtfylteVerdier={skalÅpnesMedUtfylteVerdier}
                visIndividuellBegrunnelse={visIndividuellBegrunnelse}
                åpneIndividuellBegrunnelse={åpneIndividuellBegrunnelse}
                åpneModal={åpneModal}
                setAvslag={setAvslag}
                periodeAvslag={periode.avslag}
            />

            {modalÅpen && (
                <BegrunnelseModal
                    modalÅpen={modalÅpen}
                    lukkModal={lukkModal}
                    avslagstype={avslagstype}
                    preutfyltVerdi={preutfyltVerdi}
                    setAvslag={setAvslag}
                />
            )}
        </>
    );
};

const getTidslinjeUtenAGPogHelg = (periode: BeregnetPeriodeFragment) =>
    periode.tidslinje.filter(
        (dag) =>
            ![Utbetalingsdagtype.Navhelgdag, Utbetalingsdagtype.Arbeidsgiverperiodedag].includes(
                dag.utbetalingsdagtype,
            ),
    );

const getAvvisteDager = (tidslinjeUtenAGPogHelg: Dag[]) =>
    tidslinjeUtenAGPogHelg.filter((dag) =>
        [Utbetalingsdagtype.AvvistDag, Utbetalingsdagtype.ForeldetDag, Utbetalingsdagtype.Feriedag].includes(
            dag.utbetalingsdagtype,
        ),
    );

export const knappetekst = (avslagstype: Avslagstype) => {
    switch (avslagstype) {
        case Avslagstype.DelvisAvslag:
            return 'Skriv begrunnelse for delvis innvilgelse';
        case Avslagstype.Avslag:
            return 'Skriv begrunnelse for avslag';
    }
};
