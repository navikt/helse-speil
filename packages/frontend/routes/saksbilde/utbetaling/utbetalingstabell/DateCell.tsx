import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import React from 'react';

import { NORSK_DATOFORMAT } from '@utils/date';

const Cell = styled.td`
    &:after {
        content: '';
        position: absolute;
        background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='8' cy='8' r='6.1' stroke='%233E3832' stroke-width='3' stroke-dasharray='1.6'/%3E%3C/svg%3E%0A");
        height: 16px;
        width: 16px;
        left: 8px;
        top: 50%;
        transform: translateY(-50%);
    }
`;

interface DateCellProps {
    date: Dayjs;
    erOverstyrt?: boolean;
}

export const DateCell = ({ date, erOverstyrt }: DateCellProps) =>
    erOverstyrt ? <Cell>{date.format(NORSK_DATOFORMAT)}</Cell> : <td>{date.format(NORSK_DATOFORMAT)}</td>;
