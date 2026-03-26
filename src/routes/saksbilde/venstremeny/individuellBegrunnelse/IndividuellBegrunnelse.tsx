import React, { Dispatch, ReactElement, SetStateAction, useState } from 'react';

import { Dialog } from '@navikt/ds-react';

import { useHarSkrivetilgang } from '@hooks/brukerrolleHooks';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { BeregnetPeriodeFragment, PersonFragment } from '@io/graphql';
import { BegrunnelseDialog } from '@saksbilde/venstremeny/individuellBegrunnelse/BegrunnelseDialog';
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

    return (
        <>
            <IndividuellBegrunnelseContent
                erReadOnly={erReadOnly}
                erBeslutteroppgave={erBeslutteroppgave}
                vedtakBegrunnelseTekst={vedtakBegrunnelseTekst}
                setVedtakBegrunnelseTekst={setVedtakBegrunnelseTekst}
                defaultÅpen={defaultÅpen}
                åpneModal={() => setModalÅpen(true)}
            />
            <Dialog open={modalÅpen} onOpenChange={setModalÅpen}>
                <BegrunnelseDialog
                    vedtakBegrunnelseTekst={vedtakBegrunnelseTekst}
                    setVedtakBegrunnelseTekst={setVedtakBegrunnelseTekst}
                />
            </Dialog>
        </>
    );
};
