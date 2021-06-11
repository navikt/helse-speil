import styled from '@emotion/styled';
import { Dagtype, Kildetype, Overstyring } from 'internal-types';
import React, { ReactNode } from 'react';

import { Kilde } from '../../../../components/Kilde';

import { CellContent } from '../../table/CellContent';
import { IconOverstyrt } from '../../table/icons/IconOverstyrt';
import { Overstyringsindikator } from './Overstyringsindikator';

const getKildeTypeIcon = (type?: Kildetype, overstyring?: Overstyring): ReactNode => {
    switch (type) {
        case Kildetype.Sykmelding:
            return <Kilde type={Kildetype.Sykmelding}>SM</Kilde>;
        case Kildetype.Søknad:
            return <Kilde type={Kildetype.Søknad}>SØ</Kilde>;
        case Kildetype.Inntektsmelding:
            return <Kilde type={Kildetype.Inntektsmelding}>IM</Kilde>;
        case Kildetype.Saksbehandler:
            return overstyring ? (
                <Overstyringsindikator
                    begrunnelse={overstyring.begrunnelse}
                    saksbehandler={overstyring.saksbehandlerNavn}
                    dato={overstyring.timestamp}
                />
            ) : (
                <IconOverstyrt />
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
    overstyring?: Overstyring;
}

export const KildeCell = ({ type, kilde, overstyring, ...rest }: KildeCellProps) => (
    <td {...rest}>{type !== Dagtype.Helg && <Container>{getKildeTypeIcon(kilde, overstyring)}</Container>}</td>
);
