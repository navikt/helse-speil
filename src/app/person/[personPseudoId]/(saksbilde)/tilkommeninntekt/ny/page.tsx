'use client';

import React, {ReactElement} from 'react';

import {erUtvikling} from '@/env';
import {
    LeggTilTilkommenInntektEllerAndreYtelserView
} from '@saksbilde/tilkommenInntekt/saksbilde/LeggTilTilkommenInntektEllerAndreYtelserView';
import {LeggTilTilkommenInntektView} from '@saksbilde/tilkommenInntekt/saksbilde/LeggTilTilkommenInntektView';

export default function Page(): ReactElement | null {
    return erUtvikling ? <LeggTilTilkommenInntektEllerAndreYtelserView /> : <LeggTilTilkommenInntektView />;
}
