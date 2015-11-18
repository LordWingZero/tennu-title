var title = require('./title');

var TennuTitle = {
    requiresRoles: ['admin', 'dbcore'],
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

        var requiresAdminHelp = "Requires admin privileges.";

        var isAdmin = imports.admin.isAdmin;
        var adminCooldown = client._plugins.getRole("cooldown");
        if (adminCooldown) {
            var cooldown = titleConfig['cooldown'];
            if (!cooldown) {
                client._logger.warn('tennu-asay: Cooldown plugin found but no cooldown defined.')
            }
            else {
                isAdmin = adminCooldown();
                client._logger.notice('tennu-title: cooldowns enabled: ' + cooldown + ' seconds.');
            }
        }

        const dbATitlePromise = imports.dbcore.then(function(knex) {
            return title(knex);
        });

        function adminFail(err) {
            return {
                intent: 'notice',
                query: true,
                message: err
            };
        }

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
                    return isAdmin(command.hostmask).then(function(isadmin) {

                        // isAdmin will be "undefined" if cooldown system is enabled
                        // isAdmin will be true/false if cooldown system is disabled
                        if (typeof(isadmin) !== "undefined" && isadmin === false) {
                            throw new Error(requiresAdminHelp);
                        }

                        // The call could take a second... or 5
                        return dbATitlePromise.then(function(title) {
                            return title.searchTitle(command.channel, client.nickname());
                        })
                        
                    }).catch(adminFail);
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