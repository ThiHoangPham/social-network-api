const { User } = require('../models');

const userController = {
    // get all users
    getAllUsers(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                select: ('-__v')
            })
            .populate({
                path: 'friends',
                select: ('-__v')
            })
            .select('-__v')
            .sort({
                _id: -1
            })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    // get one user by id
    getUserById({ params }, res) {
        User.findOne({
            _id: params.id
        })
            .populate({
                path: 'thoughts',
                seclect: '-__v'
            })
            .seclect('-__v')
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },
}