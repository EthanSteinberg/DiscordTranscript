var React = window.React;
var { Component, PropTypes } = React;
var { withRouter } = window.ReactRouter;

import { logIn } from '../auth';

class Login extends Component {
  state = {
    password: ''
  };

  handleSubmit(e) {
    e.preventDefault();

    var password = this.state.password;

    if (logIn(password)) {
      // Worked, so redirect.
      console.log('redirect?');
      this.props.router.replace('/');
    } else {
      // Show error
      this.setState({
        password: '',
        error: true,
      });
    }

  }

  updatePassword(e) {
    this.setState({password: e.target.value});
  }

  render() {

    var errorSection = null;

    if (this.state.error) {
      errorSection = (
        <div className="alert alert-warning">
          Incorrect password. Please try again.
        </div>
      );
    }

    return (
      <div>
        {errorSection}
        <form onSubmit={this.handleSubmit.bind(this)}>
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Password" onChange={this.updatePassword.bind(this)} value={this.state.password} />
          <input type="submit" value="Submit" />
        </form>
      </div>


    );
  }
}

export default withRouter(Login);
