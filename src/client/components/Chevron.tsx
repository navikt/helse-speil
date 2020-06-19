import React from 'react';
import styled from '@emotion/styled';

interface ChevronProps {
    direction?: 'up' | 'down';
}

export const Chevron = styled.i`
    position: relative;
    height: 2px;
    width: 20px;

    &:before,
    &:after {
        content: '';
        position: absolute;
        background: #3e3832;
        top: 0;
        height: 100%;
        width: 50%;
        border-radius: 2px;
        transition: transform 0.1s ease;
    }

    &:before {
        left: 0;
        transform: translateX(2px) rotate(45deg);
    }

    &:after {
        right: 0;
        transform: translateX(-2px) rotate(-45deg);
    }

    ${({ direction }: ChevronProps) =>
        direction === 'up' &&
        `
        &:before {
            transform: translateX(2px) rotate(-45deg);
        }
    
        &:after {
            transform: translateX(-2px) rotate(45deg);
        }
    `}
`;
