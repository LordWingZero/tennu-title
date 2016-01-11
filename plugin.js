var title = require('./title');

var TennuTitle = {
    configDefaults: {
        "title": {
            "liveTitle": false
        }
    },
    requiresRoles: ['dbcore'],
    init: function(client, imports) {

        const helps = {
            "title": [
                "{{!}}title",
                "Shows the title of the last URL sent to the channel."
            ]
        };

        var titleConfig = client.config("title");

        const dbATitlePromise = imports.dbcore.then(function(knex) {
            return title(knex);
        });

        return {
            handlers: {
                "privmsg": function(message) {
                    if (titleConfig.liveTitle) {
                        return dbATitlePromise.then(function(title) {
                            return title.handleLiveTitle(message.message);
                        });
                    }
                },
                "!title": function(command) {
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

module.exports = TennuTitle;