var Promise = require('bluebird');
var title = require('./title');

var TennuTell = {
    requiresRoles: ['dbcore'],
    init: function(client, imports) {

        const helps = {
            "title": [
                "{{!}}title",
                "Shows the title of the last URL sent to the channel."
            ]
        };

        var liveTitle = true;
        var titleCOnfig = client.config('title');
        if (titleCOnfig) {
            if (titleCOnfig.live) {
                liveTitle = true;
            }
        }

        const dbATitlePromise = imports.dbcore.then(function(knex) {
            return title(knex);
        });

        return {
            handlers: {
                "privmsg": function(message) {
                    if (liveTitle) {
                        return dbATitlePromise.then(function(title) {
                            return title.handleLiveTitle(message.message);
                        });
                    }
                },
                "!title": function(command) {
                    // The call could take a second... or 5
                    return dbATitlePromise.then(function(title) {
                        return title.searchTitle(command.channel, client.nickname());
                    })
                }
            },

            help: {
                "title": helps.title
            },

            commands: ["title"]
        }
    }
};

module.exports = TennuTell;