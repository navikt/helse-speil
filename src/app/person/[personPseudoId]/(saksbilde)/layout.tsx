'use client';

import React, { PropsWithChildren, ReactElement } from 'react';

import { VenterPåEndringProvider } from '@saksbilde/VenterPåEndringContext';
import { Tidslinje } from '@saksbilde/tidslinje/Tidslinje';

export default function Layout({ children }: PropsWithChildren): ReactElement {
    return (
        <div className="contents">
            <Tidslinje />
            <VenterPåEndringProvider>{children}</VenterPåEndringProvider>
        </div>
    );
}
