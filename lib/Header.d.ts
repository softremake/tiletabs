import * as React from 'react';
interface IHeaderProps {
    itemId: number;
    title: string;
    closable: boolean;
    maximized: boolean;
    minimized?: boolean;
    actions: any;
}
export declare class Header extends React.Component<IHeaderProps, any> {
    protected ref: any;
    constructor(props: any);
    render(): JSX.Element;
    onItemClose: (e: any) => void;
    onAddRow: (e: any) => void;
    onMax: (e: any) => void;
    onMin: (e: any) => void;
    onRestore: (e: any) => void;
    onAddCol: (e: any) => void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    protected onMouseDown: (e: any) => void;
}
export {};
