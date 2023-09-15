import React, { useState } from 'react';

import { Dropdown } from '@navikt/ds-react-internal';

import { Key, useKeyboard } from '@hooks/useKeyboard';
import { NotatType, Personinfo, Personnavn } from '@io/graphql';

import { NyttNotatModal } from '../../../oversikt/table/cells/notat/NyttNotatModal';

interface SkrivNotatDropdownMenuButtonProps {
    vedtaksperiodeId: string;
    personinfo: Personinfo;
}

export const SkrivGenereltNotatDropdownMenuButton = ({
    vedtaksperiodeId,
    personinfo,
}: SkrivNotatDropdownMenuButtonProps) => {
    const [open, setOpen] = useState(false);

    const showModal = () => {
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
    };

    useKeyboard({
        [Key.N]: {
            action: () => setOpen(true),
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
    });

    const navn: Personnavn = {
        fornavn: personinfo.fornavn,
        mellomnavn: personinfo.mellomnavn,
        etternavn: personinfo.etternavn,
    };

    return (
        <>
            <Dropdown.Menu.List.Item onClick={showModal}>Skriv notat</Dropdown.Menu.List.Item>
            {open && (
                <NyttNotatModal
                    onClose={closeModal}
                    navn={navn}
                    vedtaksperiodeId={vedtaksperiodeId}
                    notattype={NotatType.Generelt}
                />
            )}
        </>
    );
};
