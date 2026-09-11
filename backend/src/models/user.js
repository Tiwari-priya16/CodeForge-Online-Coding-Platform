const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 30
    },
    lastName: {
        type: String,
        default: ''
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        immutable: true,
    },
    age: {
        type: Number,
        min: 6,
        max: 80,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    username: {
        type: String,
        trim: true,
        lowercase: true,
        default: ''
    },
    bio: {
        type: String,
        default: 'DSA Enthusiast & Developer'
    },
    githubUrl: {
        type: String,
        default: ''
    },
    linkedinUrl: {
        type: String,
        default: ''
    },
    profilePic: {
        type: String,
        default: ''
    },
    problemSolved: [{
        type: Schema.Types.ObjectId,
        ref: 'problem'
    }],
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

userSchema.post('findOneAndDelete', async function (userInfo) {
    if (userInfo) {
        await mongoose.model('submission').deleteMany({ userId: userInfo._id });
    }
});

const User = mongoose.model("user", userSchema);

module.exports = User;
