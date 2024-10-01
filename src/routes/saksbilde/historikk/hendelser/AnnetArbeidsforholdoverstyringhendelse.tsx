import React, { ReactElement } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { Inntektskilde } from '@io/graphql';
import { AnnetArbeidsforholdoverstyringhendelseObject } from '@typer/historikk';
import { getFormattedDateString } from '@utils/date';

import { ExpandableHistorikkContent } from './ExpandableHistorikkContent';
import { Hendelse } from './Hendelse';
import { HendelseDate } from './HendelseDate';

import styles from './Overstyringshendelse.module.css';

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
        <Hendelse
            title={
                <span>
                    {erDeaktivert
                        ? `Annet arbeidsforhold brukes ikke i beregningen`
                        : 'Annet arbeidsforhold brukes i beregningen'}
                    <AnonymizableTextWithEllipsis> ({navn})</AnonymizableTextWithEllipsis>
                </span>
            }
            icon={
                <Kilde type={Inntektskilde.Saksbehandler}>
                    <PersonPencilFillIcon title="Saksbehandler ikon" height={20} width={20} />
                </Kilde>
            }
        >
            <ExpandableHistorikkContent>
                <div className={styles.Grid}>
                    <BodyShort weight="semibold">Begrunnelse: </BodyShort>
                    <BodyShort>{begrunnelse}</BodyShort>
                    <BodyShort weight="semibold">Forklaring: </BodyShort>
                    <BodyShort>{forklaring}</BodyShort>
                    <BodyShort weight="semibold">Skj. tidspunkt:</BodyShort>
                    <BodyShort>{getFormattedDateString(skjæringstidspunkt)}</BodyShort>
                </div>
            </ExpandableHistorikkContent>
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
        </Hendelse>
    );
};
