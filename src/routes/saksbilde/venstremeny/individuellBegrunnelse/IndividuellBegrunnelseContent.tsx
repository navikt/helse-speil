import React, { Dispatch, SetStateAction } from 'react';

import { ExpandIcon } from '@navikt/aksel-icons';
import { Box, Button, ReadMore } from '@navikt/ds-react';

import { ReadOnlyIndividuellBegrunnelse } from '@saksbilde/venstremeny/ReadOnlyIndividuellBegrunnelse';
import { BegrunnelseInput } from '@saksbilde/venstremeny/individuellBegrunnelse/BegrunnelseInput';

import styles from './IndividuellBegrunnelse.module.scss';

interface IndividuellBegrunnelseContentProps {
    erReadOnly: boolean;
    erBeslutteroppgave: boolean;
    vedtakBegrunnelseTekst: string;
    setVedtakBegrunnelseTekst: Dispatch<SetStateAction<string>>;
    defaultÅpen: boolean;
    åpneModal: () => void;
}

export const IndividuellBegrunnelseContent = ({
    erReadOnly,
    erBeslutteroppgave,
    vedtakBegrunnelseTekst,
    setVedtakBegrunnelseTekst,
    defaultÅpen,
    åpneModal,
}: IndividuellBegrunnelseContentProps) => (
    <Box marginBlock="0 4" paddingBlock="4 0" className={styles['begrunnelse-vedtak']}>
        {!erReadOnly && !erBeslutteroppgave && (
            <Box position="relative">
                <ReadMore
                    size="small"
                    className={styles.readmore}
                    defaultOpen={defaultÅpen}
                    header={
                        vedtakBegrunnelseTekst === '' ? (
                            <span>Skriv begrunnelse for vedtak</span>
                        ) : (
                            <strong>Skriv begrunnelse for vedtak</strong>
                        )
                    }
                >
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
                    />
                </ReadMore>
            </Box>
        )}

        {vedtakBegrunnelseTekst !== '' && (erBeslutteroppgave || erReadOnly) && (
            <ReadOnlyIndividuellBegrunnelse vedtakBegrunnelseTekst={vedtakBegrunnelseTekst} />
        )}
    </Box>
);
