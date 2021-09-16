import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';
import { BodyShortProps } from '@navikt/ds-react/esm/typography/BodyShort';

const Text = styled(BodyShort)`
    font-weight: 600;
`;

export const Bold: React.FC<BodyShortProps['props']> = (props) => <Text component="p" {...props} />;
