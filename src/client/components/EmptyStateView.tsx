import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { Panel } from 'nav-frontend-paneler';
import { useTranslation } from 'react-i18next';

const styles = {
    margin: '1.5rem',
    display: 'inline-block',
    height: 'max-content'
};

const EmptyStateView = () => {
    const { t } = useTranslation();

    return (
        <Panel border style={styles} className="EmptyStateView">
            <Undertittel>{t('empty_state_message')}</Undertittel>
        </Panel>
    );
};

export default EmptyStateView;
