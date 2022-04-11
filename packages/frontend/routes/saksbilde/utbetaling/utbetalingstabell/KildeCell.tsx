import styled from '@emotion/styled';
import { nanoid } from 'nanoid';
import React, { ReactNode, useRef } from 'react';
import { CaseworkerFilled } from '@navikt/ds-icons';

import { Flex } from '@components/Flex';
import { Kilde } from '@components/Kilde';
import { Tooltip } from '@components/Tooltip';
import { Kildetype, Overstyring } from '@io/graphql';

import { CellContent } from '../../table/CellContent';
import { EndringsloggButton } from '../../sykepengegrunnlag/inntekt/EndringsloggButton';

const getKildeTypeIcon = (
    dato: DateString,
    kilde?: Kildetype,
    overstyringer?: Array<OverstyringerPrDag>,
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
                <Flex>
                    <CaseworkerFilled height={20} width={20} />
                </Flex>
            );
        default:
            return null;
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
    const tooltipId = useRef(nanoid()).current;

    return (
        <td {...rest}>
            <Container>
                {type !== 'Helg' && (
                    <>
                        <span data-tip={kilde} data-for={tooltipId}>
                            {getKildeTypeIcon(dato, kilde, overstyringer)}
                        </span>
                        <Tooltip id={tooltipId} effect="solid" />
                    </>
                )}
            </Container>
        </td>
    );
};
