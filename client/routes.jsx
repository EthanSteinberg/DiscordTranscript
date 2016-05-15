var React = window.React;
var { Route, IndexRedirect, IndexRoute } = window.ReactRouter;
import App                     from './components/index';
import Transcript from './components/Transcript';
import Search from './components/Search';
import Mentions from './components/Mentions';
import Login from './components/Login';
import { isLoggedIn } from './auth';
import * as moment from 'moment';

function requireAuth(nextState, replace) {
    if (!isLoggedIn()) {
        replace({
            pathname: '/login',
        });
    }
}

function requireNoAuth(nextState, replace) {
    if (isLoggedIn()) {
        replace({
            pathname: '/',
        });
    }
}

function dynamicRedirect(nextState, replace) {
  var a = moment.utc();
  replace({
    pathname: `/transcript/sandbox/${a.year()}/${a.month()}/${a.date()}`,
  });
}

export default (
  <Route  name="app" component={App} path="/">
      <IndexRedirect to="/transcript" />
      <Route path="/transcript" onEnter={dynamicRedirect}/>
      <Route path="/transcript/:channel/:year/:month/:day" component={Transcript} onEnter={requireAuth}/>
      <Route path="/search" component={Search} onEnter={requireAuth} />
      <Route path="/mentions" component={Mentions} onEnter={requireAuth}/>
      <Route path="/mentions/:userId" component={Mentions} onEnter={requireAuth}/>
      <Route path="/login" component={Login} onEnter={requireNoAuth} />
  </Route>
);
