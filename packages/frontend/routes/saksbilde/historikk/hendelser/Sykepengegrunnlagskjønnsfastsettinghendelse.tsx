import React from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Kilde } from '@components/Kilde';
import { Inntektskilde, Skjonnsfastsettingstype } from '@io/graphql';
import { getFormattedDateString } from '@utils/date';
import { somPengerUtenDesimaler } from '@utils/locale';

import { ExpandableHistorikkContent } from './ExpandableHistorikkContent';
import { Hendelse } from './Hendelse';
import { HendelseDate } from './HendelseDate';

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
}: SykepengegrunnlagskjønnsfastsettinghendelseProps) => (
    <>
        <Hendelse
            title="Sykepengegrunnlag skjønnsfastsatt"
            icon={
                <Kilde type={Inntektskilde.Saksbehandler}>
                    <CaseworkerFilled title="Caseworker-ikon" height={20} width={20} />
                </Kilde>
            }
        >
            <ExpandableHistorikkContent>
                <div className={styles.Grid}>
                    <Bold>Årsak </Bold>
                    <BodyShort>{skjønnsfastsatt.arsak}</BodyShort>
                    <Bold>Type skjønnsfastsettelse </Bold>
                    <BodyShort>{getSkjønnsfastsettelseTypeTekst(skjønnsfastsatt.type)}</BodyShort>
                    <Bold>Begrunnelse </Bold>
                    <BodyShort>{skjønnsfastsatt.begrunnelseMal}</BodyShort>
                    <Bold>Nærmere begrunnelse for skjønnsvurderingen </Bold>
                    <BodyShort>{skjønnsfastsatt.begrunnelseFritekst}</BodyShort>
                    <Bold>Konklusjon </Bold>
                    <BodyShort>{skjønnsfastsatt.begrunnelseKonklusjon}</BodyShort>
                    <Bold>Årsinntekt </Bold>
                    <BodyShort>
                        {skjønnsfastsatt.fraArlig && (
                            <span className={styles.FromValue}>{somPengerUtenDesimaler(skjønnsfastsatt.fraArlig)}</span>
                        )}
                        {somPengerUtenDesimaler(skjønnsfastsatt.arlig)}
                    </BodyShort>
                    <Bold>Skj. tidspunkt</Bold>
                    <BodyShort>{getFormattedDateString(skjønnsfastsatt.skjaeringstidspunkt)}</BodyShort>
                </div>
            </ExpandableHistorikkContent>
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
        </Hendelse>
    </>
);
