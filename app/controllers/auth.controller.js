const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generator = require("generate-password");

exports.signup = async (req, res) => {
    //save user to database
    try {
        const password = generator.generate({
            length: 6,
            numbers: true
        });
        const user = await User.create(
            {
            username: req.body.username,
            password: bcrypt.hashSync(password, 6),
            }
        );
        if(req.body.roles) {
            const roles = await Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles,
                    },
                },
            });
            const result = user.setRoles(roles);
            if(result) res.send({
                message: "User registered",
                data:{
                    username: req.body.username,
                    password: password
                }
            });
        }else {
            //user has role = 1
            const result = user.setRoles([1]);
            if(result) res.send({
                message: "User Registered"
            });
        };
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    };
};

exports.signin = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username,
            },
        });
        if(!user) {
            return res.status(404).send({
                message: "Invalid password"
            });
        };

        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        if(!passwordIsValid) {
            return res.status(401).send({
                message: "Invalid password"
            });
        };

        const token = jwt.sign
        (
            {id: user.id},
            config.secret,
            {expiresIn: 86400,} //24jam
        );

        let authorities = [];
        const roles = await user.getRoles();
        for (let i = 0; i < roles.length; i++) {
            authorities.push(`MyRole = ${roles[i].name.toLowerCase()}`);            
        };

        req.session.token = token;
        return res.status(200).send({
            id: user.id,
            username: user.username,
            token: token,
            role: authorities,
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    };
};

exports.signout =  async (req, res) => {
    try {
        req.session = null;
        return res.status(200).send({
            message: "You've been signed out"
        });
    } catch (error) {
        this.next(error);        
    };
};