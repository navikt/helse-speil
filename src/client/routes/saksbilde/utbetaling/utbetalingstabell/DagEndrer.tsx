import styled from '@emotion/styled';
import React from 'react';

import { Select, TextField, Button } from '@navikt/ds-react';

import { Flex } from '../../../../components/Flex';

const Container = styled.div`
    background-color: var(--navds-color-gray-10);
    padding: 2rem;
    .navds-select__container {
        width: 137px;
    }
    label {
        font-weight: normal;
    }
    > div > * {
        box-sizing: border-box;
        height: max-content;
        margin-right: 10px;
    }
    > div > button:first-of-type {
        margin-left: 10px;
    }
`;
export const DagEndrer = () => {
    return (
        <Container>
            <Flex alignItems={'flex-end'}>
                <Select size="s" label="Utbet. dager">
                    "OPTION 1"
                </Select>
                <TextField size="s" type={'number'} label={'Grad'} />
                <Button size="s">Endre</Button>
                <Button size="s" variant={'secondary'}>
                    Avbryt
                </Button>
            </Flex>
        </Container>
    );
};
