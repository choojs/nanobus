type EventsConfiguration = { [eventName: string | Symbol]: (...args: any[]) => void }
type StarListener<Events extends EventsConfiguration> = <EventName extends keyof Events>(eventName: EventName, ...args: Parameters<Events[EventName]>) => void
type AttachListener<Events extends EventsConfiguration> = <EventName extends (keyof Events) | '*'>(eventName: EventName, listener: EventName extends '*' ? StarListener<Events> : Events[EventName]) => Nanobus<Events>

declare class Nanobus<Events extends EventsConfiguration> {
  private _name: string
  private _starListeners: Array<StarListener<Events>>
  private _listeners: { [key: keyof Events]: Array<Events[keyof Events]> }
  private _emit<EventName extends keyof Events>(listeners: Array<Events[infer EventName]>, data: Parameters<Events[EventName]>): void
  private _emit<EventName extends keyof Events>(listeners: Array<StarListener<Events>>, eventName: EventName, data: Parameters<Events[EventName]>, uuid?: number)

  /**
   * Allowed events and the arguments that go with them should be specified by passing an interface in which each entry's key defines an event name, and each entry's value defines the signature for a listener for the event.
   * 
   * For example:
   * 
   * ```
   * const emitter = new Nanobus<{
   *   start: (options: Options) => void,
   *   message: (text: string) => void,
   *   error: (error: Error) => void,
   *   result: (part1: number, part2: number) => void,
   * }>()
   * ```
   * 
   * This will cause emissions and subscriptions to be type-checked.
   * 
   * For example, this call would be allowed:
   * 
   * ```
   * emitter.emit('error', new Error('something failed'))
   * ```
   * 
   * This call would be disallowed because the event name isn't allowed:
   * 
   * ```
   * emitter.emit('complete')
   * ```
   * 
   * This call would be disallowed because `part2` must be a number, but isn't:
   * 
   * ```
   * emitter.emit('result', 1, 'text')
   * ```
   */
  constructor(name?: string)
  emit<EventName extends keyof Events>(eventName: EventName, ...args: Parameters<Events[EventName]>): this
  on: AttachListener<Events>
  addListener: AttachListener<Events>
  prependListener: AttachListener<Events>
  once: AttachListener<Events>
  prependOnceListener: AttachListener<Events>
  removeListener<EventName extends keyof Events, Listener extends Events[EventName]>(eventName: EventName, listener: Listener): true | void
  removeListener(eventName: '*', listener: StarListener): true | void
  removeAllListeners<EventName extends keyof Events>(eventName: EventName): this
  removeAllListeners(eventName: '*'): this
  listeners<EventName extends keyof Events>(eventName: EventName): Array<Events[EventName]>
  listeners(eventName: '*'): Array<StarListener<Events>>
}

export = Nanobus