import Unsplash, { toJson } from 'unsplash-js'
import Cookies from 'js-cookie'

export const unsplash = new Unsplash({
  accessKey: 'k2Sm9cx4iqf6-mN8YvFxt11ldjvu8ruh9_qhlMkUHOY',
  secret: 'P_ygcGKWkmM5LRhJBKp1T3T6pjxhoqA9TAgTgrsXd9k',
  //callbackUrl: 'http://localhost:3000/auth',
  callbackUrl: 'http://js.yourdev.ru/auth',
})

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_COOKIE_REQUEST = 'LOGIN_COOKIE_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAIL = 'LOGIN_FAIL'

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'

export const CHECKBOX_CHANGE = 'CHECKBOX_CHANGE'

export function beginLogin(saveLogin) {
  // Начало авторизации с переходом на страницу unsplash
  return (dispatch) => {
    dispatch({
      type: LOGIN_REQUEST,
    })
    // При наличие птички в чекбоксе записываем куки для сохрания авторизации
    saveLogin ? Cookies.set('saveLogin', '1') : Cookies.set('saveLogin', '0')
    const authenticationUrl = unsplash.auth.getAuthenticationUrl([
      'public',
      'write_likes',
    ])
    // Переходим на сайт unsplash для получения доступа
    window.location.assign(authenticationUrl)
  }
}

export function endLogin(code, saveLogin) {
  // Заканчиваем авторизацию после возвращения c unsplash
  return (dispatch) => {
    dispatch({
      type: LOGIN_REQUEST,
    })
    unsplash.auth
      .userAuthentication(code)
      .then(toJson)
      .then((jsonAuth) => {
        unsplash.auth.setBearerToken(jsonAuth.access_token)
        unsplash.currentUser
          .profile()
          .then(toJson)
          .then((jsonUser) => {
            // Записываем токен и имя пользователя в куки для сохранения авторизации
            if (saveLogin) {
              Cookies.set('userToken', jsonAuth.access_token, { expires: 7 })
              Cookies.set('userName', jsonUser.name, { expires: 7 })
            }
            // Получаем имя пользователя
            dispatch({
              type: LOGIN_SUCCESS,
              payload: jsonUser.name,
            })
          })
      })
      .catch((err) =>
        dispatch({
          type: LOGIN_FAIL,
          error: true,
          payload: new Error(err),
        })
      )
  }
}
// Авторизация при наличие куки с токеном
export function cookieAuth(userToken) {
  return (dispatch) => {
    const userName = Cookies.get('userName')
    dispatch({
      type: LOGIN_COOKIE_REQUEST,
      payload: userName,
    })
    unsplash.auth.setBearerToken(userToken)
    unsplash.currentUser
      .profile()
      .then(toJson)
      .then((jsonUser) => {
        // Получаем имя пользователя
        dispatch({
          type: LOGIN_SUCCESS,
          payload: jsonUser.name,
        })
      })
      .catch((err) => {
        dispatch({
          type: LOGIN_FAIL,
          error: true,
          payload: new Error(err),
        })
      })
  }
}
// Завершение авторизации
export function logout() {
  return (dispatch) => {
    // Удаляем все данные пользователя
    unsplash.auth.setBearerToken('')
    Cookies.remove('userToken')
    Cookies.remove('userName')
    Cookies.remove('saveLogin')
    dispatch({
      type: LOGOUT_SUCCESS,
    })
  }
}
// Переключение чекбокса
export function handleCheckboxChange() {
  return (dispatch) => {
    dispatch({
      type: CHECKBOX_CHANGE,
    })
  }
}
