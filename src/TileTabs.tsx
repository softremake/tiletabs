import * as React from 'react'

import { FactoryCallback } from './FactoryCallback'
import { Box } from './Box'
import { cloneItem, ItemConfig } from './ItemConfig'

import './scss/main.scss'

import { Direction } from './Splitter'

const DEFAULTS = {
    minW: 150,
    minH: 100,
    headerH: 20,
}

interface ITileTabsProps {
    factory?: FactoryCallback,
    config?: ItemConfig
    minW?: number
    minH?: number
    onChange?
}

interface IRect {
    left: number,
    top: number,
    width: number,
    height: number
}

interface ITileTabsState {
    root: ItemConfig,
    splitting: boolean,
    dragging: boolean,
    dockId: number,
    dock: IRect,
    dockArea: string,
    dragId?: number
}

export class TileTabs extends React.Component<ITileTabsProps, ITileTabsState> {
    protected maxId: number = 0
    protected ref

    protected prevCursor = ''
    protected currentSplitter = null
    protected splitParent: ItemConfig = null
    protected splitEl = null
    protected count: number = 0
    protected elDragging = null
    protected clientX = 0
    protected clientY = 0

    constructor(props) {
        super(props)

        const defaultConfig: ItemConfig = {
            props: {
                direction: Direction.vertical,
                size: 100,
            },
        }

        const root = props.config || defaultConfig
        root.isRoot = true

        this.state = {
            root,
            splitting: false,
            dragging: false,
            dockId: 0,
            dock: null,
            dockArea: '',
        }
    }

    public findItemById(state, id: number, parent: ItemConfig = null): ItemConfig {
        parent = parent || state.root

        if (parent.id && parent.id === id) {
            return parent
        }

        if (parent.props.pane1) {
            const r = this.findItemById(state, id, parent.props.pane1)
            if (r) {
                return r
            }
        }

        if (parent.props.pane2) {
            const r = this.findItemById(state, id, parent.props.pane2)
            if (r) {
                return r
            }
        }

        return null
    }

    public deleteItem = (state, itemId) => {
        const item = this.findItemById(state, itemId)

        if (item && item.parent) {
            item.parent.props.size = 100
            if (!item.isPane2) {
                if (!item.parent.props.pane2) {
                    // delete item.parent
                    this.deleteItem(state, item.parent.id)
                } else {
                    item.parent.props.pane1 = item.parent.props.pane2
                    item.parent.props.pane1.isPane2 = false
                    item.parent.props.pane2 = null
                }
            } else {
                item.parent.props.pane2 = null
            }
        }
    }

    public onItemClose = (itemId) => {
        const newState: any = this.cloneState()

        this.deleteItem(newState, itemId)

        this.setState(newState, this.callOnChange)
    }

    public setItemProps = (state, itemId, itemProps) => {
        const item = this.findItemById(state, itemId)

        if (item) {
            item.props = { ...item.props, ...itemProps }
        }
    }

    public addItem = (state, itemId: number, area: string, moveItem: number = 0): number => {
        const item = this.findItemById(state, itemId)
        if (item && item.parent) {
            // create a box and move the item into its pane1
            const newId = this.maxId += 1

            const direction: Direction = (area === 'top' || area === 'bottom') ?
                Direction.vertical : Direction.horizontal

            const itemToMove = this.findItemById(state, moveItem)

            const newPane = moveItem ? this.cloneItem(itemToMove) : {
                id: this.maxId += 1,
                component: '---',
                title: 'Untitled',
                isPane2: true,
                props: {},
            }

            if (moveItem) {
                // we need to delete it from the previous place
                this.deleteItem(state, moveItem)
            }

            const pane1: any = (area === 'left' || area === 'top') ? newPane : this.cloneItem(item)
            pane1.isPane2 = false

            const pane2: any = (area === 'right' || area === 'bottom') ? newPane : this.cloneItem(item)
            pane2.isPane2 = true

            const newBox: ItemConfig = {
                id: newId,
                parent: item.parent,
                component: '', // empty string for Box or any other defined in factory method
                props: {
                    direction,
                    size: 50,
                    isRoot: item.props.isRoot || false,
                    pane1,
                    // add new empty component as pane2
                    pane2,
                },
            }

            pane1.parent = newBox
            pane2.parent = newBox

            Object.assign(item, newBox)

            return newPane.id
        }

        return 0
    }

    public onAddRow = (itemId, area = 'bottom'): number => {
        const newState: any = this.cloneState()
        const newId = this.addItem(newState, itemId, area)
        if (newId) {
            this.setState(newState, this.callOnChange)
        }
        return newId
    }

    public onAddCol = (itemId, area = 'right') => {
        const newState: any = this.cloneState()
        const newId = this.addItem(newState, itemId, area)
        if (newId) {
            this.setState(newState, this.callOnChange)
        }
        return newId
    }

