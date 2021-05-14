const { MAIL_SENDER, API_KEY_MAIL } = require('../../config/config.json')

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(API_KEY_MAIL);

module.exports = {
    send: ({ recipient, subject, content, attachments }) => {
        const msg = {
            from: MAIL_SENDER,
            to: recipient,
            subject,
            text: content,
            attachments: attachments ? attachments: []
        }
        //console.log(msg)
        return sgMail.send(msg).then(info => {
            // console.log({ log: "Email sent", info })
            return info
        }).catch(error => {
            console.error(error['response']['body']['errors'])
            throw Error("Le serveur n'a pas pu envoyer le mail")
        })
    },
}
