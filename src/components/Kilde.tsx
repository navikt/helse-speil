import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';

import { Tooltip } from '@navikt/ds-react';

import { Inntektskilde, Kildetype } from '@io/graphql';

import styles from './Kilde.module.scss';

interface KildeProps {
    type: KildeikonType;
    className?: string;
}

type KildeikonType = Kildetype | Inntektskilde | 'AINNTEKT' | 'VEDTAK' | undefined;

const finnCSSklasse = (type: KildeikonType) => {
    switch (type) {
        case 'AINNTEKT':
            return 'ainntekt';
        case 'VEDTAK':
            return 'melding om vedtak';
        case Inntektskilde.Aordningen:
            return 'aordningen';
        case Kildetype.Sykmelding:
            return 'sykmelding';
        case Kildetype.Soknad:
            return 'søknad';
        case Kildetype.Inntektsmelding:
            return 'inntektsmelding';
        case Kildetype.Saksbehandler:
        case Inntektskilde.SkjonnsmessigFastsatt:
            return 'saksbehandler';
        default:
            return '';
    }
};

const getKildeTypeTooltip = (kilde: KildeikonType): string => {
    switch (kilde) {
        case Inntektskilde.Inntektsmelding:
        case Kildetype.Inntektsmelding:
            return 'Inntektsmelding';
        case Kildetype.Soknad:
            return 'Søknad';
        case Kildetype.Sykmelding:
            return 'Sykmelding';
        case Kildetype.Saksbehandler:
            return 'Saksbehandler';
        case Inntektskilde.Aordningen:
            return 'A-ordningen';
        case Inntektskilde.IkkeRapportert:
            return 'Ikke rapportert';
        case Inntektskilde.Saksbehandler:
            return 'Saksbehandler';
        case 'AINNTEKT':
            return 'A-inntekt';
        case Inntektskilde.SkjonnsmessigFastsatt:
            return 'Skjønnsmessig fastsatt';
        default:
            return 'Ukjent';
    }
};

const erTekst = (kilde: KildeikonType): boolean =>
    kilde !== Kildetype.Saksbehandler &&
    kilde !== Inntektskilde.Saksbehandler &&
    kilde !== Inntektskilde.SkjonnsmessigFastsatt;

export const Kilde = ({ type, children, className }: PropsWithChildren<KildeProps>) => {
    return (
        <Tooltip content={getKildeTypeTooltip(type)}>
            <div className={classNames(styles.kildeikon, styles[`kildeikon__${finnCSSklasse(type)}`], className)}>
                {erTekst(type) ? <div className={styles.tekst}>{children}</div> : children}
            </div>
        </Tooltip>
    );
};
