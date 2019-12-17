import React from 'react';
import CopyIcon from "./CopyIcon";
import CheckIcon from "./CheckIcon";

interface Props {
    type: 'check' | 'copy';
    size?: number;
}

const ClipboardIcon = ({ type, size = 20 }: Props) => {
    return type === 'check'
        ? <CheckIcon height={size} width={size} />
        : <CopyIcon height={size} width={size} />;
};

export default ClipboardIcon;
