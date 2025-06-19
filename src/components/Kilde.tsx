import classNames from 'classnames';
import React, { PropsWithChildren, ReactElement } from 'react';

import { Tooltip } from '@navikt/ds-react';

import { Inntektskilde } from '@io/graphql';
import { Kildetype } from '@saksbilde/historikk/hendelser/dokument/dokument';

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
        case 'InntektHentetFraAordningen':
        case Inntektskilde.Aordningen:
            return 'aordningen';
        case 'Sykmelding':
            return 'sykmelding';
        case 'Soknad':
            return 'søknad';
        case 'Inntektsmelding':
        case Inntektskilde.Inntektsmelding:
            return 'inntektsmelding';
        case 'Saksbehandler':
        case Inntektskilde.SkjonnsmessigFastsatt:
            return 'saksbehandler';
        case 'Skatteetaten':
            return 'skatteetaten';
        default:
            return '';
    }
};

const getKildeTypeTooltip = (kilde: KildeikonType): string => {
    switch (kilde) {
        case Inntektskilde.Inntektsmelding:
        case 'Inntektsmelding':
            return 'Inntektsmelding';
        case 'Soknad':
            return 'Søknad';
        case 'Sykmelding':
            return 'Sykmelding';
        case 'Saksbehandler':
            return 'Saksbehandler';
        case 'InntektHentetFraAordningen':
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
        case 'Skatteetaten':
            return 'Skatteetaten';
        default:
            return 'Ukjent';
    }
};

const erTekst = (kilde: KildeikonType): boolean =>
    kilde !== 'Saksbehandler' && kilde !== Inntektskilde.Saksbehandler && kilde !== Inntektskilde.SkjonnsmessigFastsatt;

export const Kilde = ({ type, children, className }: PropsWithChildren<KildeProps>): ReactElement => (
    <Tooltip content={getKildeTypeTooltip(type)}>
        <div className={classNames(styles.kildeikon, styles[`kildeikon__${finnCSSklasse(type)}`], className)}>
            {erTekst(type) ? <div className={styles.tekst}>{children}</div> : children}
        </div>
    </Tooltip>
);
