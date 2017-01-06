// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  increment: null,
  decrement: null,
  incrementBy: ['input'],
  reset: null,
})

export const TestTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  count: 0,
})

/* ------------- Reducers ------------- */

export const increment = (state: Object) =>
  state.merge({ count: state.count + 1})

export const decrement = (state: Object) =>
  state.merge({ count: state.count - 1})

export const incrementBy = (state: Object, { input }) =>
  state.merge({ count: state.count + Number(input)})

export const reset = (state: Object) =>
  state.merge(INITIAL_STATE)

export const updateInput = (state: Object) =>
  state.merge({ input: state.input })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INCREMENT]: increment,
  [Types.DECREMENT]: decrement,
  [Types.RESET]: reset,
  [Types.INCREMENT_BY]: incrementBy,
})
