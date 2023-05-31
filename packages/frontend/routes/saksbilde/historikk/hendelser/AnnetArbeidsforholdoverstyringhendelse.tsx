import React from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { Inntektskilde } from '@io/graphql';
import { getFormattedDateString } from '@utils/date';

import { ExpandableHistorikkContent } from './ExpandableHistorikkContent';
import { Hendelse } from './Hendelse';
import { HendelseDate } from './HendelseDate';

import styles from './Overstyringshendelse.module.css';

interface ArbeidsforholdoverstyringhendelseProps extends Omit<ArbeidsforholdoverstyringhendelseObject, 'type' | 'id'> {}

export const AnnetArbeidsforholdoverstyringhendelse: React.FC<ArbeidsforholdoverstyringhendelseProps> = ({
    erDeaktivert,
    saksbehandler,
    timestamp,
    begrunnelse,
    forklaring,
    skjæringstidspunkt,
    navn,
}) => {
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
                    <CaseworkerFilled title="Caseworker-ikon" height={20} width={20} />
                </Kilde>
            }
        >
            <ExpandableHistorikkContent>
                <div className={styles.Grid}>
                    <BodyShort>Begrunnelse: </BodyShort>
                    <BodyShort>{begrunnelse}</BodyShort>
                    <BodyShort>Forklaring: </BodyShort>
                    <BodyShort>{forklaring}</BodyShort>
                    <BodyShort>Skj. tidspunkt:</BodyShort>
                    <BodyShort>{getFormattedDateString(skjæringstidspunkt)}</BodyShort>
                </div>
            </ExpandableHistorikkContent>
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
        </Hendelse>
    );
};
