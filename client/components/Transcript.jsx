var { withRouter, Link } = window.ReactRouter;
var React = window.React;

import moment from 'moment';

class Transcript extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      channels: null,
      messages: null,
    };
  }

  componentDidMount() {
    fetch('/api/channels').then((response) => {
      return response.json();
    }).then((channels) => {
      var {channel} = this.props.routeParams;
      if (channels.indexOf(channel) == -1) {
        this.updateChannel(channels[0]);
      }

      this.setState({
        channels: channels
      });
    });

    this.startGettingMessages(this.props);

  }

  startGettingMessages(props) {
    var {year, month, day, channel} = props.routeParams;
    fetch(`/api/messages/${channel}/${year}/${month}/${day}`).then((response) => {
      return response.json();
    }).then((messages) => {

      this.setState((prevState, currentProps) => {
        if (currentProps.routeParams == props.routeParams) {
          return {
            messages
          };
        } else {
          return {};
        }
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.routeParams != nextProps.routeParams) {
      // Need to update message thingy.
      this.setState({
        messages: null
      });

      this.startGettingMessages(nextProps);
    }
  }

  setupDate(element) {
    $(element).datepicker();
    $(element).datepicker('setDate',
      new Date(this.props.routeParams.year, this.props.routeParams.month, this.props.routeParams.day)
    );
    $(element).datepicker().on('changeDate', (e) => {
      var a = moment(e.date);
      var current = moment([this.props.routeParams.year, this.props.routeParams.month, this.props.routeParams.day]);
      if (a.isSame(current)) {
        return;
      }
      this.props.router.replace(this.getAddr(a));
    });
  }

  updateChannelFromEvent(e) {
    this.updateChannel(e.target.value);
  }

  updateChannel(nextChannel) {
    var {year, month, day} = this.props.routeParams;
    this.props.router.replace(`/transcript/${nextChannel}/${year}/${month}/${day}`);
  }

  renderMessage(message) {
    var avatarSource = `https://cdn.discordapp.com/avatars/${message.authorId}/${message.avatar}.jpg`;
    var time = moment(message.timestamp);
    return (
      <li key={message.id} className="list-group-item">
        <img className="avatar" src={avatarSource} /> {message.authorName}: {message.content}
        <span className="messageTime">{time.format('LT')}</span>
      </li>
    );
  }

  renderMessages() {
    if (this.state.messages == null) {
      return <div> Loading </div>;
    }

    var messageItems = this.state.messages.map(this.renderMessage);

    return (
      <ul class="list-group">
        {messageItems}
      </ul>
    );
  }

  getAddr(aMoment) {
    var year = aMoment.year();
    var month = aMoment.month();
    var date = aMoment.date();
    var channel = this.props.routeParams.channel;
    return `/transcript/${channel}/${year}/${month}/${date}`;
  }

  renderNextPrevButtons() {
    var current = moment([this.props.routeParams.year, this.props.routeParams.month, this.props.routeParams.day]);
    var prevAddr = this.getAddr(current.add(-1, 'day'));
    var nextAddr = this.getAddr(current.add(2, 'day'));

    console.log(current.format(), current.add(-1, 'day').format(), current.add(2, 'day').format());
    return (
      <div>
        <Link className="btn btn-primary" to={prevAddr}> Previous Day </Link>
        <Link className="btn btn-primary" to={nextAddr}> Next Day </Link>
      </div>
    );
  }

  render() {
    var {year, month, day, channel} = this.props.routeParams;
    var channelOptions = null;

    if (this.state.channels == null) {
      channelOptions = [
        <option key={name} value={channel}>{channel}</option>
      ];
    } else {
      channelOptions = this.state.channels.map(function(name) {
        return <option key={name} value={name}>{name}</option>
      });
    }

    return (
      <div>
        <h2> Transcript </h2>
        <form>

          <label htmlFor="dateInput">Date:</label>
          <input ref={this.setupDate.bind(this)} id="dateInput"/>
          <br />

          <label htmlFor="channelSelector">Channel:</label>
          <select className="form-control channel-selector" id="channelSelector" value={channel} onChange={this.updateChannelFromEvent.bind(this)}>
            {channelOptions}
          </select>
        </form>

        <h2> Messages </h2>
        {this.renderNextPrevButtons()}
        <div> {this.renderMessages()} </div>
        {this.renderNextPrevButtons()}
      </div>
    );
  }
}

export default withRouter(Transcript);
