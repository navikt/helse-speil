import styled from '@emotion/styled';
import { nanoid } from 'nanoid';
import React, { ReactNode, useRef } from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';

import { Flex } from '@components/Flex';
import { Kilde } from '@components/Kilde';
import { Tooltip } from '@components/Tooltip';

import { CellContent } from '../../table/CellContent';
import { EndringsloggTidslinjeButton } from './EndringsloggTidslinjeButton';

const getKildeTypeIcon = (type?: Sykdomsdag['kilde'], overstyringer?: Dagoverstyring[]): ReactNode => {
    switch (type) {
        case 'Sykmelding':
            return <Kilde type="Sykmelding">SM</Kilde>;
        case 'Søknad':
            return <Kilde type="Søknad">SØ</Kilde>;
        case 'Inntektsmelding':
            return <Kilde type="Inntektsmelding">IM</Kilde>;
        case 'Saksbehandler':
            return overstyringer ? (
                <EndringsloggTidslinjeButton endringer={overstyringer} />
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

interface KildeCellProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
    type: Dag['type'];
    kilde?: Sykdomsdag['kilde'];
    overstyringer?: Dagoverstyring[];
}

export const KildeCell = ({ type, kilde, overstyringer, ...rest }: KildeCellProps) => {
    const tooltipId = useRef(nanoid()).current;

    return (
        <td {...rest}>
            <Container>
                {type !== 'Helg' && (
                    <>
                        <span data-tip={kilde} data-for={tooltipId}>
                            {getKildeTypeIcon(kilde, overstyringer)}
                        </span>
                        <Tooltip id={tooltipId} effect="solid" />
                    </>
                )}
            </Container>
        </td>
    );
};
