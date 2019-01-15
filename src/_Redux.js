/**
 * Curried function meant to replicate experience of 'connect' method of 'react-redux'
 * @param {function} mapStateToProps - maps store state to individual props
 * @return {function} - a function that receives a class to use as super, to return a subclass that has can connect to the redux store
 */
export function connectToStore(mapStateToProps) {
	return function (Wrapped) {
		return class ConnectedToRedux extends Wrapped {
			constructor(props) {
				super(props)
				this.getState = window.reduxStore.getState // TODO: any better way to do this?
				this.watchProps = this.watchProps.bind(this)
				this.unsubscribe = null
				this.connect()
			}

			connect() {
				this.unsubscribe = reduxStore.subscribe(this.watchProps)
			}

			disconnectFromStore() {
				this.unsubscribe()
			}

			watchProps() {
				const state = this.getState()
				const mappedProps = mapStateToProps(state)
				if (Wrapped.prototype.hasOwnProperty('componentWillReceiveProps')) {
					super.componentWillReceiveProps(mappedProps)
				}
			}
		}
	}
}
