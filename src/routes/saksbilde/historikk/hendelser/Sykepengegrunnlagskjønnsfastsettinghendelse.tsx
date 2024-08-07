import React, { Fragment, ReactElement } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Kilde } from '@components/Kilde';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Inntektskilde, Maybe, Skjonnsfastsettingstype } from '@io/graphql';
import { SykepengegrunnlagskjonnsfastsettinghendelseObject } from '@typer/historikk';
import { getFormattedDateString } from '@utils/date';
import { somPenger } from '@utils/locale';

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
    arbeidsgivere,
}: SykepengegrunnlagskjønnsfastsettinghendelseProps): ReactElement => (
    <>
        <Hendelse
            title="Sykepengegrunnlag skjønnsfastsatt"
            icon={
                <Kilde type={Inntektskilde.Saksbehandler}>
                    <PersonPencilFillIcon title="Saksbehandler ikon" height={20} width={20} />
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
                    <ExpandableHistorikkContent className={styles.begrunnelse}>
                        <BodyShort>{skjønnsfastsatt.begrunnelseMal}</BodyShort>
                    </ExpandableHistorikkContent>
                    <Bold>Nærmere begrunnelse for skjønnsvurderingen </Bold>
                    <BodyShort>{skjønnsfastsatt.begrunnelseFritekst}</BodyShort>
                    <Bold>Konklusjon </Bold>
                    <BodyShort>{skjønnsfastsatt.begrunnelseKonklusjon}</BodyShort>
                    <Bold>Årsinntekt </Bold>
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
                    <Bold>Skj. tidspunkt</Bold>
                    <BodyShort>{getFormattedDateString(skjønnsfastsatt.skjaeringstidspunkt)}</BodyShort>
                </div>
            </ExpandableHistorikkContent>
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
        </Hendelse>
    </>
);
