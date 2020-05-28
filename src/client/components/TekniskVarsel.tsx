import Varsel, { Varseltype } from '@navikt/helse-frontend-varsel';
import styled from '@emotion/styled';
import React from 'react';
import { Error } from '../../types';

const Separator = styled.span`
    margin-left: 1rem;
    margin-right: 1rem;
`;
export const TekniskVarsel = ({ error }: { error?: Error }) => {
    if (!error) return null;
    return (
        <Varsel type={Varseltype.Feil}>
            {error.message}
            {error.technical && (
                <>
                    <Separator>|</Separator>
                    {error.technical}
                </>
            )}
        </Varsel>
    );
};
