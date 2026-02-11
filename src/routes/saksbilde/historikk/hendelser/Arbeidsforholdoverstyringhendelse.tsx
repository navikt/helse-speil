import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { HistorikkKildeSaksbehandlerIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { HistorikkSection } from '@saksbilde/historikk/komponenter/HistorikkSection';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { ArbeidsforholdoverstyringhendelseObject } from '@typer/historikk';
import { getFormattedDateString } from '@utils/date';

type ArbeidsforholdoverstyringhendelseProps = {
    hendelse: ArbeidsforholdoverstyringhendelseObject;
};

export const Arbeidsforholdoverstyringhendelse = ({
    hendelse: { erDeaktivert, saksbehandler, timestamp, begrunnelse, forklaring, skjæringstidspunkt },
}: ArbeidsforholdoverstyringhendelseProps): ReactElement => {
    return (
        <Historikkhendelse
            icon={<HistorikkKildeSaksbehandlerIkon />}
            title={erDeaktivert ? 'Brukes ikke i beregningen' : 'Brukes i beregningen'}
            timestamp={timestamp}
            saksbehandler={saksbehandler}
            aktiv={false}
        >
            <HistorikkSection tittel="Begrunnelse">
                <BodyShort>{begrunnelse}</BodyShort>
            </HistorikkSection>
            <HistorikkSection tittel="Forklaring">
                <BodyShortWithPreWrap>{forklaring}</BodyShortWithPreWrap>
            </HistorikkSection>
            <HistorikkSection tittel="Skj. tidspunkt">
                <BodyShort>{getFormattedDateString(skjæringstidspunkt)}</BodyShort>
            </HistorikkSection>
        </Historikkhendelse>
    );
};
