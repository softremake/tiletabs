import * as React from 'react'
import { ItemConfig } from './ItemConfig'
import { Splitter, Direction } from './Splitter'
import { Pane } from './Pane'
import { FactoryCallback } from './FactoryCallback'

interface IBoxProps {
    direction: Direction
    size: number // percentage
    pane1?: ItemConfig
    pane2?: ItemConfig

    factory: FactoryCallback
    actions

    isRoot?: boolean

    style?

    count?: number
}

export class Box extends React.Component<IBoxProps> {
    protected splitter

    constructor(props) {
        super(props)
    }

    public render() {
        const size1 = this.props.size
        const size2 = 100 - size1

        const child = this.renderPane(this.props.pane1, size1)

        const splitter = !this.props.pane2 ? '' :
            <Splitter
                pane1Id={this.props.pane1.id}
                pane2Id={this.props.pane2.id}
                direction={this.props.direction}
                ref={(ref) => this.splitter = ref}
            />

        const child2 = this.renderPane(this.props.pane2, size2, true)

        return (
            <div className={'pane box box-' + this.props.direction + (this.props.isRoot ? ' root' : '')}
                 style={this.props.style}
            >
                {child}
                {splitter}
                {child2}
            </div>
        )
    }

    protected renderPane = (pane, paneSize: number, isPane2: boolean = false) => {
        const style: any = {}
        if (pane && paneSize) {

            if (pane.props.maximized) {
                style.width = '100%'
                style.height = '100%'
                style.position = 'absolute'
                style.left = '0'
                style.top = '0'
                style.right = '0'
                style.bottom = '0'
                style.zIndex = '99'
            } else {
                style.position = 'initial'
                if (this.props.direction === Direction.vertical) {
                    style.height = paneSize + '%'
                } else {
                    style.width = paneSize + '%'
                }
            }

        }

        const closable = this.props.count > 1

        return !pane ? '' : (!pane.component || pane.component === '') ?
            <Box
                {...pane.props}
                factory={this.props.factory}
                count={this.props.count}
                style={style}
                actions={this.props.actions}
            />
            :
            <Pane
                {...pane}
                closable={closable}
                actions={this.props.actions}
                style={style}
            >
                {this.useFactory(pane)}
            </Pane>

    }

    protected useFactory = (pane) => {
        return pane.component === '---' ? <div className={'empty-component'} /> : this.props.factory(pane)
    }
}
