var React = window.React;
var { Component, PropTypes } = React;
var { withRouter } = window.ReactRouter;
var Typeahead = window.ReactBootstrapTypeahead;

class Mentions extends Component {

  constructor(props) {
    super(props);

    this.state = {
      users: null
    };
  }

  componentDidMount() {
    fetch('/api/users').then((response) => {
      return response.json();
    }).then((users) => {
      this.setState({
        users
      });
    });
  }

  renderMentions() {
    return <div> Lol </div>;
  }

  updateUser(e) {
    console.log('for show');
  }

  renderMentionSelector() {
    if (this.state.users == null) {
      return <div> Loading </div>;
    } else {
      var options = this.state.users.map((user) => ({
        id: user.id,
        label: user.name
      }));
      return (
        <div>
          <form>
            <label htmlFor="userSelector">User:</label>

            <Typeahead
              id="userSelector"
              options={options}
              onChange={((a) => console.log(a))}
              selected={[options[0]]} />
          </form>

          <h2> Last 100 Mentions </h2>
          {this.renderMentions()}
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <h2> Mentions </h2>
        {this.renderMentionSelector()}
      </div>
    );
  }
}

export default withRouter(Mentions);