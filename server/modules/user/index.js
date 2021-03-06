const passport = require('passport');
const LocalStrategy = require('passport-local');
const config = require('../../config/config.json');
const axios = require('axios')
const { User } = require('./schemas/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const emailModule = require('../mail')

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (username, password, done) => {
    _matchUserCreds(username, password)
        .then((user) => done(null, user))
        .catch(err => {
            done(null, { error: err })
        })
}
))

const _validateEmailUnique = (email) => {
    const res = new Promise((resolve, reject) => {
        User.findOne({ email: email })
            .then(user => {
                if (user === null)
                    resolve();
                reject('Email already in use')
            })
            .catch(err => {
                console.log(err);
                reject(err)
            })
    }).catch(err => {
        throw(err);
    })
    return res;
}


const _validateUsernameUnique = (username) => {
    return new Promise((resolve, reject) => {
        User.findOne({ username: username })
            .then(user => {
                if (user === null)
                    resolve();
                reject(new Error('Username already in use'))
            })
            .catch(err => {
                reject(err)
            })
    })
}

const _matchUserCreds = (email, password) => {
    const errorMessage = 'Credentials do not match.';
    let user = null;
    return new Promise((resolve, reject) => {
        User.findOne({ email: email })
            .then(data => {
                if (data === null)
                    reject(new Error(errorMessage));
                user = data;
                return bcrypt.compare(password, data.password)
            })
            .then(res => {
                if (res === false)
                    reject(new Error(errorMessage))
                resolve(user)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

const registerMail = (id, email) => ({
    recipient: email,
    subject: 'Compte cr??er',
    content: 'Bienvenue sur \n\n'
        + 'veuillez confirmez votre adresse mail en cliquant sur ce lien:\n'
        + `http://localhost:3000/mail/confirm-email?id=${id}`
})

const userModule = {
    register: (userData) => {
        return new Promise((resolve, reject) => {
            _validateEmailUnique(userData.email)
            // .then(_validateUsernameUnique(userData.username))
                .then(() => {
                    const newUser = new User({
                        email: userData.email,
                        password: userData.password,
                        username: userData.username
                    })
                    //console.log("2-User password: " + userData.password)
                    return newUser.save()
                })
                .then(user => {
                    let copy = JSON.parse(JSON.stringify(user))
                    delete copy.password
                    emailModule.send(registerMail(user._id, user.email))
                        .then(resolve(["Account registered", copy]))
                        .catch(error => error)
                    resolve(["Account registered", copy])
                })
                .catch(err => {
                    reject(err)
                })
        })
    },

    recupPassword: async (email) => {
        const user = await User.findOne({ email: email })

        if (user === null)
            throw Error('User does not exist')

        const password = crypto.randomBytes(6).toString('hex')

        //await User.updateOne({ _id: user._id }, { password: await hashPassword(password) })

        return emailModule.send({
            recipient: user.email,
            subject: 'R??initialisation de mot de passe',
            content: 'Vous recevez ce mail car vous (ou quelqu\'un d\'autre) avez demander la r??initialisation du mot de passe de votre compte.\n\n'
                + 'Votre nouveau mot de passe est le suivant ci-dessous\n\t\t'
                + password
        })
            .then(info => ["email de recuperation envoy??"])
            .catch(error => error)
    },
}

module.exports = userModule;
