import React, { ReactElement } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { Inntektskilde } from '@io/graphql';
import { ArbeidsforholdoverstyringhendelseObject } from '@typer/historikk';
import { getFormattedDateString } from '@utils/date';

import { ExpandableHistorikkContent } from './ExpandableHistorikkContent';
import { Hendelse } from './Hendelse';
import { HendelseDate } from './HendelseDate';

import styles from './Overstyringshendelse.module.css';

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
        <Hendelse
            title={erDeaktivert ? 'Brukes ikke i beregningen' : 'Brukes i beregningen'}
            icon={
                <Kilde type={Inntektskilde.Saksbehandler}>
                    <PersonPencilFillIcon title="Saksbehandler ikon" />
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
