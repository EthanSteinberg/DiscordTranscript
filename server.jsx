import express                   from 'express';
import path                      from 'path';
import moment from 'moment';
import token from 'config';

var sqlite3 = require('sqlite3').verbose();


var Discord = require("discord.js");
var Promise = require("bluebird");
var fs = require('fs');


Promise.promisifyAll(Discord.Client.prototype);

var mybot = new Discord.Client();

mybot.loginWithToken(token);

const app = express();

var db = new sqlite3.Database('foo.sql');

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/api/channels', (req, res) => {
  var channels = ["sandbox"];

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(channels));
});

app.get('/api/users', (req, res) => {
  var result = mybot.users.map(function(user) {
    return {
      id: user.id,
      name: user.name
    };
  });

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(result));
});

app.get('/api/messages/:channel/:year/:month/:date', (req, res) => {
  var day = moment.utc([req.params.year, req.params.month, req.params.date]);

  var startTime = day.unix() * 1000;
  var endTime = day.add(1, 'day').unix() * 1000;

  db.all(
    "SELECT * FROM messages WHERE channel == ? AND timestamp >= ? AND timestamp < ? ORDER BY timestamp",
    req.params.channel, startTime, endTime, function(err, rows) {
      var betterRows = rows.map(function(row) {
        var actualUser = mybot.users.get('id', row.authorId);

        return {
          authorName: actualUser.name,
          avatar: actualUser.avatar,
          ...row
        };
      });

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(betterRows));
    }
  );
});

app.use( (req, res) => {

  res.sendFile(path.join(__dirname, 'static/index.html'));

});

export default app;
