import React, { ReactElement } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { Inntektskilde } from '@io/graphql';
import { Historikkhendelse } from '@saksbilde/historikk/hendelser/Historikkhendelse';
import { HistorikkSection } from '@saksbilde/historikk/komponenter/HistorikkSection';
import { AnnetArbeidsforholdoverstyringhendelseObject } from '@typer/historikk';
import { getFormattedDateString } from '@utils/date';

type AnnetArbeidsforholdoverstyringhendelseProps = Omit<AnnetArbeidsforholdoverstyringhendelseObject, 'type' | 'id'>;

export const AnnetArbeidsforholdoverstyringhendelse = ({
    erDeaktivert,
    saksbehandler,
    timestamp,
    begrunnelse,
    forklaring,
    skjæringstidspunkt,
    navn,
}: AnnetArbeidsforholdoverstyringhendelseProps): ReactElement => {
    return (
        <Historikkhendelse
            icon={
                <Kilde type={Inntektskilde.Saksbehandler}>
                    <PersonPencilFillIcon title="Saksbehandler ikon" />
                </Kilde>
            }
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
                <AnonymizableTextWithEllipsis>{navn}</AnonymizableTextWithEllipsis>
            </HistorikkSection>
            <HistorikkSection tittel="Begrunnelse">
                <BodyShort>{begrunnelse}</BodyShort>
            </HistorikkSection>
            <HistorikkSection tittel="Begrunnelse">
                <BodyShort>{forklaring}</BodyShort>
            </HistorikkSection>
            <HistorikkSection tittel="Skj. tidspunkt">
                <BodyShort>{getFormattedDateString(skjæringstidspunkt)}</BodyShort>
            </HistorikkSection>
        </Historikkhendelse>
    );
};
