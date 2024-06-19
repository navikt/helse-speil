import classNames from 'classnames';
import React, { ReactElement, useState } from 'react';

import { StopWatch } from '@navikt/ds-icons';
import { Button, Table, Tooltip } from '@navikt/ds-react';

import { Maybe, NotatType, Personnavn } from '@io/graphql';
import { SisteNotattekst } from '@oversikt/table/oppgaverTable/SisteNotattekst';
import { useNotaterForVedtaksperiode } from '@state/notater';

import { PåVentListeModal } from './PåVentListeModal';

import styles from './PåVentCell.module.css';

interface NotatCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    vedtaksperiodeId: string;
    navn: Personnavn;
    erPåVent?: boolean;
    utgåttFrist: boolean;
}

export const PåVentCell = ({ vedtaksperiodeId, navn, erPåVent, utgåttFrist }: NotatCellProps): ReactElement => {
    return (
        <Table.DataCell
            onClick={(event) => event.stopPropagation()}
            className={classNames(styles.PåVentCell, utgåttFrist && styles.utgåttFrist)}
        >
            {erPåVent && (
                <div className={styles.KnappOgTekst}>
                    <PåVentKnapp
                        vedtaksperiodeId={vedtaksperiodeId}
                        navn={navn}
                        erPåVent={erPåVent}
                        utgåttFrist={utgåttFrist}
                    />
                    <SisteNotattekst vedtaksperiodeId={vedtaksperiodeId} />
                </div>
            )}
        </Table.DataCell>
    );
};

const PåVentKnapp = ({ vedtaksperiodeId, navn, erPåVent, utgåttFrist }: NotatCellProps): Maybe<ReactElement> => {
    const [showModal, setShowModal] = useState(false);
    const notater = useNotaterForVedtaksperiode(vedtaksperiodeId).filter((it) => it.type === NotatType.PaaVent);

    const toggleModal = (event: React.SyntheticEvent) => {
        event.stopPropagation();
        if (event.type === 'keyup' && !['Space', 'Enter'].includes((event as React.KeyboardEvent).key)) return;
        setShowModal((prevState) => !prevState);
    };

    return notater.length > 0 ? (
        <>
            <Tooltip content="Lagt på vent">
                <Button
                    variant="secondary"
                    className={classNames(styles.NotatButton, utgåttFrist && styles.utgåttFrist)}
                    onClick={toggleModal}
                    onKeyUp={toggleModal}
                >
                    <StopWatch height={20} width={20} aria-label="Vis lagt på vent-notater" />
                </Button>
            </Tooltip>
            {showModal && (
                <PåVentListeModal
                    setShowModal={(visModal) => setShowModal(visModal)}
                    showModal={showModal}
                    notater={notater}
                    vedtaksperiodeId={vedtaksperiodeId}
                    navn={navn}
                    erPåVent={erPåVent}
                />
            )}
        </>
    ) : null;
};
