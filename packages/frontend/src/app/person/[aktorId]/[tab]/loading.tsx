'use client';

import React, { ReactElement } from 'react';

import { SaksbildeMenuSkeleton } from '@/routes/saksbilde/saksbildeMenu/SaksbildeMenu';

function Loading(): ReactElement {
    return <SaksbildeMenuSkeleton />;
}

export default Loading;
