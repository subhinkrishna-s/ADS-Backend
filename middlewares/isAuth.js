const checkSession = (req, res, next) => {
    try{
        if (req.session && req.session.user) {
            return next();
        }
        return res.send({ success: false, message: 'Unauthorized! Please log in and try again.' });
    }
    catch(err){
        return res.send({ success: false, message: 'Unauthorized! Please contact support Team.' });
    }
};

module.exports = checkSession;
