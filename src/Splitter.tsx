import * as React from 'react'

export enum Direction {
    vertical = 'vertical',
    horizontal = 'horizontal'
}

interface ISplitterProps {
    direction: Direction,
    style?,
    pane1Id: number,
    pane2Id: number,
}

export const Splitter = React.forwardRef<HTMLDivElement, ISplitterProps>((props, ref) => (
    <div
        ref={ref}
        className={'splitter splitter-' + props.direction}
        data-pane1={props.pane1Id}
        data-pane2={props.pane2Id}
    />
))
