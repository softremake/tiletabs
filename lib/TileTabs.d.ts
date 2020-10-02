import * as React from 'react';
import { FactoryCallback } from './FactoryCallback';
import { ItemConfig } from './ItemConfig';
import './scss/main.scss';
interface ITileTabsProps {
    factory?: FactoryCallback;
    config?: ItemConfig;
    minW?: number;
    minH?: number;
    onChange?: any;
}
interface IRect {
    left: number;
    top: number;
    width: number;
    height: number;
}
interface ITileTabsState {
    root: ItemConfig;
    splitting: boolean;
    dragging: boolean;
    dockId: number;
    dock: IRect;
    dockArea: string;
    dragId?: number;
}
export declare class TileTabs extends React.Component<ITileTabsProps, ITileTabsState> {
    protected maxId: number;
    protected ref: any;
    protected prevCursor: string;
    protected currentSplitter: any;
    protected splitParent: ItemConfig;
    protected splitEl: any;
    protected count: number;
    protected elDragging: any;
    protected clientX: number;
    protected clientY: number;
    constructor(props: any);
    findItemById(state: any, id: number, parent?: ItemConfig): ItemConfig;
    deleteItem: (state: any, itemId: any) => void;
    onItemClose: (itemId: any) => void;
    setItemProps: (state: any, itemId: any, itemProps: any) => void;
    addItem: (state: any, itemId: number, area: string, moveItem?: number) => number;
    onAddRow: (itemId: any, area?: string) => number;
    onAddCol: (itemId: any, area?: string) => number;
    onItemMax: (itemId: any) => void;
    onItemMin: (itemId: any) => void;
    onItemRestore: (itemId: any) => void;
    onHeaderDrag: (itemId: any, el: any) => void;
    actions: (type: string, data: any) => void;
    render(): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    protected cloneState: () => ITileTabsState;
    protected cloneItem: (source: ItemConfig) => any;
    protected buildIds(item: ItemConfig, parent?: ItemConfig, isPane2?: boolean): void;
    protected handleResize: () => void;
    protected getRealOffset(el: any): {
        y: number;
        x: number;
    };
    protected findUnderlyingPane: (node: any, x: any, y: any) => any;
    protected handleMouseMove: (e: any) => void;
    protected handleTouchMove: (e: any) => void;
    protected handleSplitterMouseDown: (e: any) => void;
    protected callOnChange: () => void;
    protected handleMouseUp: (e: any) => void;
    replaceComponent(itemId: any, component: any, props: any): void;
}
export {};
