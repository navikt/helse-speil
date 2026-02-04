import React, { Dispatch, ReactElement, SetStateAction, useState } from 'react';

import { useHarSkrivetilgang } from '@hooks/brukerrolleHooks';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { BeregnetPeriodeFragment, PersonFragment } from '@io/graphql';
import { BegrunnelseModal } from '@saksbilde/venstremeny/individuellBegrunnelse/BegrunnelseModal';
import { IndividuellBegrunnelseContent } from '@saksbilde/venstremeny/individuellBegrunnelse/IndividuellBegrunnelseContent';

interface BegrunnelseVedtakProps {
    defaultÅpen: boolean;
    vedtakBegrunnelseTekst: string;
    setVedtakBegrunnelseTekst: Dispatch<SetStateAction<string>>;
    periode: BeregnetPeriodeFragment;
    person: PersonFragment;
}

export const IndividuellBegrunnelse = ({
    defaultÅpen,
    vedtakBegrunnelseTekst,
    setVedtakBegrunnelseTekst,
    periode,
    person,
}: BegrunnelseVedtakProps): ReactElement | null => {
    const [modalÅpen, setModalÅpen] = useState(false);

    const harSkrivetilgang = useHarSkrivetilgang();
    const erReadOnly = useIsReadOnlyOppgave(person) || !harSkrivetilgang;

    const erBeslutteroppgave = periode.totrinnsvurdering?.erBeslutteroppgave ?? false;

    const åpneModal = () => setModalÅpen(true);
    const lukkModal = () => setModalÅpen(false);

    return (
        <>
            <IndividuellBegrunnelseContent
                erReadOnly={erReadOnly}
                erBeslutteroppgave={erBeslutteroppgave}
                vedtakBegrunnelseTekst={vedtakBegrunnelseTekst}
                setVedtakBegrunnelseTekst={setVedtakBegrunnelseTekst}
                defaultÅpen={defaultÅpen}
                åpneModal={åpneModal}
            />

            {modalÅpen && (
                <BegrunnelseModal
                    modalÅpen={modalÅpen}
                    lukkModal={lukkModal}
                    vedtakBegrunnelseTekst={vedtakBegrunnelseTekst}
                    setVedtakBegrunnelseTekst={setVedtakBegrunnelseTekst}
                />
            )}
        </>
    );
};
