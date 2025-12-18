import dayjs from 'dayjs';
import React, { PropsWithChildren, useRef } from 'react';

import { BellFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Dropdown, HStack, InternalHeader as Header } from '@navikt/ds-react';

import { Nyhet } from '@components/header/nyheter/Nyhet';
import { BjelleDottIkon } from '@components/ikoner/BjelleDottIkon';
import { useNyheter } from '@external/sanity';

import styles from './Nyheter.module.scss';

export const Nyheter = () => {
    const { nyheter, loading } = useNyheter();
    const sisteNyhet = nyheter[0];
    const harBlittÅpnet = useRef(false);

    const skalViseIkonMedPrikk = !loading && !harBlittÅpnet.current && harNyNyhet(sisteNyhet?._createdAt);

    const handleOpenChange = (open: boolean) => {
        if (open) {
            harBlittÅpnet.current = true;
            localStorage.setItem('sisteNyhetOpprettet', JSON.stringify(sisteNyhet?._createdAt));
        }
    };

    return (
        <Dropdown onOpenChange={handleOpenChange}>
            <Header.Button as={Dropdown.Toggle} aria-label="Toggle dropdown">
                {skalViseIkonMedPrikk ? <BjelleDottIkon /> : <BellFillIcon title="nyheter i speil" fontSize="26px" />}
            </Header.Button>
            <Dropdown.Menu className={styles.menu}>
                <Dropdown.Menu.GroupedList className={styles.list}>
                    <Dropdown.Menu.GroupedList.Heading className={styles.heading}>
                        Nytt i Speil
                    </Dropdown.Menu.GroupedList.Heading>
                    {nyheter.length > 0 ? (
                        <ScrollableContainer>
                            {nyheter.map((nyhet) => (
                                <Nyhet key={nyhet._id} nyhet={nyhet} />
                            ))}
                        </ScrollableContainer>
                    ) : (
                        <HStack justify="center" align="center" paddingBlock="4 4">
                            <BodyShort>Ingen nyheter</BodyShort>
                        </HStack>
                    )}
                </Dropdown.Menu.GroupedList>
            </Dropdown.Menu>
        </Dropdown>
    );
};

const ScrollableContainer = ({ children }: PropsWithChildren) => {
    return <ul className={styles.scrollablecontainer}>{children}</ul>;
};

const harNyNyhet = (sisteNyhetOpprettet: string | undefined): boolean => {
    if (typeof window === 'undefined') return false;
    const lagretSisteNyhetOpprettet = localStorage.getItem('sisteNyhetOpprettet');

    if (lagretSisteNyhetOpprettet === null && sisteNyhetOpprettet !== undefined) return true;

    return dayjs(sisteNyhetOpprettet).isAfter(JSON.parse(lagretSisteNyhetOpprettet!));
};
