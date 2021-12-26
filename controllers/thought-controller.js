const { Thought, User } = require('../models');
const thoughtController = {

    //get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => { console.log(err); res.status(500).json(err) });
    },

    //get one thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate({ path: 'thoughts', select: '-__v' })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought is found by id.' });
                    return;
                }
                res.json(dbThoughtData)
            })
            .catch(err => { console.log(err); res.status(400).json(err) });
    },

    //create thought
    addThought({
        body
    }, res) {
        Thought.create(body)
            .then((ThoughtData) => {
                return User.findOneAndUpdate(
                    {
                        _id: body.userId
                    }, {
                    $addToSet: { thoughts: ThoughtData._id }
                }, {
                    new: true
                }
                );
            })
            .then(dbUsersData => {
                if (!dbUsersData) {
                    res.status(404).json({ message: 'No user is found id.' });
                    return;
                }
                res.json(dbUsersData)
            })
            .catch(err => { console.log(err); res.status(400).json(err) });
    },

    //update thought by id
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({
            _id: params.thoughtId
        }, {
            $set: body
        }, {
            runValidators: true,
            new: true
        })
            .then(updateThought => {
                if (!updateThought) {
                    return res.status(404).json({ message: 'No thought with this id.' });
                }
                return res.json({ message: "Successfully" });
            })
            .catch(err => res.json(err));
    },

    //delete thought
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
            .then(deletedThought => {
                if (!deletedThought) {
                    return res.status(404).json({ message: 'No thought with this id.' });
                }
                return User.findOneAndUpdate({
                    thoughts: params.thoughtId
                }, {
                    $pull: { thoughts: params.thoughtId }
                }, {
                    new: true
                });
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No thought found with this id.' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    //create reactions
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate({
            _id: params.thoughtId
        }, {
            $push: { reactions: body }
        }, {
            new: true,
            runValidators: true
        })
            .then(updatedThought => {
                if (!updatedThought) {
                    res.status(404).json({ message: 'No reaction is found with this id.' });
                    return;
                }
                res.json(updatedThought);
            })
            .catch(err => res.json(err));
    },

    // delete a reaction
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate({
            _id: params.thoughtId
        },
            {
                $pull: { reactions: { reactionId: params.reactionId } }
            }, {
            new: true
        }
        )
            .then((thought) => {
                if (!thought) {
                    res.status(404).json({ message: 'No reaction is found with this id.' });
                    return;
                }
                res.json(thought)
            })
            .catch(err => res.json(err));
    },
}

module.exports = thoughtController;