import { combineReducers } from 'redux'

import { imageReducer } from './image'
import { userReducer } from './user'

export const rootReducer = combineReducers({
  image: imageReducer,
  user: userReducer,
})
