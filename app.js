module.exports = function (site) {
    const channels = require('./libs/channels')(site)
    const videos = require('./libs/videos')(site)
    site.get({
        name: '/my-channels',
        path: __dirname + '/site_files/html/index.html',
        parser: "html css js"
    })

    site.post('/api/youtube/addchannel', (req, res) => {
        let channel = req.body
        channel.user_id = req.session.user.id
        channel.created_date = new Date()
        channel.view_count = 0
        channel.followers_count = 0
        channel.likes_count = 0
        channel.rate = 0
        channel.dislike_count = 0
        channels.addchannel(channel, (err, doc) => {
            if (!err) {
                res.json({
                    done: true
                })
            } else {
                res.json({
                    done: false,
                    err: err.message
                })
            }
        })
    })

    site.post('/api/youtube/getUserChannels', (req, res) => {
        let user_id = req.session.user.id
        channels.getUserChannels(user_id, (channels) => {
            res.json(channels)
        })
    })

    site.post("uploadFile", (req, res) => {
        var response = {
            done: true
        }
        var file = req.files.fileToUpload
        var newpath = __dirname + "/images/" + file.name
        site.mv(file.path, newpath, function (err) {
            if (err) {
                response.error = err
                response.done = false
            }
            response.FilePath = "/api/images/" + file.name
            res.end(JSON.stringify(response))
        })
    })

    //custom Route
    site.get('/api/images/:name', (req, res) => {
        site.readFile(__dirname + "/images/" + req.params.name, (err, content) => {
            res.set('content-type', 'image/jpg')
            res.end(content, 'binary')
        })
    })

    site.get({name: '/channel/:id/:name',path: __dirname + '/site_files/html/channel_details.html',parser: "html css js"})

    site.post('/api/youtube/getChannelDetails/:id',(req,res) => {
        channels.channelDetails(req.params.id,(err,doc) => {
            if(!err){
                res.json(doc)
            }
        })
    })
    site.post('/api/youtube/updatechannel', (req, res) => {
        let channel = req.body
        channels.update(channel, (err, doc) => {
            if (!err) {
                res.json({
                    done: true
                })
            } else {
                res.json({
                    done: false,
                    err: err.message
                })
            }
        })
    })

   

    site.post('/api/youtube/deleteChannel',(req,res) =>{
        let id = req.body.id
        channels.delete(id,(err,result) => {
            if(!err){
                res.json({
                    done:true
                })
            }else{
                res.json({
                    done:false
                })
            }
        })

        
    })

    site.post('/api/youtube/addVideo',(req,res) => {
        let video = req.body
        video.playListId = req.body.playListId == 'undefined' ? 0 : req.body.playListId
        video.added_date = new Date()
        video.view_count = 0
        video.likes_count = 0
        video.dislike_count = 0
        console.log('playListId : ' + video.playListId)
        videos.addVideo(video,(err,v) => {
            if(!err){
                res.json({
                    done:true
                })
            }
            else{
                res.json({
                    done:false,
                    error:err.message
                })
            }
        })
    })

    site.post('/api/youtube/getChannelVideos/:id',(req,res) => {
        videos.getChannelVideos(req.params.id,(err,doc) => {
            if(!err){
                res.json(doc)
            }
        })
    })

    site.post('/api/youtube/updateVideo',(req,res) => {
        videos.update(req.body,(err,doc) => {
            if (!err) {
                res.json({
                    done: true
                })
            } else {
                res.json({
                    done: false,
                    err: err.message
                })
            }
        })
    })

    
    
    site.on('mongodb after insert',info => {
        console.log("data inserted")        
    })




}