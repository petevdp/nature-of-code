import p5 from 'p5'
export type simpleSketch = (p: p5) => any

export interface LifecycleSketch {
    run: (p: p5) => any
    teardown: () => void
}

export type sketch = simpleSketch | LifecycleSketch