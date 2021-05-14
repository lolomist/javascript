const userModule = require('../../modules/user/index')
const { send, sendCookie, sendError, sendMessage } = require('../../modules/responses/index')
const passport = require('passport');
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../../config/config.json');

const register = (req, res) => {
    const { name, firstname, email, password, address, postal } = req.body;

    if (!name || !firstname || !email || !password)
        return sendError(res, 'Merci de remplir toutes les cases.')
    if (password.length < 6)
        return sendError(res, 'Les mdp doivent faire 6 charactères minimum.')

    const user = {
        name,
        firstname,
        email,
        password,
        address: address ? address : "",
        postal: postal ? postal : ""
    }
    send(res, userModule.register(user))
}

const login = (req, res) => {
    if (req.user.error)
        return sendError(res, 'Credentials do not match.')
    const payload = {
        email: req.user.email,
        _id: req.user._id,
        rights: req.user.rights
    }

    jwt.sign(payload, config.JWT_SECRET, { expiresIn: 60 * 60 * 24 }, (error, token) => {
        if (error) {
            sendError(res, error)
            console.log('here', res, error)
        }
        sendCookie(res, 'token', token, 'You are now logged in.', req.user)
    })
}

const logout = (req, res) => {
    res.status(200).clearCookie('token').json({
        success: true,
        message: 'Logged out.'
    });
}

const changePassword = (req, res) => {
    const { password } = req.body

    if (!password)
        return sendError(res, 'password required')

    send(res, userModule.updatePassword(req.user, password))
}

const recupPassword = (req, res) => {
    const { email } = req.body

    if (!email)
        return sendError(res, 'email required')
    send(res, userModule.recupPassword(email))
}

const changeInfo = (req, res) => {
    const { name, firstname, address, postal } = req.body

    if (!name || !firstname || !address || !postal)
        return sendError(res, 'params missings')
    send(res, userModule.changeInfo(req.user, { name, firstname, address, postal }))
}

const getCatastropheInfos = (req, res) => {
    const { latitude, longitude } = req.query

    if (!latitude || !longitude)
        return sendError(res, 'params missings')
    send(res, userModule.getCatastropheInfos(req.user, { latitude, longitude }))
}

const getClosestRefuge = (req, res) => {
    const { latitude, longitude } = req.query

    if (!latitude || !longitude)
        return sendError(res, 'params missings')
    send(res, userModule.getClosestRefuge(req.user, { latitude, longitude }))
}

const getInfos = (req, res) => send(res, userModule.getInfos(req.user))

router.post('/register', register)
router.post('/login', passport.authenticate('local', { session: false }), login)
router.get('/facebook', passport.authenticate('facebook'))
router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), login)
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
router.get('/google/callback', passport.authenticate('google', { session: false }), login)

router.get('/logout', logout);
router.post('/changemdp', changePassword)
router.post('/recupmdp', recupPassword)
router.post('/changeinfo', changeInfo)
router.get('/infos', getInfos)

router.get('/catastropheInfos', getCatastropheInfos)
router.get('/closestRefuge', getClosestRefuge)

router.get('/test', (req, res) => {
    sendMessage(res, "you are connected")
});

module.exports = router;