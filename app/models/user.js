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
    createdAt: Date,
    updatedAt: Date
});

// on every save, add the date
userSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var User = mongoose.model('User', userSchema);

module.exports = User;