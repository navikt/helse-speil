import React, { PropsWithChildren, useEffect, useState } from 'react';

import { BellFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Dropdown, HStack, InternalHeader as Header } from '@navikt/ds-react';

import { Nyhet } from '@components/header/nyheter/Nyhet';
import { BjelleDottIkon } from '@components/ikoner/BjelleDottIkon';
import { useNyheter } from '@external/sanity';

import styles from './Nyheter.module.scss';

export const Nyheter = () => {
    const [skalViseIkonMedPrikk, setSkalViseIkonMedPrikk] = useState(false);
    const { nyheter, loading } = useNyheter();
    const antallNyheter = nyheter.length;

    console.log(nyheter);

    useEffect(() => {
        if (!loading) {
            setSkalViseIkonMedPrikk(harNyNyhet(antallNyheter));
        }
    }, [loading, setSkalViseIkonMedPrikk, antallNyheter]);

    return (
        <Dropdown
            onOpenChange={(open) => lagreAntallNyheter(open, antallNyheter, () => setSkalViseIkonMedPrikk(false))}
        >
            <Header.Button as={Dropdown.Toggle} aria-label="Toggle dropdown">
                {skalViseIkonMedPrikk ? <BjelleDottIkon /> : <BellFillIcon title="nyheter i speil" fontSize="26px" />}
            </Header.Button>
            <Dropdown.Menu className={styles.menu}>
                <Dropdown.Menu.GroupedList className={styles.list}>
                    <Dropdown.Menu.GroupedList.Heading className={styles.heading}>
                        Nytt i speil
                    </Dropdown.Menu.GroupedList.Heading>
                    {antallNyheter > 0 ? (
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

const harNyNyhet = (antallNyheter: number): boolean => {
    if (typeof window === 'undefined') return false;
    const lagretAntall = Number(localStorage.getItem('antallNyheter'));
    if (lagretAntall === 0 && antallNyheter > 0) {
        localStorage.setItem('antallNyheter', JSON.stringify(antallNyheter));
        return true;
    }
    if (lagretAntall > antallNyheter) {
        localStorage.setItem('antallNyheter', JSON.stringify(antallNyheter));
        return false;
    }
    return antallNyheter > lagretAntall;
};

const lagreAntallNyheter = (open: boolean, antallNyheter: number, visIkonUtenPrikk: () => void): void => {
    if (open) {
        localStorage.setItem('antallNyheter', JSON.stringify(antallNyheter));
        visIkonUtenPrikk();
    }
};
