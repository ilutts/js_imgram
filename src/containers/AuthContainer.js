import React from 'react'
import PropTypes from 'prop-types'

import Cookies from 'js-cookie'
import { connect } from 'react-redux'

import { Redirect } from 'react-router-dom'

import { endLogin } from '../actions/UserActions'

export const AuthContainer = (props) => {

  // Получаем код авторизации
  const code = window.location.search.split('code=')[1]
  // Записываем данные куки для сохранения авторизации
  const saveLogin = Cookies.get('saveLogin')

  if (code) {
    props.endLogin(code, +saveLogin)
    return (
      <div>
        <Redirect to="/" />
      </div>
    )
  }

  return (
    <div>
      <h1>Ошибка авторизации!</h1>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    endLogin: (code, saveLogin) => dispatch(endLogin(code, saveLogin)),
  }
}

export default connect(null, mapDispatchToProps)(AuthContainer)

AuthContainer.propTypes = {
  endLogin: PropTypes.func.isRequired,
}
