var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');

var db = new sqlite3.Database('foo.sql');

db.serialize(function() {

    db.run("DROP TABLE IF EXISTS messages");
    db.run("DROP TABLE IF EXISTS mentions");

    db.run("CREATE TABLE messages (id TEXT, authorId TEXT, content TEXT, timestamp INT, channel TEXT)");
    db.run("CREATE TABLE mentions (messageId TEXT, userId Text)");


    var data = JSON.parse(fs.readFileSync('sandbox.json'));

    var stmt = db.prepare("INSERT INTO messages VALUES (?, ?, ?, ?, 'sandbox')");
    var stmt2 = db.prepare("INSERT INTO mentions VALUES (?, ?)");

    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        stmt.run(item.id, item.authorId, item.content, item.timestamp);

        for (var j = 0; j < item.mentions.length; j++) {
            stmt2.run(item.id, item.mentions[j]);
        }
    }

    stmt.finalize();
    stmt2.finalize();
});

db.close();