import { ReactElement } from 'react';

import { HStack, Skeleton, Table } from '@navikt/ds-react';

export function OppgaverBodySkeleton() {
    return (
        <>
            <BodyRowSkeleton />
            <BodyRowSkeleton />
            <BodyRowSkeleton />
            <BodyRowSkeleton />
            <BodyRowSkeleton />
            <BodyRowSkeleton />
            <BodyRowSkeleton />
        </>
    );
}

const BodyRowSkeleton = (): ReactElement => (
    <Table.Row>
        <Table.DataCell style={{ width: 220, paddingTop: 8, paddingBottom: 8 }}>
            <Skeleton width={120} height={32} />
        </Table.DataCell>
        <Table.DataCell style={{ paddingTop: 8, paddingBottom: 8 }}>
            <HStack gap="space-12" wrap={false}>
                <Skeleton width={96} height={32} />
                <Skeleton width={80} height={32} />
                <Skeleton width={110} height={32} />
            </HStack>
        </Table.DataCell>
        <Table.DataCell style={{ width: 140, paddingTop: 8, paddingBottom: 8 }}>
            <Skeleton width={120} height={32} />
        </Table.DataCell>
        <Table.DataCell style={{ width: 20, paddingRight: 0 }}>
            <Skeleton variant="circle" width={24} height={24} />
        </Table.DataCell>
        <Table.DataCell style={{ paddingTop: 8, paddingBottom: 8 }}>
            <Skeleton width={80} height={32} />
        </Table.DataCell>
    </Table.Row>
);
