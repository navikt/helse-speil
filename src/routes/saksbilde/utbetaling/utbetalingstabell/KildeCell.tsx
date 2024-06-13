import React from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';

import { Kilde } from '@components/Kilde';
import { Kildetype } from '@io/graphql';
import { EndringsloggButton } from '@saksbilde/sykepengegrunnlag/inntekt/EndringsloggButton';
import { CellContent } from '@saksbilde/table/CellContent';
import { OverstyringerPrDag, Utbetalingstabelldagtype } from '@typer/utbetalingstabell';

import { erHelg } from './helgUtils';

import styles from './KildeCell.module.css';

interface KildeTypeIconProps {
    kilde?: Kildetype;
    overstyringer?: Array<OverstyringerPrDag>;
}

const KildeTypeIcon = ({ kilde, overstyringer }: KildeTypeIconProps) => {
    switch (kilde) {
        case 'SYKMELDING':
            return <Kilde type={Kildetype.Sykmelding}>SM</Kilde>;
        case 'SOKNAD':
            return <Kilde type={Kildetype.Soknad}>SØ</Kilde>;
        case 'INNTEKTSMELDING':
            return <Kilde type={Kildetype.Inntektsmelding}>IM</Kilde>;
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
                <Kilde type={Kildetype.Saksbehandler}>
                    <CaseworkerFilled title="Caseworker-ikon" height={10} width={10} />
                </Kilde>
            );
        default:
            return null;
    }
};

interface KildeCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    type: Utbetalingstabelldagtype;
    kilde?: Kildetype;
    overstyringer?: Array<OverstyringerPrDag>;
}

export const KildeCell = ({ type, kilde, overstyringer, ...rest }: KildeCellProps) => {
    return (
        <td {...rest}>
            <CellContent className={styles.container}>
                {!erHelg(type) && <KildeTypeIcon kilde={kilde} overstyringer={overstyringer} />}
            </CellContent>
        </td>
    );
};
