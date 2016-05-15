var React = window.React;
var { PropTypes } = React;
var { Link } = window.ReactRouter;
import { isLoggedIn } from '../auth';

export default class MainView extends React.Component {
  static propTypes = {
    children: PropTypes.object,
  };

  renderHeader() {
    if (isLoggedIn()) {
      return (
        <ul className="nav navbar-nav">
          <li><Link activeClassName="active" to="/"> Transcripts</Link></li>
          <li><Link activeClassName="active" to="/mentions">Mentions</Link></li>
          <li><Link activeClassName="active" to="/search">Search</Link></li>
        </ul>
      );
    } else {
      return (
        <ul className="nav navbar-nav">
          <li><Link activeClassName="active" to="/login"> Login </Link></li>
        </ul>
      );
    }
  }

  render() {
    return (
      <div>
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <span className="navbar-brand">Lounge Transcripts</span>
          </div>
          <div id="navbar" className="collapse navbar-collapse">
            {this.renderHeader()}
          </div>
        </div>
      </nav>

        <div className="container">
          <div className="starter-template">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
