var React = window.React;
var { render } = window.ReactDOM;
var { Router, browserHistory } = window.ReactRouter;
import routes               from './routes';

render(
  <Router children={routes} history={browserHistory} />,
  document.getElementById('react-view')
);
