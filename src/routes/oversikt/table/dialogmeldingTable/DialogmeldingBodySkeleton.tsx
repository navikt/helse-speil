import { ReactElement } from 'react';

import { Skeleton, Table } from '@navikt/ds-react';

export function DialogmeldingBodySkeleton(): ReactElement {
    return (
        <>
            <DialogmeldingSkeletonRow />
            <DialogmeldingSkeletonRow />
            <DialogmeldingSkeletonRow />
            <DialogmeldingSkeletonRow />
            <DialogmeldingSkeletonRow />
            <DialogmeldingSkeletonRow />
            <DialogmeldingSkeletonRow />
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
