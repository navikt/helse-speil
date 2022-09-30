import React from 'react';

import { Ikon, IkonProps } from './Ikon';

export const Errorikon = React.forwardRef<SVGSVGElement, IkonProps>(
    ({ height = 20, width = 20, viewBox = '-2 -2 20 20', className, alt }: IkonProps, ref) => (
        <Ikon height={height} width={width} viewBox={viewBox} className={className} alt={alt} ref={ref}>
            <path
                d="M7.99929 0C3.59651 0 0.00834826 3.58122 4.48097e-07 7.984C-0.00417346 10.121 0.823651 12.1315 2.33182 13.6459C3.83999 15.1597 5.84764 15.9958 7.98468 16H7.99998C12.4021 16 15.9909 12.4181 16 8.01461C16.0083 3.60417 12.4264 0.00834783 7.99929 0Z"
                fill="#3E3832"
            />
            <path
                d="M7.8857 6.91596L10.5061 4.29552C10.7956 4.00607 11.2649 4.00607 11.5543 4.29552C11.8438 4.58496 11.8438 5.05425 11.5543 5.3437L8.93388 7.96414L11.5543 10.5846C11.8438 10.874 11.8438 11.3433 11.5543 11.6328C11.2649 11.9222 10.7956 11.9222 10.5061 11.6328L7.8857 9.01232L5.26525 11.6328C4.97581 11.9222 4.50652 11.9222 4.21708 11.6328C3.92763 11.3433 3.92763 10.874 4.21708 10.5846L6.83752 7.96414L4.21708 5.3437C3.92763 5.05425 3.92763 4.58496 4.21708 4.29552C4.50652 4.00607 4.97581 4.00607 5.26525 4.29552L7.8857 6.91596Z"
                fill="white"
            />
        </Ikon>
    )
);
