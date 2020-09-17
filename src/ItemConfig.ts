export class ItemConfig {
    public id?: number
    public parent?: ItemConfig = null
    public isPane2?: boolean
    public title?: string
    public component?: string = '' // empty string for Box or any other defined in factory method
    public props
    public maximized?: boolean
}

export const cloneItem = <T>(target: T): T => {
    if (target === null) {
        return target
    }
    if (target instanceof Date) {
        return new Date(target.getTime()) as any
    }
    if (target instanceof Array) {
        const cp = [] as any[]
        (target as any[]).forEach((v) => {
            cp.push(v)
        })
        return cp.map((n: any) => cloneItem<any>(n)) as any
    }
    if (typeof target === 'object' && target !== {}) {
        const cp = { ...(target as { [key: string]: any }) } as { [key: string]: any }
        Object.keys(cp).forEach(k => {
            cp[k] = k !== 'parent' ? cloneItem<any>(cp[k]) : null
        })
        return cp as T
    }
    return target
}
