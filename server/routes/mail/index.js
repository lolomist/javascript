const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const { User } = require('../../modules/user/schemas/User');
const { UserHash } = require('../../modules/user/schemas/UserHash');

router.use(bodyParser.json({ limit: '50mb', extended: true }));
router.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const emailModule = require('../../modules/mail')
const { sendError, sendMessage } = require('../../modules/responses/index')

const { ISAROK_MAIL } = require('../../config/config.json')

/* GET api listing. */
router.get('/', function (req, res) {
    res.send('api');
});

const url = "http://localhost:3000/mail/activate-account?id="

router.get('/confirm-email', async (req, res) => {
    const user = await User.findById(req.query.id)
    if (!user)
        return sendError(res, "user undefined")
    if (user.verified)
        return sendError(res, "email already verified")
    await User.updateOne({ _id: user._id }, { verified: "true" })
    sendMessage(res, "email verified")
})

router.get('/activate-account', async (req, res) => {
    const user = await User.findById(req.query.id)
    if (!user)
        return sendError(res, "user undefined")
    await User.updateOne({ _id: user._id }, { rights: "isarok" })
    sendMessage(res, "account granted")
})

router.post('/certifier', async (req, res, next) => {
    // if (!req.body.img)
    //     sendError(res, "image required")
    const user = await User.findById(req.user._id)
    if (!user)
        return sendError(res, "user doesn't exist")
    if (user.rights !== 'user')
        return sendError(res, "User has already upper rights than \"user\"")
    if (!user.verified)
        return sendError(res, "user mail is not verified")

    return emailModule.send({
        recipient: ISAROK_MAIL,
        subject: 'Verification compte',
        content: `Voici le document à vérifier pour ${user.name} ${user.firstname}\n\n`
        + `\nPour donner les droits Isarok à cet utilisateur, cliquez sur le lien ci-dessous:\n${url + req.user._id}`,
        // attachments: [{
        //     filename: 'image.jpg',
        //     content: req.body.img,
        //     encoding: 'base64'
        // }]
    }).then(info => {
        console.log('Message %s sent: %s', info.messageId, info.response)
        sendMessage(res, info.messageId)
    }).catch(error => {
        console.error(error)
        sendError(res, error)
    })
});

router.get('/test', async (req, res) => {
    
})


module.exports = router;