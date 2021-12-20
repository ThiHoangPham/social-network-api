const router = require('express').Router();

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addToFriendList,
    removeFromFriendList
} = require('../../controllers/user-controller');