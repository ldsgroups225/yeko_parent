import { combineReducers } from 'redux'
import AppReducer from './appSlice'

/**
 * Root reducer function that combines all the reducers.
 * @returns The combined reducer object.
 */
export default combineReducers({
  AppReducer
})
