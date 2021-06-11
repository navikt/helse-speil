import React from 'react';

import { RoundedButton } from '../../../components/RoundedButton';
import { Kryssikon } from '../../../components/ikoner/Kryssikon';

interface CloseButtonProps extends React.HTMLAttributes<HTMLButtonElement> {}

export const CloseButton = (props: CloseButtonProps) => (
    <RoundedButton {...props}>
        <Kryssikon />
    </RoundedButton>
);
