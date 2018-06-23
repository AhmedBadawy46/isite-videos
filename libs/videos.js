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
            if (!err) {
                callback(err,docs)
            }
        })
    }
    videos.update = function(video,callback){
        $videos.update(video,(err,doc) => {
            callback(err,doc)
            if (!err) {
                videos.data.forEach((v, i) => {
                    if (v.id === video.id) {
                        v.link = video.link
                        v.description = video.description
                        v.title = video.title
                        v.imagePath = video.imagePath
                    }
                })
            }
        })
    }

    videos.delete = function(id,callback) {
        $videos.remove({where:{'id':id}},(err,doc) => {
            callback(err,doc)
            if(!err){
                let allVideos = videos.data
                let index = 0
                allVideos.forEach(v => {
                    if (v.id == id) {
                        index = allChannels.indexOf(v);
                    }
                });
                if (index > -1) {
                    allVideos.splice(index, 1);
                }
                videos.data = allVideos
            }
        })
    }
    videos.init()
    return videos
}