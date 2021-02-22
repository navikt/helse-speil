import * as React from 'react';
import { IkonProps } from './Ikon';

const Snøfnugg = ({ ...props }: IkonProps) => {
    return (
        <svg width={12} height={13} viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                stroke="#fff"
                strokeWidth={2}
                strokeLinecap="round"
                d="M3.414 4l10.04 10.04M3 14.04L13.04 4M8.011 15.989l.16-14M15.001 9H1"
            />
            <path
                d="M2 7.8l1.455 1.182L2 10.164M14.455 10.2L13 9.018l1.455-1.182M6.8 15.454L7.982 14l1.182 1.454M9.4 3L8.218 4.455 7.036 3M5 4l.193 1.864-1.864-.193M3 12.4l1.864-.193-.193 1.864M12.3 14.7l-.193-1.864 1.864.192M12.9 5.671l-1.864.193L11.229 4"
                stroke="#fff"
                strokeLinecap="round"
            />
        </svg>
    );
};
export default Snøfnugg;
