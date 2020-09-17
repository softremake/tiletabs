import * as React from 'react'
import { TileTabs, ItemConfig, Direction, FactoryCallback } from '../src/'

const TabOne = (config) => {
    const [count, setCount] = React.useState(0)

    return (
        <div className={'tab-one'}>
            {config.props.title}

            <div>
                <p>You clicked {count} times</p>
                <button onClick={() => setCount(count + 1)}>
                    Click me
                </button>
            </div>
        </div>
    )
}

const TabTwo = (config) => {
    const [count, setCount] = React.useState(0)

    return (
        <div className={'tab-two'}>
            {config.props.label}

            <div>
                <p>You clicked {count} times</p>
                <button onClick={() => setCount(count + 1)}>
                    Click me
                </button>
            </div>
        </div>
    )
}

const factory: FactoryCallback = (props: ItemConfig) => {
    return props.component === 'tabone' ? <TabOne {...props} /> : <TabTwo {...props} />
}

class App extends React.Component<{}, undefined> {
    public onChange = (root, tiletab) => {
        console.log('onChange')
        console.log({root})
    }

    public render() {
        const defaultConfig: ItemConfig = {
            props: {
                direction: Direction.vertical,
                size: 25, // percentage
                pane1: {
                    title: 'one',
                    component: 'tabone',
                    props: { title: 'TabOneTitle' },
                },
                pane2: {
                    props: {
                        direction: Direction.horizontal,
                        size: 40, // percentage
                        pane1: {
                            title: '2-1',
                            component: 'tabone',
                            props: { title: 'Tab 2-1' },
                        },
                        pane2: {
                            title: '2-2',
                            component: 'tabtwo',
                            props: { label: 'Tab 2-2' },
                        }
                    }

                }
            }
        }

        return (
            <div className="app" style={{height: '100%'}}>
                <TileTabs
                    config={defaultConfig}
                    factory={factory}
                    onChange={this.onChange}
                />
            </div>
        )
    }
}

export default App
