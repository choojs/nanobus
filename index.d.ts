type Listener = (...args: any[]) => void
type NanobusListener<E extends Events, K extends keyof E | symbol> = K extends keyof E ? E[K] : Listener
type StarListener<E extends Events> = (eventName: keyof E | symbol, data: any[], performanceTimingId?: string) => void
type AnyListener<E extends Events, K extends keyof E | "*" | symbol> = K extends "*" ? StarListener<E> : NanobusListener<E, K>
type Events = { [eventName: string]: Listener }

declare class Nanobus<E extends Events = Events> {
    protected _name: string
    protected _starListeners: StarListener<E>[]
    protected _listeners: { [K in keyof E]?: E[K][] }
    constructor(name?: string)
    emit<K extends keyof E | symbol>(eventName: K, ...args: Parameters<NanobusListener<E, K>>): this
    protected _emit<K extends keyof E | symbol>(array: StarListener<E>[], eventName: K, data: Parameters<NanobusListener<E, K>>, performanceTimingId?: string): void
    protected _emit<K extends keyof E>(array: E[K][], data: Parameters<E[K]>): void
    protected _emit(array: Listener[], data: any[]): void
    on<K extends keyof E | "*" | symbol>(eventName: K, listener: AnyListener<E, K>): this
    addListener<K extends keyof E | "*" | symbol>(eventName: K, listener: AnyListener<E, K>): this
    prependListener<K extends keyof E | "*" | symbol>(eventName: K, listener: AnyListener<E, K>): this
    once<K extends keyof E | "*" | symbol>(eventName: K, listener: AnyListener<E, K>): this
    prependOnceListener<K extends keyof E | "*" | symbol>(eventName: K, listener: AnyListener<E, K>): this
    removeListener<K extends keyof E | "*" | symbol>(eventName: K, listener: AnyListener<E, K>): true | undefined
    removeAllListeners(eventName?: keyof E | "*" | symbol): this
    listeners<K extends keyof E | "*" | symbol>(eventName: K): AnyListener<E, K>[]
}

export = Nanobus
