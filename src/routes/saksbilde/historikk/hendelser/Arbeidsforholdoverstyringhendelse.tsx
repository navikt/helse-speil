import React, { ReactElement } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { Inntektskilde } from '@io/graphql';
import { HistorikkSection } from '@saksbilde/historikk/komponenter/HistorikkSection';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { ArbeidsforholdoverstyringhendelseObject } from '@typer/historikk';
import { getFormattedDateString } from '@utils/date';

type ArbeidsforholdoverstyringhendelseProps = Omit<ArbeidsforholdoverstyringhendelseObject, 'type' | 'id'>;

export const Arbeidsforholdoverstyringhendelse = ({
    erDeaktivert,
    saksbehandler,
    timestamp,
    begrunnelse,
    forklaring,
    skjæringstidspunkt,
}: ArbeidsforholdoverstyringhendelseProps): ReactElement => {
    return (
        <Historikkhendelse
            icon={
                <Kilde type={Inntektskilde.Saksbehandler}>
                    <PersonPencilFillIcon title="Saksbehandler ikon" />
                </Kilde>
            }
            title={erDeaktivert ? 'Brukes ikke i beregningen' : 'Brukes i beregningen'}
            timestamp={timestamp}
            saksbehandler={saksbehandler}
            aktiv={false}
        >
            <HistorikkSection tittel="Begrunnelse">
                <BodyShort>{begrunnelse}</BodyShort>
            </HistorikkSection>
            <HistorikkSection tittel="Forklaring">
                <BodyShort>{forklaring}</BodyShort>
            </HistorikkSection>
            <HistorikkSection tittel="Skj. tidspunkt">
                <BodyShort>{getFormattedDateString(skjæringstidspunkt)}</BodyShort>
            </HistorikkSection>
        </Historikkhendelse>
    );
};
