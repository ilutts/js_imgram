import React from 'react'
import { connect } from 'react-redux'
import Cookies from 'js-cookie'
import './UserContainer.css'

import {
  beginLogin,
  cookieAuth,
  logout,
  handleCheckboxChange,
} from '../actions/UserActions'

export const UserContainer = (props) => {
  const { user, beginLogin, cookieAuth, logout, handleCheckboxChange } = props

  // Проверяем наличие куки с токеном
  const userToken = Cookies.get('userToken')

  if (user.error) {
    return <p>Ошибка авторизации! {user.error}</p>
  }

  // При наличие токена - проводим авторизацию
  if (userToken && !user.authorized && !user.isFetching) {
    console.log('test')
    cookieAuth(userToken)
  }

  if (user.isFetching) {
    return <div className="box">Авторизация...</div>
  }

  if (user.name && user.authorized) {
    return (
      <div className="box">
        Привет, {user.name}!{' '}
        <button className="btn--logout" onClick={logout}>
          Выход
        </button>
      </div>
    )
  } else {
    return (
      <div className="box">
        <button
          className="btn--login"
          onClick={() => {
            beginLogin(user.saveLogin)
          }}
        >
          Войти
        </button>
        <input
          id="check"
          type="checkbox"
          checked={user.saveLogin}
          onChange={handleCheckboxChange}
        />{' '}
        <label htmlFor="check">Запомнить меня</label>
      </div>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    user: store.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    beginLogin: (saveLogin) => dispatch(beginLogin(saveLogin)),
    cookieAuth: (userToken) => dispatch(cookieAuth(userToken)),
    logout: () => dispatch(logout()),
    handleCheckboxChange: () => dispatch(handleCheckboxChange()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserContainer)
