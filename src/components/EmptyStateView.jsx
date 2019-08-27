import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { tekster } from '../tekster';
import { Panel } from 'nav-frontend-paneler';

const styles = {
    margin: '1.5rem',
    display: 'inline-block',
    height: 'max-content'
};

const EmptyStateView = () => {
    return (
        <Panel border style={styles}>
            <Undertittel>{tekster('empty_state_message')}</Undertittel>
        </Panel>
    );
};

export default EmptyStateView;
