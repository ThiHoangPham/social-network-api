const { User, Thought } = require('../models');

const userController = {

    // get all users
    getAllUsers(req, res) {
        User.find({})
            .populate({ path: 'thoughts', select: ('-__v') })
            .populate({ path: 'friends', select: ('-__v') })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // get one user by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({ path: 'thoughts', select: '-__v' })
            .select('-__v')
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    // create user
    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },

    // update user by id
    undateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user is found by this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    //delete user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ id: params.id })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user is found by this id.' });
                    return;
                }
                return dbUserData;
            })
            .then(dbUserData => {
                User.updateMany({
                    _id: { $in: dbUserData.friends }
                }, {
                    $pull: { friends: params.userId }
                })
                    .then(() => {
                        Thought.deleteMany({ username: dbUserData.username })
                            .then(() => {
                                res.json({ message: 'User is deleted.' });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(400).json(err);
                            })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400).json(err);
                    })
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },

    //add friends
    addToFriendList({ params }, res) {
        User.findOneAndUpdate({
            _id: params.userId
        }, {
            $push: { friends: params.friendId }
        }, {
            new: true
        })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user is found by this id.' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err)
                res.json(err)
            });
    },
    // delete friend
    removeFromFriendList({ params }, res) {
        User.findOneAndDelete({ _id: params.thoughtId })
            .then(deletedFriend => {
                if (!deletedFriend) {
                    return res.status(404).json({ message: 'No friend is found by this id!' })
                }
                return User.findOneAndUpdate({
                    friends: params.friendId
                }, {
                    $pull: { friends: params.friendId }
                }, {
                    new: true
                });
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No friend is found by this id.' })
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },
};

module.exports = userController;