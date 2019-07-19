'use strict';

import React from 'react';
import { render, cleanup } from 'react-testing-library';
import HeaderBar from '../../src/components/HeaderBar/HeaderBar';
import 'jest-dom/extend-expect';
import { AuthProvider } from '../../src/context/AuthContext';

const clgOrig = console.log;

afterEach(cleanup);

beforeAll(() => {
    // reduce noise in log
    console.log = jest.fn();
});

jest.mock('../../src/components/widgets/modal/ErrorModal', () => () => <div />);
jest.mock('../../src/components/Search/Search', () => () => <div />);

afterAll(() => {
    console.log = clgOrig;
});

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
    return `${btoa(JSON.stringify(header))}.${btoa(
        JSON.stringify(payload)
    )}.signaturehere`;
};
