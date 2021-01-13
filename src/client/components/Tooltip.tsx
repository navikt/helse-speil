import styled from '@emotion/styled';
import ReactTooltip from 'react-tooltip';

export const Tooltip = styled(ReactTooltip)`
    padding: 2px 8px !important;
    font-size: 14px !important;
    line-height: 20px !important;
    border-width: 0 !important;
    border-radius: 4px;
    box-shadow: 0 1px 2px #b7b1a9;
    background-color: #fff5e8 !important;
    color: #3e3832 !important;
    border-color: #b7b1a9 !important;

    &:after {
        display: none !important;
    }
`;
