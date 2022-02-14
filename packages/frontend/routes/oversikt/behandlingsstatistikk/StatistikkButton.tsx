import React from 'react';

import { RoundedButton } from '@components/RoundedButton';

import { IconStatistikk } from './IconStatistikk';
import { useToggleStatistikk } from './state';

interface StatistikkButtonProps extends React.HTMLAttributes<HTMLButtonElement> {}

export const StatistikkButton = (props: StatistikkButtonProps) => {
    const toggleStatistikk = useToggleStatistikk();

    return (
        <RoundedButton {...props} aria-label="Toggle visning av behandlingsstatistikk" onClick={toggleStatistikk}>
            <IconStatistikk height={16} width={16} viewBox="0 0 22 22" />
        </RoundedButton>
    );
};
