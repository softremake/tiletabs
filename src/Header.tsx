import * as React from 'react'

interface IHeaderProps {
    itemId: number
    title: string
    closable: boolean
    maximized: boolean
    minimized?: boolean
    actions
}

export class Header extends React.Component<IHeaderProps, any> {
    protected ref

    constructor(props) {
        super(props)
    }

    public render() {
        const maxMin = this.props.maximized || this.props.minimized ?
            <a href={'#restore'} onClick={this.onRestore}>&#x21B6;</a>
            : ((this.props.closable) ?
                <a href={'#maximize'} onClick={this.onMax}>&#x279A;</a>
                : '')

        // if max change cursor
        const headerStyle = this.props.maximized ? { cursor: 'auto' } : {}

        return (
            <div className={'header'} >
                <span className={'tab'} style={headerStyle} ref={ref => this.ref = ref}>{this.props.title}</span>

                <a href={'#newrow'} onClick={this.onAddRow}>&#x2357;</a>{' '}
                <a href={'#newcol'} onClick={this.onAddCol}>&#x2348;</a>{' '}
                {maxMin}{' '}
                {this.props.closable ? <a href={'#close'} onClick={this.onItemClose}>&#x2716;</a> : ''}
            </div>
        )
    }

    public onItemClose = (e) => {
        e.preventDefault()
        this.props.actions('ITEM_CLOSE', { id: this.props.itemId })
    }

    public onAddRow = (e) => {
        e.preventDefault()
        this.props.actions('ADD_ROW', { id: this.props.itemId })
    }

    public onMax = (e) => {
        e.preventDefault()
        this.props.actions('MAXIMIZE', { id: this.props.itemId })
    }

    public onMin = (e) => {
        e.preventDefault()
        this.props.actions('MINIMIZE', { id: this.props.itemId })
    }

    public onRestore = (e) => {
        e.preventDefault()
        this.props.actions('RESTORE', { id: this.props.itemId })
    }

    public onAddCol = (e) => {
        e.preventDefault()
        this.props.actions('ADD_COL', { id: this.props.itemId })
    }


    public componentDidMount() {
        this.ref.addEventListener('mousedown', this.onMouseDown)
    }

    public componentWillUnmount() {
        this.ref.removeEventListener('mousedown', this.onMouseDown)
    }

    protected onMouseDown = (e) => {
        if (e.button === 0) {
            e.preventDefault()

            // if not max
            if (this.props.maximized) {
                return
            }

            this.props.actions('HEADER_DRAG', { id: this.props.itemId, el: e.target })
        }
    }
}
