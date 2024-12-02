import React, { ReactElement } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { Inntektskilde, VedtakUtfall } from '@io/graphql';
import { VedtakBegrunnelseObject } from '@typer/historikk';

import { ExpandableHistorikkContent } from './ExpandableHistorikkContent';
import { Hendelse } from './Hendelse';
import { HendelseDate } from './HendelseDate';

import styles from './Overstyringshendelse.module.css';

type VedtakBegrunnelsehendelseProps = Omit<VedtakBegrunnelseObject, 'type' | 'id'>;

export const VedtakBegrunnelsehendelse = ({
    utfall,
    begrunnelse,
    saksbehandler,
    timestamp,
}: VedtakBegrunnelsehendelseProps): ReactElement => {
    return (
        <Hendelse
            title="Individuell begrunnelse"
            icon={
                <Kilde type={Inntektskilde.Saksbehandler}>
                    <PersonPencilFillIcon title="Saksbehandler ikon" />
                </Kilde>
            }
        >
            <ExpandableHistorikkContent>
                <div className={styles.Grid}>
                    <BodyShort weight="semibold">Type: </BodyShort>
                    <BodyShort>{tekstForUtfall(utfall)}</BodyShort>
                    <BodyShort weight="semibold">Begrunnelse: </BodyShort>
                    <BodyShort>{begrunnelse ?? ''}</BodyShort>
                </div>
            </ExpandableHistorikkContent>
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
        </Hendelse>
    );
};

const tekstForUtfall = (utfall: VedtakUtfall) => {
    switch (utfall) {
        case VedtakUtfall.Avslag:
            return 'Avslag';
        case VedtakUtfall.DelvisInnvilgelse:
            return 'Delvis innvilgelse';
        case VedtakUtfall.Innvilgelse:
            return 'Innvilgelse';
    }
};
