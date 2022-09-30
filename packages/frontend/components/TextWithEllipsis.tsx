import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { AnonymizableText } from './anonymizable/AnonymizableText';

const ellipsis = css`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    > a:focus {
        box-shadow: 0 0 0 3px var(--navds-semantic-color-focus);
    }
`;

export const TextWithEllipsis = styled.p`
    ${ellipsis}
`;

export const AnonymizableTextWithEllipsis = styled(AnonymizableText)`
    ${ellipsis}
`;