    public onItemMax = (itemId) => {
        const newState: any = this.cloneState()
        this.setItemProps(newState, itemId, { maximized: true })
        this.setState(newState, this.callOnChange)
    }

    public onItemMin = (itemId) => {
        const newState: any = this.cloneState()
        this.setItemProps(newState, itemId, { minimized: true })
        this.setState(newState, this.callOnChange)
    }

    public onItemRestore = (itemId) => {
        const newState: any = this.cloneState()
        this.setItemProps(newState, itemId, { maximized: false, minimized: false })
        this.setState(newState, this.callOnChange)
    }

    public onHeaderDrag = (itemId, el) => {
        el.style.cursor = 'grabbing'
        document.body.style.cursor = 'grabbing'
        this.elDragging = el

        this.setState({ ...this.state, dragging: true, dragId: itemId })
    }

    public actions = (type: string, data) => {
        switch (type) {
            case 'ITEM_CLOSE':
                this.onItemClose(data.id)
                break
            case 'ADD_ROW':
                this.onAddRow(data.id)
                break
            case 'ADD_COL':
                this.onAddCol(data.id)
                break
            case 'HEADER_DRAG':
                this.onHeaderDrag(data.id, data.el)
                break
            case 'MAXIMIZE':
                this.onItemMax(data.id)
                break
            case 'MINIMIZE':
                this.onItemMin(data.id)
                break
            case 'RESTORE':
                this.onItemRestore(data.id)
                break
        }

    }

    public render() {
        this.maxId = 0
        this.count = 0
        this.buildIds(this.state.root)

        const boxProps = {
            ...this.state.root.props,
            factory: this.props.factory,
            actions: this.actions,
            isRoot: true,
            count: this.count,
        }

        const dockStyle = this.state.dockId ? {
            display: 'block',
            left: this.state.dock.left,
            top: this.state.dock.top,
            width: this.state.dock.width,
            height: this.state.dock.height,
        } : { display: 'none' }

        return (
            <div className="tile-tabs" ref={ref => this.ref = ref}>
                <div className={'dock'} style={dockStyle} />
                <Box {...boxProps} />
            </div>
        )
    }

