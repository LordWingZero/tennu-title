var moment = require('moment');
var fetch = require('node-fetch');
var format = require('util').format;


function title(knex) {
    return {
        knex: knex,
        searchTitle: searchTitle,
        handleLiveTitle: handleLiveTitle
    };
}

function handleLiveTitle(message) {
    var foundURI = GetURI(message);
    if (foundURI) {
        return handleWebCall(foundURI).then(function(titleMatch) {
            return format('%s (%s)', titleMatch, foundURI);
        });
    }
}

function searchTitle(to, ignoreNick) {
    return dbTitleSearch(to, ignoreNick, this.knex)
        .then(function(row) {

            if (!row) {
                return 'No links in database.';
            }

            // This attempts to extract a URL
            var match = GetURI(row.Message);

            if (!match) {
                return format('Failed to extract valid URI from %s', row.Message);
            }

            return handleWebCall(match).then(function(titleMatch) {
                if (!titleMatch) {
                    return 'Couldnt find any <title></title> tags.';
                }

                var now = moment(new Date());
                var timeAgoMessage = moment(row.Timestamp).from(now);

                return format('From %s %s: %s (%s)', row.FromNick, timeAgoMessage, titleMatch, match);
            });

        });
}

function GetURI(rawText) {
    var match = rawText.match(/(?:(?:https?):\/\/|www\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm);
    if (match) {
        return match[0];
    }
};

function handleWebCall(URI) {

    if (URI.substring(0, 3) === 'www') {
        URI = 'http://' + URI;
    }

    return fetch(URI)
        .then(function(res) {
            return res.text();
        }).then(function(body) {
            var titleMatch = body.match(/<title.*>([\S\s]*?)<\/title>/i);
            if (titleMatch) {
                return titleMatch[1].replace(/^[\r\n]+|[\r\n]+$/g, "").trim();
            }
        });
}

function dbTitleSearch(to, ignoreNick, knex) {
    return knex('message').where({
            Channel: to
        })
        .whereNot({
            'FromNick': ignoreNick
        })
        .where(function() {
            this.where('Message', 'like', '%http://%')
                .orWhere('Message', 'like', '%https://%')
                .orWhere('Message', 'like', '%www.%');
        })
        .orderBy('Timestamp', 'desc')
        .first();
};

module.exports = title;