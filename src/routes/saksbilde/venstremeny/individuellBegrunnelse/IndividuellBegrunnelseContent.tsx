import React, { Dispatch, SetStateAction } from 'react';

import { ExpandIcon } from '@navikt/aksel-icons';
import { Box, Button, ReadMore } from '@navikt/ds-react';

import { Avslag, AvslagInput, Avslagstype, Maybe } from '@io/graphql';
import { ReadOnlyIndividuellBegrunnelse } from '@saksbilde/venstremeny/ReadOnlyIndividuellBegrunnelse';
import { BegrunnelseInput } from '@saksbilde/venstremeny/individuellBegrunnelse/BegrunnelseInput';
import { knappetekst } from '@saksbilde/venstremeny/individuellBegrunnelse/IndividuellBegrunnelse';

import styles from './IndividuellBegrunnelse.module.scss';

interface IndividuellBegrunnelseContentProps {
    erReadOnly: boolean;
    erBeslutteroppgave: boolean;
    avslagstype: Avslagstype;
    vedtakBegrunnelseTekst: string;
    setVedtakBegrunnelseTekst: Dispatch<SetStateAction<string>>;
    skalÅpnesMedUtfylteVerdier: boolean;
    visIndividuellBegrunnelse: boolean;
    åpneIndividuellBegrunnelse: () => void;
    åpneModal: () => void;
    setAvslag: Dispatch<SetStateAction<Maybe<AvslagInput>>>;
    periodeAvslag: Avslag[];
}

export const IndividuellBegrunnelseContent = ({
    erReadOnly,
    erBeslutteroppgave,
    avslagstype,
    vedtakBegrunnelseTekst,
    setVedtakBegrunnelseTekst,
    skalÅpnesMedUtfylteVerdier,
    visIndividuellBegrunnelse,
    åpneIndividuellBegrunnelse,
    åpneModal,
    setAvslag,
    periodeAvslag,
}: IndividuellBegrunnelseContentProps) => (
    <Box marginBlock="0 4" paddingBlock="4 0" className={styles['begrunnelse-vedtak']}>
        {!erReadOnly && !erBeslutteroppgave && (
            <Box position="relative">
                <ReadMore
                    size="small"
                    className={styles.readmore}
                    open={visIndividuellBegrunnelse}
                    header={knappetekst(avslagstype)}
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
                            begrunnelsestype={avslagstype}
                            vedtakBegrunnelseTekst={vedtakBegrunnelseTekst}
                            setVedtakBegrunnelseTekst={setVedtakBegrunnelseTekst}
                            minRows={4}
                            setAvslag={setAvslag}
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
