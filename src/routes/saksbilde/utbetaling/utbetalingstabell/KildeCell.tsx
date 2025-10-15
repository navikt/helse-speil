import React, { ReactElement } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { Table } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { Kildetype } from '@io/graphql';
import { EndringsloggButton } from '@saksbilde/sykepengegrunnlag/inntekt/EndringsloggButton';
import { CellContent } from '@saksbilde/table/CellContent';
import { OverstyringerPrDag, Utbetalingstabelldagtype } from '@typer/utbetalingstabell';

import { erHelgDagtype } from './helgUtils';

import styles from './KildeCell.module.css';

interface KildeTypeIconProps {
    kilde?: Kildetype;
    overstyringer?: OverstyringerPrDag[];
}

const KildeTypeIcon = ({ kilde, overstyringer }: KildeTypeIconProps): ReactElement | null => {
    switch (kilde) {
        case 'SYKMELDING':
            return <Kilde type={'Sykmelding'}>SM</Kilde>;
        case 'SOKNAD':
            return <Kilde type={'Soknad'}>SØ</Kilde>;
        case 'INNTEKTSMELDING':
            return <Kilde type={'Inntektsmelding'}>IM</Kilde>;
        case 'SAKSBEHANDLER':
            return overstyringer ? (
                <EndringsloggButton
                    // @ts-expect-error Se kommentar under
                    endringer={
                        // TODO: Dette ser ut som et type-brudd, siden OverstyringerPrDag ikke matcher 1:1 med OverstyringFragment
                        overstyringer
                    }
                />
            ) : (
                <Kilde type={'Saksbehandler'}>
                    <PersonPencilFillIcon title="Saksbehandler ikon" height={10} width={10} />
                </Kilde>
            );
        default:
            return null;
    }
};

interface KildeCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    type: Utbetalingstabelldagtype;
    kilde?: Kildetype;
    overstyringer?: OverstyringerPrDag[];
}

export const KildeCell = ({ type, kilde, overstyringer, ...rest }: KildeCellProps): ReactElement => {
    return (
        <Table.DataCell {...rest}>
            <CellContent className={styles.container}>
                {!erHelgDagtype(type) && <KildeTypeIcon kilde={kilde} overstyringer={overstyringer} />}
            </CellContent>
        </Table.DataCell>
    );
};
