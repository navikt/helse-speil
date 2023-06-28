import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Button } from '@components/Button';

import styles from './Refusjon.module.css';

interface LeggTilRefusjonsopplysningKnappProps {
    onClick: () => void;
}

export const LeggTilRefusjonsopplysningKnapp = ({ onClick }: LeggTilRefusjonsopplysningKnappProps) => (
    <Button type="button" onClick={onClick} className={styles.Button} style={{ marginTop: 0 }}>
        <BodyShort>+ Legg til</BodyShort>
    </Button>
);
