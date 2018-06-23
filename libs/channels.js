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
        $channels.getAll({
            where: {
                'user_id': user_id
            }
        }, (err, docs) => {
            if (!err) {
                callback(docs)
            }
        })
    }

    channels.update = function (channel, callback) {
        $channels.update(channel, (err, doc) => {
            callback(err, doc)
            if (!err) {
                channels.data.forEach((ch, i) => {
                    if (ch.id === channel.id) {
                        ch.channelName = channel.channelName
                        ch.description = channel.description
                        ch.logoPath = channel.logoPath
                        ch.bannerPath = channel.bannerPath
                    }
                })
            }
        })

    }

    channels.delete = function (id, callback) {
        $channels.remove({where: {'id': id}}, (err, result) => {
            callback(err,result)
            if (!err) {
                let allChannels = channels.data
                let index = 0
                allChannels.forEach(c => {
                    if (c.id == id) {
                        index = allChannels.indexOf(c);
                    }
                });
                if (index > -1) {
                    allChannels.splice(index, 1);
                }
                channels.data = allChannels
            }
        })
    }

    channels.channelDetails = function(id,callback) {
        $channels.findOne({where:{'id' : id}},(err,doc) => {
            callback(err,doc)
        })
    }

    channels.addVideo = function(data,callback) {
        $channels.findOne({
            where:{'id' : data.channelId}, 
            select:{'videos': 1}
        },(err,channel) => {
            callback(err,channel)
        })
    }

    channels.init()
    return channels
}