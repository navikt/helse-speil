import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Button } from '@components/Button';

import styles from './Refusjon.module.css';

interface SlettRefusjonsopplysningKnappProps {
    onClick: () => void;
}

export const SlettRefusjonsopplysningKnapp = ({ onClick }: SlettRefusjonsopplysningKnappProps) => (
    <Button type="button" onClick={onClick} className={styles.Button} style={{ justifySelf: 'flex-end' }}>
        <BodyShort>Slett</BodyShort>
    </Button>
);
