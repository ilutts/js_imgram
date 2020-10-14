import {
  LOGIN_REQUEST,
  LOGIN_COOKIE_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  CHECKBOX_CHANGE,
} from '../actions/UserActions'

const initialState = {
  name: '', // Имя пользователя
  error: '', // добавили для сохранения текста ошибки
  isFetching: false, // добавили для реакции на статус "загружаю" или нет
  authorized: false, // Статус авторизации
  saveLogin: false, // Статус чекбокса
}

export function userReducer(state = initialState, action) {
  switch (action.type) {
    // Обработка авторизации пользователя
    case LOGIN_REQUEST:
      return { ...state, isFetching: true, name: action.payload, error: '' }
    case LOGIN_COOKIE_REQUEST:
      return { ...state, isFetching: true, error: '' }
    case LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        name: action.payload,
        authorized: true,
      }
    case LOGIN_FAIL:
      return { ...state, isFetching: false, error: action.payload.message }
    // Завершение авторизации
    case LOGOUT_SUCCESS:
      return { ...state, name: '', authorized: false }
    // Смена статуса чекбокса
    case CHECKBOX_CHANGE:
      return { ...state, saveLogin: !state.saveLogin }
    default:
      return state
  }
}
