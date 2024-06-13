import React, { ReactElement } from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Kilde } from '@components/Kilde';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
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
                    <CaseworkerFilled title="Caseworker-ikon" height={20} width={20} />
                </Kilde>
            }
        >
            <ExpandableHistorikkContent>
                <div className={styles.Grid}>
                    <Bold>Begrunnelse: </Bold>
                    <BodyShort>{begrunnelse}</BodyShort>
                    <Bold>Forklaring: </Bold>
                    <BodyShort>{forklaring}</BodyShort>
                    <Bold>Skj. tidspunkt:</Bold>
                    <BodyShort>{getFormattedDateString(skjæringstidspunkt)}</BodyShort>
                </div>
            </ExpandableHistorikkContent>
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
        </Hendelse>
    );
};
