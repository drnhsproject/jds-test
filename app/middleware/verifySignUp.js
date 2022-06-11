const db = require('../models');
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsername = async (req, res, next) => {
    try {
        //check username
        let user = await User.findOne({
            where: {
                username: req.body.username
            }
        });

        if(user){
            return res.status(400).send({
                message: "Change other username"
            });
        }
        next();
    } catch (error) {
        return res.status(500).send({
            message: "Unable to validate Username"
        });
    }
};

checkRolesExisted = (req, res, next) => {
    if(req.body.roles) {
        for(let i = 0; i < req.body.roles.length; i++) {
            if(!ROLES.includes(req.body.roles[i])) {
                res.status(404).send({
                    message: `Role dosn't exixt = ${req.body.roles[i]}`
                });
                return;
            }
        }
    }

    next();
};

const verifySignUp = {
    checkDuplicateUsername,
    checkRolesExisted
};

module.exports = verifySignUp;