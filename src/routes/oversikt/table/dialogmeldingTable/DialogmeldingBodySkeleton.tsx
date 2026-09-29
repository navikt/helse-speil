import { ReactElement } from 'react';

import { Skeleton, Table } from '@navikt/ds-react';

export function DialogmeldingBodySkeleton(): ReactElement {
    return (
        <>
            {Array.from({ length: 7 }, (_, index) => (
                <DialogmeldingSkeletonRow key={index} />
            ))}
        </>
    );
}

function DialogmeldingSkeletonRow(): ReactElement {
    return (
        <Table.Row>
            <Table.DataCell>
                <Skeleton width={150} height={24} />
            </Table.DataCell>
            <Table.DataCell>
                <Skeleton width={110} height={24} />
            </Table.DataCell>
            <Table.DataCell>
                <Skeleton width={100} height={24} />
            </Table.DataCell>
            <Table.DataCell>
                <Skeleton width={170} height={24} />
            </Table.DataCell>
            <Table.DataCell>
                <Skeleton width={110} height={24} />
            </Table.DataCell>
            <Table.DataCell>
                <Skeleton width={95} height={24} />
            </Table.DataCell>
        </Table.Row>
    );
}
