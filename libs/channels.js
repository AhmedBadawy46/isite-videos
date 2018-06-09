module.exports = function (site) {
    let $channels = site.connectCollection({
        collection: "channels",
        db: "videos"
    })

    const channels = {
        data: []
    }

    channels.init = function () {
        $channels.getAll({}, (err, docs) => {
            if (!err && docs) {
                channels.data = docs
            }
        })
    }

    channels.loadAll = function () {
        return channels.data
    }

    channels.addchannel = function (channel, callback) {
        $channels.insert(channel, (err, doc) => {
            callback(err, doc)
            if (!err) {
                channels.data.push(channel)
            }
        })

    }

    channels.getUserChannels = function (user_id, callback) {

        $channels.getAll({where: {'user_id': user_id}}, (err, docs) => {
            if (!err) {
                callback(docs)
            }
        })
    }

    channels.init()
    return channels
}