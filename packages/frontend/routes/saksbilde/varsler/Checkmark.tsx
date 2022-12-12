import React from 'react';

interface CheckIconProps extends React.SVGAttributes<SVGSVGElement> {}

export const Checkmark: React.FC<CheckIconProps> = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="14" r="13" fill="white" stroke="#0067C5" strokeWidth="2" />
            <path
                d="M11.5327 16.2996L18.2862 9.30486C18.6962 8.87923 19.341 8.90159 19.7253 9.35747C20.1098 9.81357 20.0878 10.5292 19.677 10.9558L12.2024 18.698C12.0121 18.8938 11.764 19 11.5092 19C11.2416 19 10.9843 18.8842 10.7889 18.6696L8.29798 15.9052C7.90067 15.4642 7.90067 14.7484 8.29798 14.3075C8.69529 13.8666 9.34029 13.8666 9.73759 14.3075L11.5327 16.2996Z"
                fill="#0067C5"
            />
        </svg>
    );
};