    public componentDidMount() {
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', this.handleResize)
            document.addEventListener('mouseup', this.handleMouseUp)
            this.ref.addEventListener('mousedown', this.handleSplitterMouseDown)
            this.ref.addEventListener('mousemove', this.handleMouseMove)
            document.addEventListener('touchend', this.handleMouseUp)
            this.ref.addEventListener('touchmove', this.handleTouchMove)
        }
    }

    public componentWillUnmount() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', this.handleResize)
            document.removeEventListener('mouseup', this.handleMouseUp)
            this.ref.removeEventListener('mousedown', this.handleSplitterMouseDown)
            this.ref.removeEventListener('mousemove', this.handleMouseMove)
            document.removeEventListener('touchend', this.handleMouseUp)
            this.ref.removeEventListener('touchmove', this.handleTouchMove)
        }
    }

    protected cloneState = () => {
        const newState: ITileTabsState = {
            ...this.state,
            root: cloneItem(this.state.root),
        }

        this.count = 0
        this.buildIds(newState.root)

        return newState
    }

    protected cloneItem = (source: ItemConfig) => {
        const copy: any = cloneItem(source)
        copy.parent = source.parent
        return copy
    }

    protected buildIds(item: ItemConfig, parent: ItemConfig = null, isPane2: boolean = false) {
        if (!item.id) {
            this.maxId++
            item.id = this.maxId
            item.isPane2 = isPane2
        } else {
            this.maxId = Math.max(item.id, this.maxId)
        }

        if (parent && !item.parent) {
            item.parent = parent
        }

        if (item.component && item.component !== '') {
            this.count++
        }

        if (item.props && item.props.pane1) {
            this.buildIds(item.props.pane1, item)
        }

        if (item.props && item.props.pane2) {
            this.buildIds(item.props.pane2, item, true)
        }
    }

    protected handleResize = () => {
        // todo: onResizeEvent
    }

    protected handleMouseMove = (e) => {
        this.clientX = e.pageX
        this.clientY = e.pageY

        // throttling
        setTimeout(() => {

            if (this.state.splitting) {
                const newState: any = this.cloneState()
                const newSplitParent = this.findItemById(newState, this.splitParent.id)

                const containerRect = this.splitEl.getBoundingClientRect()

                if (this.splitParent.props.direction === 'vertical') {
                    const top = this.clientY - this.splitEl.offsetTop - this.ref.offsetTop

                    if (top > DEFAULTS.minH && top < containerRect.height - DEFAULTS.minH) {
                        newSplitParent.props.size = Math.floor((top / containerRect.height) * 100)
                    }
                } else {
                    const left = this.clientX - this.splitEl.offsetLeft - this.ref.offsetLeft // - containerRect.x
                    if (left > DEFAULTS.minW && left < containerRect.width - DEFAULTS.minW) {
                        newSplitParent.props.size = Math.floor((left / containerRect.width) * 100)
                    }
                }

                this.setState(newState)
            } else if (this.state.dragging) {

                if (e.target.parentNode && e.target.classList.contains('pane')) {
                    // get id
                    const dockId = parseInt(e.target.getAttribute('data-id'), 10)

                    if (dockId === this.state.dragId) {
                        return
                    }

                    // quadrant
                    let dockArea = ''

                    const containerRect = e.target.getBoundingClientRect()
                    const halfW = Math.floor(containerRect.width / 2)
                    const halfH = Math.floor(containerRect.height / 2)

                    const dock = {
                        left: 0,
                        top: 0,
                        width: 0,
                        height: 0,
                    }

                    if (containerRect.height <= DEFAULTS.minH && containerRect.width <= DEFAULTS.minW) {
                        this.setState({ ...this.state, dockId: 0, dock, dockArea })
                    } else {
                        const left = this.clientX - e.target.offsetLeft - this.ref.offsetLeft
                        const top = this.clientY - e.target.offsetTop - this.ref.offsetTop

                        if (top <= halfH) {
                            dockArea = 'top'

                            dock.left = e.target.offsetLeft
                            dock.top = e.target.offsetTop + DEFAULTS.headerH
                            dock.width = containerRect.width
                            dock.height = halfH - DEFAULTS.headerH

                            const minBottom = Math.floor(containerRect.height * 0.3)
                            if (left <= halfW && top > minBottom) {
                                dockArea = 'left'
                                dock.width = halfW
                                dock.height = containerRect.height - DEFAULTS.headerH
                            } else if (left > halfW && top > minBottom) {
                                dockArea = 'right'
                                dock.left = e.target.offsetLeft + containerRect.width - halfW
                                dock.width = halfW
                                dock.height = containerRect.height - DEFAULTS.headerH
                            }
                        } else if (top > halfH) {
                            dockArea = 'bottom'

                            dock.left = e.target.offsetLeft
                            dock.top = e.target.offsetTop + DEFAULTS.headerH + halfH
                            dock.width = containerRect.width
                            dock.height = halfH - DEFAULTS.headerH

                            const minBottom = containerRect.height - Math.floor(containerRect.height * 0.3)
                            if (left <= halfW && top < minBottom) {
                                dockArea = 'left'
                                dock.top = e.target.offsetTop + DEFAULTS.headerH
                                dock.width = halfW
                                dock.height = containerRect.height - DEFAULTS.headerH
                            } else if (left > halfW && top < minBottom) {
                                dockArea = 'right'
                                dock.left = e.target.offsetLeft + containerRect.width - halfW
                                dock.top = e.target.offsetTop + DEFAULTS.headerH
                                dock.width = halfW
                                dock.height = containerRect.height - DEFAULTS.headerH
                            }
                        }

                        // show it
                        this.setState({ ...this.state, dockId, dock, dockArea })
                    }
                }
            }
        }, 50)
    }

    protected handleTouchMove = (e) => {
        this.handleMouseMove(e.changedTouches[0])
    }

    protected handleSplitterMouseDown = (e) => {
        if (e.button === 0) {
            if (e.target.classList.contains('splitter')) {
                e.preventDefault()

                this.splitParent = this.findItemById(this.state, parseInt(e.target.getAttribute('data-pane1'), 10)).parent
                this.splitEl = e.target.parentNode
                const style = getComputedStyle(e.target)
                this.prevCursor = style.cursor
                this.currentSplitter = e.target

                e.target.style.cursor = 'grabbing'
                document.body.style.cursor = 'grabbing'

                this.setState({ ...this.state, splitting: true })
            }

        }
    }

    protected callOnChange = () => {
        if (this.props.onChange) {
            const noParentsConfig: ItemConfig = cloneItem(this.state.root)
            this.props.onChange(noParentsConfig, this)
        }
    }

    protected handleMouseUp = (e) => {
        if (e.button === 0) {
            if (this.state.splitting) {
                e.preventDefault()

                this.currentSplitter.style.cursor = this.prevCursor
                document.body.style.cursor = 'auto'

                this.setState({ ...this.state, splitting: false }, this.callOnChange)
            } else if (this.state.dragging) {
                e.preventDefault()

                this.elDragging.style.cursor = 'default'
                document.body.style.cursor = 'auto'

                const newState: any = this.cloneState()

                this.addItem(newState, this.state.dockId, this.state.dockArea, this.state.dragId)

                const dockArea = ''

                const dock = {
                    left: 0,
                    top: 0,
                    width: 0,
                    height: 0,
                }

                this.setState({ ...newState, dragging: false, dock, dockArea }, this.callOnChange)
            }
        }
    }

    public replaceComponent(itemId, component, props) {
        const newState: any = this.cloneState()
        const item = this.findItemById(newState, itemId)
        if (item) {
            item.component = component
            item.props = props
            this.setState(newState, this.callOnChange)
        }
    }

}
