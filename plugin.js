var title = require('./title');

var TennuTitle = {
    requiresRoles: ['dbcore'],
    init: function(client, imports) {

        const helps = {
            "title": [
                "{{!}}title",
                "Shows the title of the last URL sent to the channel."
            ]
        };

        var titleConfig = client.config("title");

        if (!titleConfig || !titleConfig.hasOwnProperty("liveTitle")) {
            throw Error("asay is missing some or all of its configuration.");
        }

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