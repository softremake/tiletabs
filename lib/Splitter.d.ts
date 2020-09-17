import * as React from 'react';
export declare enum Direction {
    vertical = "vertical",
    horizontal = "horizontal"
}
interface ISplitterProps {
    direction: Direction;
    style?: any;
    pane1Id: number;
    pane2Id: number;
}
export declare const Splitter: React.ForwardRefExoticComponent<ISplitterProps & React.RefAttributes<HTMLDivElement>>;
export {};
