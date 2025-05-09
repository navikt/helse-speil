'use client';

import React, { ReactElement } from 'react';

import { Maybe } from '@io/graphql';
import { LeggTilTilkommenInntektView } from '@saksbilde/saksbilder/LeggTilTilkommenInntektView';

export default function Page(): Maybe<ReactElement> {
    return <LeggTilTilkommenInntektView />;
}
