const router = require('express').Router();
const auth = require('../controllers/auth');
const { postAddMessage, postUpdateMessage, deleteMessage, getMessagesSR, getLastMessagebyUser, getAllMessage} = require('../controllers/message');

//get the chat application Page
router.get('/message', auth.secureLog, (req, res)=>{
    console.log(req.session.user);
    res.render('message/index', {
        title: "Messages",
        smmc: "Société de Manutention des Marchandises Conventionnelles",
        url: '/pieces',
        user: req.session.user
    })
});

router.route('/new_message').post(postAddMessage);

router.route('/getLastMessagebyUser').post(getLastMessagebyUser);

router.route('/get_messageSR').post(getMessagesSR);

router.route('/update_message').post(postUpdateMessage);

router.route('/delete_message').post(deleteMessage);

router.route('/messages').post(getAllMessage);

module.exports= router;