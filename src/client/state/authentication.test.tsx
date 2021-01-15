import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { renderHook } from '@testing-library/react-hooks';
import { authState, useAuthentication } from './authentication';
import { RecoilRoot, useRecoilValue } from 'recoil';

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
