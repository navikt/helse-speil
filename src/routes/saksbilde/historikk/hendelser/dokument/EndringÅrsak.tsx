import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { InntektEndringAarsak, Maybe } from '@io/graphql';
import { NORSK_DATOFORMAT, somNorskDato } from '@utils/date';

import styles from './Inntektsmeldingsinnhold.module.css';

type EndringÅrsakProps = {
    årsak: Maybe<InntektEndringAarsak>;
};

export const EndringÅrsak = ({ årsak }: EndringÅrsakProps): Maybe<ReactElement> => {
    if (årsak == null) return null;

    return (
        <>
            <div className={styles.inntektEndringAarsak}>
                <BodyShort weight="semibold" size="small" className={styles.fullBredde}>
                    Endringsårsak
                </BodyShort>
                <BodyShort size="small">Årsak:</BodyShort>
                <BodyShort size="small">{årsak.aarsak}</BodyShort>
                {årsak.perioder && (
                    <>
                        <BodyShort size="small">Perioder: </BodyShort>
                        <BodyShort size="small">
                            {årsak.perioder
                                ?.map((it) => it.fom && `${somNorskDato(it.fom)} – ${it.tom && somNorskDato(it.tom)}`)
                                .join(', ')
                                .replace(/,(?=[^,]*$)/, ' og')}
                        </BodyShort>
                    </>
                )}
                {årsak.gjelderFra && (
                    <>
                        <BodyShort size="small">Gjelder fra:</BodyShort>
                        <BodyShort size="small">{dayjs(årsak.gjelderFra).format(NORSK_DATOFORMAT)}</BodyShort>
                    </>
                )}
                {årsak.bleKjent && (
                    <>
                        <BodyShort size="small">Ble kjent:</BodyShort>
                        <BodyShort size="small">{somNorskDato(årsak.bleKjent)}</BodyShort>
                    </>
                )}
            </div>
        </>
    );
};
