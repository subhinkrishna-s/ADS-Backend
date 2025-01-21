const CheckAdmin = (req, res, next) => {
    try{
        const user = req.session.user

        if(!user){
            return res.send({success: false, message: "Please Login and try again!"})
        }

        if(user && user.role === 'admin'){
            next();
        }else{
            return res.send({ success: false, message: 'You are not authorized to perform this action!'});
        }
    }
    catch(err){
        console.error('Error checking admin:', err);
        return res.send({ success: false, message: 'Trouble checking admin! Please contact admin.' });
    }
}

module.exports = CheckAdmin