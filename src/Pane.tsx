import * as React from 'react'
import { ItemConfig } from './ItemConfig'
import { Header } from './Header'

interface IPaneProps extends ItemConfig {
    closable: boolean
    actions
    style
}

export class Pane extends React.Component<IPaneProps> {
    constructor(props) {
        super(props)
    }

    public render() {
        return (
            <div className={"pane"} style={this.props.style} data-id={this.props.id}>
                <Header
                    title={this.props.title}
                    maximized={this.props.props.maximized}
                    // minimized={pane.minimized}
                    closable={this.props.closable}
                    itemId={this.props.id}
                    actions={this.props.actions}
                />
                {this.props.children}
            </div>
        )
    }
}
