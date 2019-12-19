'use strict';

import React from 'react';
import HeaderBar from './HeaderBar';
import { AuthProvider } from '../../context/AuthContext.tsx';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

jest.mock('react-router-dom', () => ({
    Link: () => <div />
}));
jest.mock('../ErrorModal', () => () => <div />);
jest.mock('../Search', () => () => <div />);

test('name of logged in user is retrieved from cookie', async () => {
    const { getByText } = render(<HeaderBar />);
    expect(getByText('Ikke pålogget')).toBeDefined();

    const name = 'Navn Med Æøå';
    Object.defineProperty(document, 'cookie', {
        get: jest.fn().mockImplementation(() => {
            return `name=whateverelse; speil=${createJWT(name)}`;
        }),
        set: jest.fn().mockImplementation(() => {})
    });

    render(
        <AuthProvider>
            <HeaderBar />
        </AuthProvider>
    );

    expect(getByText(name)).toBeDefined();
});

const createJWT = name => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = { sub: '1234567890', name: name, iat: 1516239022 };
    return `${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(payload))}.signaturehere`;
};
