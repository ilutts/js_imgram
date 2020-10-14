import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from './store/configureStore'

import './index.css'

import App from './components/App'

import AuthContainer from './containers/AuthContainer'

import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom'

import * as serviceWorker from './serviceWorker'

function NoMatch() {
  let location = useLocation()

  return (
    <div>
      <h3>
        Страница отсутствует - <code>{location.pathname}</code>
      </h3>
    </div>
  )
}

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/">
          <App />
        </Route>
        <Route path="/auth">
          <AuthContainer />
        </Route>
        <Route path="/img/:id">
          <App />
        </Route>
        <Route>
          <NoMatch />
        </Route>
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
)

serviceWorker.unregister()
