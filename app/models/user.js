var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    playlists: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    firstName: String,
    lastName: String,
    email: String,
    accessToken: String,
    refreshToken: String,
    expiresIn: Number,
    createdAt: Date,
    updatedAt: Date
}, {
    timestamps: true,
    versionKey: false
});


var User = mongoose.model('User', userSchema);

module.exports = User;