import React from 'react';

import { RoundedButton } from './RoundedButton';
import { Kryssikon } from './ikoner/Kryssikon';

interface CloseButtonProps extends React.HTMLAttributes<HTMLButtonElement> {}

export const CloseButton = (props: CloseButtonProps) => (
    <RoundedButton {...props}>
        <Kryssikon />
    </RoundedButton>
);
