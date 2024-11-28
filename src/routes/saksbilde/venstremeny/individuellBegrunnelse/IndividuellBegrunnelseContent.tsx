import React, { Dispatch, SetStateAction } from 'react';

import { ExpandIcon } from '@navikt/aksel-icons';
import { Box, Button, ReadMore } from '@navikt/ds-react';

import { Avslag } from '@io/graphql';
import { ReadOnlyIndividuellBegrunnelse } from '@saksbilde/venstremeny/ReadOnlyIndividuellBegrunnelse';
import { BegrunnelseInput } from '@saksbilde/venstremeny/individuellBegrunnelse/BegrunnelseInput';

import styles from './IndividuellBegrunnelse.module.scss';

interface IndividuellBegrunnelseContentProps {
    erReadOnly: boolean;
    erBeslutteroppgave: boolean;
    vedtakBegrunnelseTekst: string;
    setVedtakBegrunnelseTekst: Dispatch<SetStateAction<string>>;
    skalÅpnesMedUtfylteVerdier: boolean;
    visIndividuellBegrunnelse: boolean;
    åpneIndividuellBegrunnelse: () => void;
    åpneModal: () => void;
    periodeAvslag: Avslag[];
}

export const IndividuellBegrunnelseContent = ({
    erReadOnly,
    erBeslutteroppgave,
    vedtakBegrunnelseTekst,
    setVedtakBegrunnelseTekst,
    skalÅpnesMedUtfylteVerdier,
    visIndividuellBegrunnelse,
    åpneIndividuellBegrunnelse,
    åpneModal,
    periodeAvslag,
}: IndividuellBegrunnelseContentProps) => (
    <Box marginBlock="0 4" paddingBlock="4 0" className={styles['begrunnelse-vedtak']}>
        {!erReadOnly && !erBeslutteroppgave && (
            <Box position="relative">
                <ReadMore
                    size="small"
                    className={styles.readmore}
                    open={visIndividuellBegrunnelse}
                    header="Skriv begrunnelse for vedtak"
                    onClick={åpneIndividuellBegrunnelse}
                >
                    <Box background="bg-subtle">
                        <Button
                            onClick={åpneModal}
                            icon={<ExpandIcon title="åpne i modal" />}
                            size="xsmall"
                            variant="tertiary-neutral"
                            style={{ position: 'absolute', top: 0, right: 0 }}
                        />
                        <BegrunnelseInput
                            vedtakBegrunnelseTekst={vedtakBegrunnelseTekst}
                            setVedtakBegrunnelseTekst={setVedtakBegrunnelseTekst}
                            minRows={4}
                            focus={visIndividuellBegrunnelse || skalÅpnesMedUtfylteVerdier}
                        />
                    </Box>
                </ReadMore>
            </Box>
        )}

        {periodeAvslag.filter((it) => !it.invalidert).length > 0 && (erBeslutteroppgave || erReadOnly) && (
            <ReadOnlyIndividuellBegrunnelse avslag={periodeAvslag[0]} />
        )}
    </Box>
);
