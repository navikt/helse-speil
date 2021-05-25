import '@testing-library/jest-dom/extend-expect';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';

import { authState, useAuthentication } from './authentication';

const loggedInAuthInfo = {
    name: 'Fornavn Etternavn',
    ident: 'Ident',
    email: 'fornavn.etternavn@nav.no',
    isLoggedIn: true,
};

jest.mock('../utils/cookie', () => ({
    extractValues: (_: any) => [loggedInAuthInfo.name, loggedInAuthInfo.ident, loggedInAuthInfo.email],
    Keys: { NAME: '', IDENT: '', EMAIL: '' },
}));

const Wrapper: React.FC = ({ children }) => <RecoilRoot>{children}</RecoilRoot>;

describe('useAuthentication', () => {
    test('oppdaterer authInfo med verdier fra cookie', () => {
        const { result } = renderHook(
            () => {
                useAuthentication();
                return useRecoilValue(authState);
            },
            { wrapper: Wrapper }
        );

        expect(result.current).toEqual(loggedInAuthInfo);
    });
});
