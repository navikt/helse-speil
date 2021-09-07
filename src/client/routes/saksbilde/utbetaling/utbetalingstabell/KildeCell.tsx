import styled from '@emotion/styled';
import { Dagtype, Kildetype } from 'internal-types';
import { nanoid } from 'nanoid';
import React, { ReactNode, useRef } from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';

import { Flex } from '../../../../components/Flex';
import { Kilde } from '../../../../components/Kilde';
import { Tooltip } from '../../../../components/Tooltip';

import { CellContent } from '../../table/CellContent';
import { OverstyringsindikatorSaksbehandler } from './OverstyringsindikatorSaksbehandler';
import { Dagoverstyring } from './Utbetalingstabell.types';

const getKildeTypeIcon = (type?: Kildetype, overstyring?: Dagoverstyring): ReactNode => {
    switch (type) {
        case Kildetype.Sykmelding:
            return <Kilde type={Kildetype.Sykmelding}>SM</Kilde>;
        case Kildetype.Søknad:
            return <Kilde type={Kildetype.Søknad}>SØ</Kilde>;
        case Kildetype.Inntektsmelding:
            return <Kilde type={Kildetype.Inntektsmelding}>IM</Kilde>;
        case Kildetype.Saksbehandler:
            return overstyring ? (
                <OverstyringsindikatorSaksbehandler
                    begrunnelse={overstyring.begrunnelse}
                    saksbehandler={overstyring.navn}
                    dato={overstyring.timestamp}
                />
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
    type: Dagtype;
    kilde?: Kildetype;
    overstyring?: Dagoverstyring;
}

export const KildeCell = ({ type, kilde, overstyring, ...rest }: KildeCellProps) => {
    const tooltipId = useRef(nanoid()).current;
    return (
        <td {...rest}>
            <Container>
                {type !== Dagtype.Helg && (
                    <>
                        <span data-tip={kilde} data-for={tooltipId}>
                            {getKildeTypeIcon(kilde, overstyring)}
                        </span>
                        <Tooltip id={tooltipId} effect="solid" />
                    </>
                )}
            </Container>
        </td>
    );
};
