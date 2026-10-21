import { Provider, type WritableAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import React, { PropsWithChildren, ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { BrukerContext } from '@auth/brukerContext';
import { AnonymizationProvider } from '@components/anonymization/context';

interface JotaiProps {
    atomValues?: Iterable<readonly [WritableAtom<unknown, [never], unknown>, unknown]>;
}

export const JotaiWrapper = ({ children, atomValues }: PropsWithChildren<JotaiProps>): ReactElement => {
    return (
        <BrukerContext.Provider
            value={{
                oid: 'test-oid',
                epost: 'test-username',
                navn: 'Test User',
                ident: 'Otest123',
            }}
        >
            <Provider>
                <AnonymizationProvider>
                    <HydrateAtoms atomValues={atomValues}>{children}</HydrateAtoms>
                </AnonymizationProvider>
            </Provider>
        </BrukerContext.Provider>
    );
};

function HydrateAtoms({ atomValues, children }: PropsWithChildren<JotaiProps>) {
    useHydrateAtoms(
        new Map(
            atomValues
                ? Array.from(atomValues, ([atom, value]) => [
                      atom as unknown as WritableAtom<unknown, [unknown], unknown>,
                      value,
                  ])
                : [],
        ),
    );
    return children;
}

export const TestCellWrapper = ({ children }: PropsWithChildren): ReactElement => (
    <Table>
        <Table.Body>
            <Table.Row>{children}</Table.Row>
        </Table.Body>
    </Table>
);

export const TestRowWrapper = ({ children }: PropsWithChildren): ReactElement => (
    <Table>
        <Table.Body>{children}</Table.Body>
    </Table>
);
