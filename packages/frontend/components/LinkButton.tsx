import styled from '@emotion/styled';
import React from 'react';

import { Link as NavLink, LinkProps } from '@navikt/ds-react';

const Link = styled(NavLink)`
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 0;
`;

interface LinkButtonProps extends Omit<LinkProps, 'as'> {}

export const LinkButton: React.FC<LinkButtonProps> = (props) => <Link as="button" {...props} />;
