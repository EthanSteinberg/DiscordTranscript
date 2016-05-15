var Discord = require("discord.js");
var Promise = require("bluebird");
var fs = require('fs');

var config = require('./config.js');

Promise.promisifyAll(Discord.Client.prototype);

var mybot = new Discord.Client();

function readAll(channel, lastMessage, remaining) {
    var options = {};

    if (lastMessage != null) {
        options.before = lastMessage;
    }

    return mybot.getChannelLogsAsync(channel, 500, options).then(function(result) {
        if (remaining == 0 || result.length == 0) {
            // this is the end
            return result;
        }

        var last = result[result.length -1];
        return readAll(channel, last, remaining - 1).then(function(nextResult) {
            return nextResult.concat(result);
        });
    });
}

mybot.on("ready", function() {
    var channel = mybot.channels.get('name', 'sandbox');
    readAll(channel, null, 1000).then(function(result) {
        console.log(result.length);

        var betterResult = result.map(function(message) {
            return {
                authorId: message.author.id,
                content: message.cleanContent,
                id: message.id,
                mentions: message.mentions.map(function(user){return user.id;}),
                timestamp: message.timestamp
            };
        });

        fs.writeFile("what", JSON.stringify(betterResult), function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
    });
});

mybot.loginWithToken(config.token);
