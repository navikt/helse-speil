import styled from '@emotion/styled';
import React, { ReactNode } from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';
import { Tooltip } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { Kildetype } from '@io/graphql';

import { EndringsloggButton } from '../../sykepengegrunnlag/inntekt/EndringsloggButton';
import { CellContent } from '../../table/CellContent';
import { erEksplisittHelg } from './Utbetalingstabell';

const getKildeTypeIcon = (
    dato: DateString,
    kilde?: Kildetype,
    overstyringer?: Array<OverstyringerPrDag>
): ReactNode => {
    switch (kilde) {
        case 'SYKMELDING':
            return <Kilde type={Kildetype.Sykmelding}>SM</Kilde>;
        case 'SOKNAD':
            return <Kilde type={Kildetype.Soknad}>SØ</Kilde>;
        case 'INNTEKTSMELDING':
            return <Kilde type={Kildetype.Inntektsmelding}>IM</Kilde>;
        case 'SAKSBEHANDLER':
            return overstyringer ? (
                <EndringsloggButton endringer={overstyringer} />
            ) : (
                <Kilde type={Kildetype.Saksbehandler}>
                    <CaseworkerFilled height={10} width={10} />
                </Kilde>
            );
        default:
            return null;
    }
};

export const getKildeTypeTooltip = (kilde?: Kildetype): string => {
    switch (kilde) {
        case Kildetype.Inntektsmelding:
            return 'Inntektsmelding';
        case Kildetype.Soknad:
            return 'Søknad';
        case Kildetype.Sykmelding:
            return 'Sykmelding';
        case Kildetype.Saksbehandler:
            return 'Saksbehandler';
        default:
            return 'Ukjent';
    }
};

const Container = styled(CellContent)`
    width: 2rem;
    justify-content: center;
`;

interface KildeCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    type: Utbetalingstabelldagtype;
    dato: DateString;
    kilde?: Kildetype;
    overstyringer?: Array<OverstyringerPrDag>;
}

export const KildeCell = ({ type, dato, kilde, overstyringer, ...rest }: KildeCellProps) => {
    return (
        <td {...rest}>
            <Container>
                {!erEksplisittHelg(type) && (
                    <>
                        <Tooltip content={getKildeTypeTooltip(kilde)}>
                            <span>{getKildeTypeIcon(dato, kilde, overstyringer)}</span>
                        </Tooltip>
                    </>
                )}
            </Container>
        </td>
    );
};
