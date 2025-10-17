import React, { ReactElement } from 'react';

import { Alert, Button, Heading, List } from '@navikt/ds-react';

import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { InntektsforholdReferanse, inntektsforholdReferanseTilKey } from '@state/inntektsforhold/inntektsforhold';
import { useNavigerTilPeriode } from '@state/routing';
import { DateString } from '@typer/shared';
import { somNorskDato } from '@utils/date';

import styles from './Periodeinformasjon.module.scss';

export interface PeriodeinformasjonInnslag {
    inntektsforholdReferanse: InntektsforholdReferanse;
    perioder: {
        id: string;
        fom: DateString;
        tom: DateString;
    }[];
}

interface PeriodeinformasjonProps {
    tittel: string;
    periodeinformasjon: PeriodeinformasjonInnslag[];
}

export const Periodeinformasjon = ({ tittel, periodeinformasjon }: PeriodeinformasjonProps): ReactElement | null => {
    const navigerTilPeriode = useNavigerTilPeriode();

    return (
        <Alert variant="info">
            <Heading spacing size="xsmall" level="3" className={styles.tittel}>
                {tittel}
            </Heading>
            {periodeinformasjon.map((informasjon) => (
                <List key={inntektsforholdReferanseTilKey(informasjon.inntektsforholdReferanse)} as="ul">
                    {periodeinformasjon.length > 1 && (
                        <Inntektsforholdnavn inntektsforholdReferanse={informasjon.inntektsforholdReferanse} />
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
