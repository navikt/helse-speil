import React, { Fragment, ReactElement } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Inntektskilde, Maybe, Skjonnsfastsettingstype } from '@io/graphql';
import { Historikkhendelse } from '@saksbilde/historikk/hendelser/Historikkhendelse';
import { SykepengegrunnlagskjonnsfastsettinghendelseObject } from '@typer/historikk';
import { getFormattedDateString } from '@utils/date';
import { somPenger } from '@utils/locale';

import { ExpandableHistorikkContent } from './ExpandableHistorikkContent';

import styles from './Overstyringshendelse.module.css';

type SykepengegrunnlagskjønnsfastsettinghendelseProps = Omit<
    SykepengegrunnlagskjonnsfastsettinghendelseObject,
    'type' | 'id'
>;

const getSkjønnsfastsettelseTypeTekst = (type?: Maybe<Skjonnsfastsettingstype>) => {
    switch (type) {
        case 'ANNET':
            return 'Annet';
        case 'OMREGNET_ARSINNTEKT':
            return 'Omregnet årsinntekt';
        case 'RAPPORTERT_ARSINNTEKT':
            return 'Rapportert årsinntekt';
        default:
            return 'Omregnet årsinntekt';
    }
};

export const Sykepengegrunnlagskjønnsfastsettinghendelse = ({
    saksbehandler,
    timestamp,
    skjønnsfastsatt,
    arbeidsgivere,
}: SykepengegrunnlagskjønnsfastsettinghendelseProps): ReactElement => (
    <Historikkhendelse
        icon={
            <Kilde type={Inntektskilde.Saksbehandler}>
                <PersonPencilFillIcon title="Saksbehandler ikon" />
            </Kilde>
        }
        title="Sykepengegrunnlag skjønnsfastsatt"
        timestamp={timestamp}
        saksbehandler={saksbehandler}
        aktiv={false}
    >
        <div className={styles.Grid}>
            <BodyShort weight="semibold">Årsak </BodyShort>
            <BodyShort>{skjønnsfastsatt.arsak}</BodyShort>
            <BodyShort weight="semibold">Type skjønnsfastsettelse </BodyShort>
            <BodyShort>{getSkjønnsfastsettelseTypeTekst(skjønnsfastsatt.type)}</BodyShort>
            <BodyShort weight="semibold">Begrunnelse </BodyShort>
            <ExpandableHistorikkContent className={styles.begrunnelse}>
                <BodyShort>{skjønnsfastsatt.begrunnelseMal}</BodyShort>
            </ExpandableHistorikkContent>
            <BodyShort weight="semibold">Nærmere begrunnelse for skjønnsvurderingen </BodyShort>
            <BodyShort>{skjønnsfastsatt.begrunnelseFritekst}</BodyShort>
            <BodyShort weight="semibold">Konklusjon </BodyShort>
            <BodyShort>{skjønnsfastsatt.begrunnelseKonklusjon}</BodyShort>
            <BodyShort weight="semibold">Årsinntekt </BodyShort>
            <div className={styles.arbeidsgivere}>
                {arbeidsgivere.map((ag, index) => (
                    <Fragment key={`ag-${index}`}>
                        <AnonymizableText>{ag.navn}</AnonymizableText>
                        <BodyShort>
                            {ag.fraÅrlig !== ag.årlig && (
                                <span className={styles.FromValue}>{somPenger(ag.fraÅrlig)}</span>
                            )}
                            {somPenger(ag.årlig)}
                        </BodyShort>
                    </Fragment>
                ))}
            </div>
            <BodyShort weight="semibold">Skj. tidspunkt</BodyShort>
            <BodyShort>{getFormattedDateString(skjønnsfastsatt.skjaeringstidspunkt)}</BodyShort>
        </div>
    </Historikkhendelse>
);
