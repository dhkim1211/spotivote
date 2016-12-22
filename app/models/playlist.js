var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: String,
        ref: 'User',
        required: true
    },
    tracks: [{
        id: String,
        name: String,
        artist: String,
        votes: Number
    }],
    accessCode: Number,
    playlistId: String,
    createdAt: Date,
    updatedAt: Date
});

// on every save, add the date
playlistSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    if (!this.accessCode)
        this.accessCode = Math.floor(Math.random()*90000) + 10000;

    next();
});

var Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;