import React, { useState } from 'react';

import { Dropdown } from '@navikt/ds-react-internal';

import { Personinfo, Personnavn } from '@io/graphql';

import { NyttNotatModal } from '../../../oversikt/table/rader/notat/NyttNotatModal';

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
                    notattype="Generelt"
                />
            )}
        </>
    );
};
