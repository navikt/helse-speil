import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { HistorikkKildeSaksbehandlerIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { HistorikkSection } from '@saksbilde/historikk/komponenter/HistorikkSection';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { AnnetArbeidsforholdoverstyringhendelseObject } from '@typer/historikk';
import { getFormattedDateString } from '@utils/date';

type AnnetArbeidsforholdoverstyringhendelseProps = {
    hendelse: AnnetArbeidsforholdoverstyringhendelseObject;
};

export const AnnetArbeidsforholdoverstyringhendelse = ({
    hendelse: {
        erDeaktivert,
        saksbehandler,
        timestamp,
        begrunnelse,
        forklaring,
        skjæringstidspunkt,
        inntektsforholdReferanse,
    },
}: AnnetArbeidsforholdoverstyringhendelseProps): ReactElement => {
    return (
        <Historikkhendelse
            icon={<HistorikkKildeSaksbehandlerIkon />}
            title={
                erDeaktivert
                    ? `Annet arbeidsforhold brukes ikke i beregningen`
                    : 'Annet arbeidsforhold brukes i beregningen'
            }
            timestamp={timestamp}
            saksbehandler={saksbehandler}
            aktiv={false}
        >
            <HistorikkSection tittel="Arbeidsgiver">
                <Inntektsforholdnavn inntektsforholdReferanse={inntektsforholdReferanse} />
            </HistorikkSection>
            <HistorikkSection tittel="Begrunnelse">
                <BodyShort>{begrunnelse}</BodyShort>
            </HistorikkSection>
            <HistorikkSection tittel="Begrunnelse">
                <BodyShortWithPreWrap>{forklaring}</BodyShortWithPreWrap>
            </HistorikkSection>
            <HistorikkSection tittel="Skj. tidspunkt">
                <BodyShort>{getFormattedDateString(skjæringstidspunkt)}</BodyShort>
            </HistorikkSection>
        </Historikkhendelse>
    );
};
