export declare class ItemConfig {
    id?: number;
    parent?: ItemConfig;
    isPane2?: boolean;
    title?: string;
    component?: string;
    props: any;
    maximized?: boolean;
}
export declare const cloneItem: <T>(target: T) => T;
