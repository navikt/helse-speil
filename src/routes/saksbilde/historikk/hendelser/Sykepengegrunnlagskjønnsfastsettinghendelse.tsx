import React, { Fragment, ReactElement } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { BodyLongWithPreWrap } from '@components/BodyLongWithPreWrap';
import { Kilde } from '@components/Kilde';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Inntektskilde, Maybe, Skjonnsfastsettingstype } from '@io/graphql';
import { Expandable } from '@saksbilde/historikk/komponenter/Expandable';
import { HistorikkSection } from '@saksbilde/historikk/komponenter/HistorikkSection';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { SykepengegrunnlagskjonnsfastsettinghendelseObject } from '@typer/historikk';
import { getFormattedDateString } from '@utils/date';
import { somPenger } from '@utils/locale';

import styles from './Inntektoverstyringhendelse.module.css';

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
                <BodyLongWithPreWrap>{skjønnsfastsatt.begrunnelseMal}</BodyLongWithPreWrap>
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
                        {ag.fraÅrlig !== ag.årlig && <span className={styles.fromvalue}>{somPenger(ag.fraÅrlig)}</span>}
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
