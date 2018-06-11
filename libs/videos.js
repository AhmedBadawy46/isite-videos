module.exports = function (site) {
    let $videos = site.connectCollection({
        collection: "videos",
        db: "videos"
    })

    const videos = {
        data: []
    }

    videos.init = function () {
        $videos.getAll({}, (err, docs) => {
            if (!err && docs) {
                videos.data = docs
            }
        })
    }

    videos.loadAll = function () {
        return videos.data
    }

    videos.addVideo = function (video, callback) {

        $videos.insert(video, (err, doc) => {
            callback(err, doc)
            if (!err) {
                videos.data.push(video)
            }
        })

    }

    videos.getChannelVideos = function (channelId, callback) {
        let ch_id = parseInt(channelId) 
        $videos.getAll({
            where: {
                channelId :  ch_id
            }
        }, (err, docs) => {
            console.log(docs)
            if (!err) {
                callback(err,docs)
            }
        })
    }

    videos.init()
    return videos
}