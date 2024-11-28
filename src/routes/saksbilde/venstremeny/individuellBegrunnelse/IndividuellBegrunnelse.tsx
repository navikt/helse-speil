import React, { Dispatch, ReactElement, SetStateAction, useState } from 'react';

import { Box } from '@navikt/ds-react';

import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { BeregnetPeriodeFragment, Maybe, PersonFragment } from '@io/graphql';
import { BegrunnelseModal } from '@saksbilde/venstremeny/individuellBegrunnelse/BegrunnelseModal';
import { IndividuellBegrunnelseContent } from '@saksbilde/venstremeny/individuellBegrunnelse/IndividuellBegrunnelseContent';

interface BegrunnelseVedtakProps {
    visIndividuellBegrunnelse: boolean;
    setVisIndividuellBegrunnelse: Dispatch<SetStateAction<boolean>>;
    erInnvilgelse: boolean;
    vedtakBegrunnelseTekst: string;
    setVedtakBegrunnelseTekst: Dispatch<SetStateAction<string>>;
    periode: BeregnetPeriodeFragment;
    person: PersonFragment;
}

export const IndividuellBegrunnelse = ({
    visIndividuellBegrunnelse,
    setVisIndividuellBegrunnelse,
    erInnvilgelse,
    vedtakBegrunnelseTekst,
    setVedtakBegrunnelseTekst,
    periode,
    person,
}: BegrunnelseVedtakProps): Maybe<ReactElement> => {
    const [modalÅpen, setModalÅpen] = useState(false);

    const erReadOnly = useIsReadOnlyOppgave(person);

    const erBeslutteroppgave = periode.totrinnsvurdering?.erBeslutteroppgave ?? false;

    if (erInnvilgelse) return null;

    const åpneModal = () => setModalÅpen(true);
    const lukkModal = () => setModalÅpen(false);

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
        <Box
            background={vedtakBegrunnelseTekst !== '' ? 'bg-subtle' : 'surface-transparent'}
            paddingBlock="0 4"
            paddingInline="4 4"
            style={{ margin: '0 -1rem' }}
        >
            <IndividuellBegrunnelseContent
                erReadOnly={erReadOnly}
                erBeslutteroppgave={erBeslutteroppgave}
                vedtakBegrunnelseTekst={vedtakBegrunnelseTekst}
                setVedtakBegrunnelseTekst={setVedtakBegrunnelseTekst}
                visIndividuellBegrunnelse={visIndividuellBegrunnelse}
                åpneIndividuellBegrunnelse={åpneIndividuellBegrunnelse}
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
        </Box>
    );
};
