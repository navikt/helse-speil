import React from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';

import { Endringstrekant } from '@components/Endringstrekant';
import { Flex } from '@components/Flex';
import { Kilde } from '@components/Kilde';
import { Kildetype } from '@io/graphql';
import { Refusjonsopplysning } from '@io/http';

import styles from './Refusjon.module.css';

interface KildeInputProps {
    kilde: string;
    lokalRefusjonsopplysning?: Refusjonsopplysning;
    fraRefusjonsopplysning?: Refusjonsopplysning;
}

export const Refusjonskilde = ({ kilde, lokalRefusjonsopplysning, fraRefusjonsopplysning }: KildeInputProps) => (
    <Flex alignItems="center">
        {kilde === Kildetype.Inntektsmelding && (
            <Kilde type={kilde} className={styles.Ikon}>
                IM
            </Kilde>
        )}
        {kilde === Kildetype.Saksbehandler &&
            (lokalRefusjonsopplysning && !erLikRefusjonsopplysning(lokalRefusjonsopplysning, fraRefusjonsopplysning) ? (
                <div style={{ position: 'relative', width: '20px' }}>
                    <Endringstrekant />
                </div>
            ) : (
                <Kilde type={kilde} className={styles.Ikon}>
                    <CaseworkerFilled title="Caseworker-ikon" height={12} width={12} />
                </Kilde>
            ))}
    </Flex>
);
const erLikRefusjonsopplysning = (a?: Refusjonsopplysning, b?: Refusjonsopplysning) =>
    JSON.stringify(a) === JSON.stringify(b);
