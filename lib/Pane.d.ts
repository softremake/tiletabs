import * as React from 'react';
import { ItemConfig } from './ItemConfig';
interface IPaneProps extends ItemConfig {
    closable: boolean;
    actions: any;
    style: any;
}
export declare class Pane extends React.Component<IPaneProps> {
    constructor(props: any);
    render(): JSX.Element;
}
export {};
