# TileTabs

Tile layout manager in React.

DEMO

Install:
```
npm i git+https://github.com/softremake/tiletabs
```

Usage:
```javascript

import { TileTabs, ItemConfig, Direction, FactoryCallback } from 'tiletabs'

// components for FactoryCallback
const TabOne = (config) => {
    return (
        <div className={'tab-one'}>
            {config.props.title}
        </div>
    )
}

const TabTwo = (config) => {
    return (
        <div className={'tab-two'}>
            {config.props.label}
        </div>
    )
}
// a factory to create React components based on props
const factory: FactoryCallback = (props: ItemConfig) => {
    return props.component === 'tabone' ? <TabOne {...props} /> : <TabTwo {...props} />
}

class App extends React.Component<{}> {
    public onChange = (root, tiletab) => {
        // root has new configuration
    }

    public render() {
        // configuration
        const exampleConfig: ItemConfig = {
            props: {
                direction: Direction.vertical,
                size: 25, // percentage
                pane1: {
                    title: 'one',
                    component: 'tabone', // see the factory function above
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
                    config={exampleConfig}
                    factory={factory}
                    onChange={this.onChange}
                />
            </div>
        )
    }
}

```
