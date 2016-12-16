var title = require('./lib/title');

var TennuTitle = {
    configDefaults: {
        "title": {
            "liveTitle": false
        }
    },
    requiresRoles: ['dblogger', 'dbcore'],
    init: function(client, imports) {

        const helps = {
            "title": [
                "{{!}}title",
                "Shows the title of the last URL sent to the channel."
            ]
        };

        var titleConfig = client.config("title");

        title = title(imports.dbcore.knex);

        return {
            handlers: {
                "privmsg": function(message) {
                    if (titleConfig.liveTitle) {
                        return title.handleLiveTitle(message.message);
                    }
                },
                "!title": function(command) {
                    return title.searchTitle(command.channel, client.nickname());
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