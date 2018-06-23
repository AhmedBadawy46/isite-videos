module.exports = function(site){
    let $playlists = site.connectCollection({
        collection: "Playlists",
        db: "videos"
    })
    const playlists = {
        data: []
    }

    playlists.init = function () {
        $playlists.getAll({}, (err, docs) => {
            if (!err && docs) {
                playlists.data = docs
            }
        })
    }

    playlists.loadAll = function () {
        return playlists.data
    }

    playlists.getChannelPlaylist = function (channelId, callback) {
        let ch_id = parseInt(channelId) 
        $playlists.getAll({
            where: {
                channelId :  ch_id
            }
        }, (err, docs) => {
            if (!err) {
                callback(err,docs)
            }
        })
    }

    playlists.addPlaylist = function(playlist,callback){
        $playlists.insert(playlist,(err,doc) => {
            callback(err,doc)
            if(!err){
                playlists.data.push(playlist)
            }
        })
    }

    playlists.init()
    return playlists

}