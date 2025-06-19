import React, { ReactElement } from 'react';

import { Alert, Button, Heading, List } from '@navikt/ds-react';

import { Arbeidsgivernavn } from '@components/Arbeidsgivernavn';
import { Maybe } from '@io/graphql';
import { useNavigerTilPeriode } from '@state/routing';
import { DateString } from '@typer/shared';
import { somNorskDato } from '@utils/date';

import styles from './Periodeinformasjon.module.scss';

export interface Periodeinformasjon {
    arbeidsgiverIdentifikator: string;
    arbeidsgivernavn: string;
    perioder: {
        id: string;
        fom: DateString;
        tom: DateString;
    }[];
}

interface PeriodeinformasjonProps {
    tittel: string;
    periodeinformasjon: Periodeinformasjon[];
}

export const Periodeinformasjon = ({ tittel, periodeinformasjon }: PeriodeinformasjonProps): Maybe<ReactElement> => {
    const navigerTilPeriode = useNavigerTilPeriode();

    return (
        <Alert variant="info">
            <Heading spacing size="xsmall" level="3" className={styles.tittel}>
                {tittel}
            </Heading>
            {periodeinformasjon.map((informasjon) => (
                <List key={informasjon.arbeidsgivernavn} as="ul">
                    {periodeinformasjon.length > 1 && (
                        <Arbeidsgivernavn
                            identifikator={informasjon.arbeidsgiverIdentifikator}
                            navn={informasjon.arbeidsgivernavn}
                        />
                    )}
                    {informasjon.perioder.map((periode) => (
                        <List.Item key={periode.id} className={styles.datoliste}>
                            <Button
                                className={styles.lenkeknapp}
                                variant="tertiary"
                                onClick={() => navigerTilPeriode(periode.id)}
                            >
                                {somNorskDato(periode.fom)} – {somNorskDato(periode.tom)}
                            </Button>
                        </List.Item>
                    ))}
                </List>
            ))}
        </Alert>
    );
};
