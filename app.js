
module.exports =  function(site){
    const channels = require('./libs/channels')(site)
    site.get({name : '/my-channels' , path : __dirname + '/site_files/html/index.html' , parser : "html css js"})

    site.post('/api/youtube/addchannel',(req,res) => {
        let channel = req.body
        channel.user_id = req.session.user.id
        channel.created_date = new Date()
        channel.view_count = 0
        channel.followers_count = 0
        channel.likes_count = 0
        channel.rate = 0
        channel.dislike_count = 0
        channels.addchannel(channel,(err,doc) => {
            if(!err){
                res.json({done:true})
            }else{
                res.json({done:false,err:err.message})
            }
        })
    })
    

}