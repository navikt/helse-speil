import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { InntektEndringAarsak } from '@io/graphql';
import { NORSK_DATOFORMAT, somNorskDato } from '@utils/date';

import styles from './Inntektsmeldingsinnhold.module.css';

type EndringsårsakerProps = {
    årsaker: Array<InntektEndringAarsak> | null;
};

export const Endringsårsaker = ({ årsaker }: EndringsårsakerProps): ReactElement | null => {
    if (årsaker == null || årsaker.length == 0) return null;

    return (
        <div>
            <BodyShort weight="semibold" size="small">
                Endringsårsaker
            </BodyShort>
            <>
                {årsaker?.map((årsak, index) => (
                    // bruker index som key fordi årsakene kan være identiske
                    <Endringsårsak key={index} årsak={årsak} />
                ))}
            </>
        </div>
    );
};

const Endringsårsak = ({ årsak }: { årsak: InntektEndringAarsak }): ReactElement | null => {
    return (
        <>
            <BodyShort size="small">• {årsakmapper(årsak.aarsak)}</BodyShort>
            <div className={styles.inntektEndringAarsakDetaljer}>
                {årsak.perioder && (
                    <>
                        <BodyShort size="small">Perioder: </BodyShort>
                        <BodyShort size="small">
                            {årsak.perioder
                                .map((it) => it.fom && `${somNorskDato(it.fom)} – ${it.tom && somNorskDato(it.tom)}`)
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

function årsakmapper(aarsak: string) {
    switch (aarsak) {
        case 'NyStilling':
            return 'Ny stilling';
        case 'NyStillingsprosent':
            return 'Ny stillingsprosent';
        case 'Sykefravaer':
            return 'Sykefravær';
        case 'VarigLonnsendring':
            return 'Varig lønnsendring';
    }
    return aarsak;
}
