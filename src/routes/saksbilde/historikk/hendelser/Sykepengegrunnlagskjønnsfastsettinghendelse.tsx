import React, { Fragment, ReactElement } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyLong, BodyShort } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Inntektskilde, Maybe, Skjonnsfastsettingstype } from '@io/graphql';
import { Expandable } from '@saksbilde/historikk/hendelser/Expandable';
import { Historikkhendelse } from '@saksbilde/historikk/hendelser/Historikkhendelse';
import { HistorikkSection } from '@saksbilde/historikk/komponenter/HistorikkSection';
import { SykepengegrunnlagskjonnsfastsettinghendelseObject } from '@typer/historikk';
import { getFormattedDateString } from '@utils/date';
import { somPenger } from '@utils/locale';

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
        <HistorikkSection tittel="Årsak">
            <BodyShort>{skjønnsfastsatt.arsak}</BodyShort>
        </HistorikkSection>
        <HistorikkSection tittel="Type skjønnsfastsettelse">
            <BodyShort>{getSkjønnsfastsettelseTypeTekst(skjønnsfastsatt.type)}</BodyShort>
        </HistorikkSection>
        <HistorikkSection tittel="Begrunnelse">
            <Expandable expandText="Åpne" collapseText="Lukk">
                <BodyLong className={styles.begrunnelse}>{skjønnsfastsatt.begrunnelseMal}</BodyLong>
            </Expandable>
        </HistorikkSection>
        <HistorikkSection tittel="Nærmere begrunnelse for skjønnsvurderingen">
            <BodyShort>{skjønnsfastsatt.begrunnelseFritekst}</BodyShort>
        </HistorikkSection>
        <HistorikkSection tittel="Konklusjon">
            <BodyShort>{skjønnsfastsatt.begrunnelseKonklusjon}</BodyShort>
        </HistorikkSection>
        <HistorikkSection tittel="Årsinntekt">
            {arbeidsgivere.map((ag, index) => (
                <Fragment key={`ag-${index}`}>
                    <AnonymizableText>{ag.navn}</AnonymizableText>
                    <BodyShort>
                        {ag.fraÅrlig !== ag.årlig && <span className={styles.FromValue}>{somPenger(ag.fraÅrlig)}</span>}
                        {somPenger(ag.årlig)}
                    </BodyShort>
                </Fragment>
            ))}
        </HistorikkSection>
        <HistorikkSection tittel="Skj. tidspunkt">
            <BodyShort>{getFormattedDateString(skjønnsfastsatt.skjaeringstidspunkt)}</BodyShort>
        </HistorikkSection>
    </Historikkhendelse>
);
