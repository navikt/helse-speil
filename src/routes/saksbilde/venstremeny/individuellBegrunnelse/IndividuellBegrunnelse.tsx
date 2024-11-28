import React, { Dispatch, ReactElement, SetStateAction, useState } from 'react';

import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { Avslagstype, BeregnetPeriodeFragment, Maybe, PersonFragment } from '@io/graphql';
import { BegrunnelseModal } from '@saksbilde/venstremeny/individuellBegrunnelse/BegrunnelseModal';
import { IndividuellBegrunnelseContent } from '@saksbilde/venstremeny/individuellBegrunnelse/IndividuellBegrunnelseContent';

interface BegrunnelseVedtakProps {
    visIndividuellBegrunnelse: boolean;
    setVisIndividuellBegrunnelse: Dispatch<SetStateAction<boolean>>;
    avslagstype: Avslagstype | undefined;
    vedtakBegrunnelseTekst: string;
    setVedtakBegrunnelseTekst: Dispatch<SetStateAction<string>>;
    periode: BeregnetPeriodeFragment;
    person: PersonFragment;
}

export const IndividuellBegrunnelse = ({
    visIndividuellBegrunnelse,
    setVisIndividuellBegrunnelse,
    avslagstype,
    vedtakBegrunnelseTekst,
    setVedtakBegrunnelseTekst,
    periode,
    person,
}: BegrunnelseVedtakProps): Maybe<ReactElement> => {
    const [modalÅpen, setModalÅpen] = useState(false);

    const erReadOnly = useIsReadOnlyOppgave(person);

    const erBeslutteroppgave = periode.totrinnsvurdering?.erBeslutteroppgave ?? false;

    if (avslagstype === undefined) return null;

    const åpneModal = () => setModalÅpen(true);
    const lukkModal = () => setModalÅpen(false);

    const skalÅpnesMedUtfylteVerdier = !erReadOnly && !erBeslutteroppgave;

    const onClose = () => {
        setVisIndividuellBegrunnelse(false);
        lukkModal();
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
                vedtakBegrunnelseTekst={vedtakBegrunnelseTekst}
                setVedtakBegrunnelseTekst={setVedtakBegrunnelseTekst}
                skalÅpnesMedUtfylteVerdier={skalÅpnesMedUtfylteVerdier}
                visIndividuellBegrunnelse={visIndividuellBegrunnelse}
                åpneIndividuellBegrunnelse={åpneIndividuellBegrunnelse}
                åpneModal={åpneModal}
                periodeAvslag={periode.avslag}
            />

            {modalÅpen && (
                <BegrunnelseModal
                    modalÅpen={modalÅpen}
                    lukkModal={lukkModal}
                    avslagstype={avslagstype}
                    vedtakBegrunnelseTekst={vedtakBegrunnelseTekst}
                    setVedtakBegrunnelseTekst={setVedtakBegrunnelseTekst}
                />
            )}
        </>
    );
};
