import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import { BodyShort, Box, HGrid, Heading, VStack } from '@navikt/ds-react';

import { ArbeidsgiverFragment, NyttInntektsforholdPeriodeFragment, PersonFragment } from '@io/graphql';
import { EditableTilkommenAG } from '@saksbilde/tilkommenInntekt/tilkommen/EditableTilkommenAG';
import { TilkommenAGHeader } from '@saksbilde/tilkommenInntekt/tilkommen/TilkommenAGHeader';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';
import { toKronerOgØre } from '@utils/locale';

import styles from './TilkommenAG.module.scss';

interface TilkommenAGProps {
    person: PersonFragment;
    periode: NyttInntektsforholdPeriodeFragment;
    arbeidsgiver: ArbeidsgiverFragment;
}

export const TilkommenAG = ({ person, periode, arbeidsgiver }: TilkommenAGProps) => {
    const [editing, setEditing] = useState(false);
    const [endret, setEndret] = useState(false);

    return (
        <VStack>
            <Box paddingInline="4">
                <Heading size="small" spacing>
                    Tilkommen inntekt {dayjs(periode.fom, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)} –
                    {dayjs(periode.tom, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)}
                </Heading>
            </Box>
            <Box
                background="surface-subtle"
                borderWidth="0 0 0 3"
                borderColor="border-action"
                className={classNames(styles.ag, editing && styles.redigerer)}
                paddingBlock="4"
                paddingInline={editing ? '10' : '6'}
                marginInline={editing ? '0' : '4'}
                borderRadius={editing ? undefined : 'medium'}
                minWidth="390px"
                maxWidth={editing ? undefined : '730px'}
            >
                <TilkommenAGHeader
                    person={person}
                    arbeidsgiver={arbeidsgiver}
                    periode={periode}
                    editing={editing}
                    setEditing={setEditing}
                />

                <Box marginInline="7 0" minWidth="390px" maxWidth="730px">
                    {editing ? (
                        <EditableTilkommenAG
                            person={person}
                            arbeidsgiver={arbeidsgiver}
                            periode={periode}
                            close={() => setEditing(false)}
                            onEndre={setEndret}
                        />
                    ) : (
                        <HGrid columns="150px auto" paddingBlock="1 0">
                            <BodyShort weight="semibold">Inntekt per måned</BodyShort>
                            <BodyShort>{toKronerOgØre(periode.manedligBelop ?? 0)} kr</BodyShort>
                            <BodyShort weight="semibold">Inntekt per dag</BodyShort>
                            <BodyShort>{toKronerOgØre(periode.dagligBelop ?? 0)} kr</BodyShort>
                        </HGrid>
                    )}
                </Box>
            </Box>
        </VStack>
    );
};
