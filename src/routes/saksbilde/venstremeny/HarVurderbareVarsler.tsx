import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { Alert, Button, List } from '@navikt/ds-react';

import { AnonymizableBold } from '@components/anonymizable/AnonymizableBold';
import { Maybe, PersonFragment } from '@io/graphql';
import { usePeriodeTilGodkjenning } from '@state/arbeidsgiver';
import { useSetActivePeriodId } from '@state/periode';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';

import styles from './HarVurderbareVarsler.module.scss';

interface HarVurderbareVarslerProps {
    person: PersonFragment;
}

export const HarVurderbareVarsler = ({ person }: HarVurderbareVarslerProps): Maybe<ReactElement> => {
    const setActivePeriodId = useSetActivePeriodId();
    const harPeriodeTilGodkjenning = usePeriodeTilGodkjenning();

    if (!harPeriodeTilGodkjenning) return null;

    const arbeidsgivereMedVurderbareVarsler = person.arbeidsgivere
        .map((arbeidsgiver) => {
            return {
                navn: arbeidsgiver.navn,
                perioder: arbeidsgiver.generasjoner.flatMap((generasjon) =>
                    generasjon.perioder.filter(
                        (periode) =>
                            periode.varsler.filter(
                                (varsel) => varsel.vurdering === null || varsel.vurdering?.status === 'AKTIV',
                            ).length > 0,
                    ),
                ),
            };
        })
        .filter((it) => it.perioder.length > 0);

    if (arbeidsgivereMedVurderbareVarsler.length === 0) return null;

    return (
        <Alert variant="info">
            <List as="ul" title="Perioder med varsler som må vurderes">
                {arbeidsgivereMedVurderbareVarsler.map((arbeidsgiver) => (
                    <List key={arbeidsgiver.navn} as="ul">
                        {person.arbeidsgivere.length > 1 && <AnonymizableBold>{arbeidsgiver.navn}</AnonymizableBold>}
                        {arbeidsgiver.perioder.map((periode) => (
                            <List.Item key={periode.id} className={styles.li}>
                                <Button
                                    className={styles.button}
                                    variant="tertiary"
                                    onClick={() => setActivePeriodId(periode.id)}
                                >
                                    {dayjs(periode.fom, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)} –{' '}
                                    {dayjs(periode.tom, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)}
                                </Button>
                            </List.Item>
                        ))}
                    </List>
                ))}
            </List>
        </Alert>
    );
};
