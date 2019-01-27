/**
 * Curried function meant to replicate experience of 'connect' method of 'react-redux'
 * @param {function} mapStateToProps maps store state to individual props
 * @return {function} a function that receives a class to use as super, to return a subclass that has can connect to the redux store
 */
export function connectToStore(mapStateToProps: Function): Function {
	const windowObj = window as any
	return function (Wrapped: any): Function {
		return class ConnectedToRedux extends Wrapped {								
			private readonly getState: Function = windowObj.reduxStore.getState // TODO: any better way to do this?
			private unsubscribe: Function = () => {}


			constructor(props: any) {
				super(props)
				this.watchProps = this.watchProps.bind(this)
				this.connect()
			}

			private connect(): void {
				this.unsubscribe = windowObj.reduxStore.subscribe(this.watchProps)
			}

			public disconnectFromStore() {
				this.unsubscribe()
			}

			public watchProps(): void {
				const state = this.getState()
				const mappedProps = mapStateToProps(state)
				if (Wrapped.prototype.hasOwnProperty('componentWillReceiveProps')) {
					super.componentWillReceiveProps(mappedProps)
				}
			}
		}
	}
}
