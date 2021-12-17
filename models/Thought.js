const { Schema, model } = require('mongoose');
const moment = require('moment');
const reactionSchema = require('/Reaction');
const Thought = model('Thought', ThoughtSchema)

const ThoughtSchema = new Schema({
    thoughtText: {
        type: String,
        require: true,
        minlength: 1,
        maxlength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
    },
    username: {
        type: String,
        require: true
    },
    reactions: [reactionSchema]
}, {
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});

ThoughtSchema.virtual('reactionCount').get(function () {
    return this, reactions.length;
});

module.exports = Thought; 