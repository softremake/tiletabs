import * as React from 'react';
import { ItemConfig } from './ItemConfig';
import { Direction } from './Splitter';
import { FactoryCallback } from './FactoryCallback';
interface IBoxProps {
    direction: Direction;
    size: number;
    pane1?: ItemConfig;
    pane2?: ItemConfig;
    factory: FactoryCallback;
    actions: any;
    isRoot?: boolean;
    style?: any;
    count?: number;
}
export declare class Box extends React.Component<IBoxProps> {
    protected splitter: any;
    constructor(props: any);
    render(): JSX.Element;
    protected renderPane: (pane: any, paneSize: number, isPane2?: boolean) => "" | JSX.Element;
    protected useFactory: (pane: any) => any;
}
export {};
