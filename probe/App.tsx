import * as React from 'react'
import { hot } from 'react-hot-loader'
import { TileTabs, ItemConfig, Direction, FactoryCallback } from '../src/'

const TabOne = (config) => {
    const [count, setCount] = React.useState(0)


    React.useEffect( () => {
        // console.log('TabOne useEffect')
    })

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

    React.useEffect( () => {
        // console.log('TabTwo useEffect')
    })

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
    protected ref1

    constructor(props) {
        super(props)
        this.ref1 = React.createRef()
    }

    public onChange = (root, tiletab) => {
        console.log('onChange')
        console.log({root})
    }

    public replaceComponent = (e) => {
        e.preventDefault()
        if(this.ref1.current instanceof TileTabs) {
            this.ref1.current.replaceComponent(2, 'tabtwo', { label: 'replaced' })
        }
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

        const defaultConfig2 = Object.assign({}, defaultConfig)

        return (
            <div className="app" style={{height: '100%'}}>
                <a href={"#"} onClick={this.replaceComponent}>replace</a>
                <TileTabs
                    ref={this.ref1}
                    config={defaultConfig}
                    factory={factory}
                    onChange={this.onChange}
                />

                <TileTabs
                    config={defaultConfig2}
                    factory={factory}
                    onChange={this.onChange}
                />
            </div>
        )
    }
}

declare let module: object

export default hot(module)(App)
