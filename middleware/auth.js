const {User} = require('../models/User');

let auth = (req,res,next)=>{
    //인증처리

    //client쿠키에서, token을 가져온다.
    let token = req.cookies.x_auth;
    //token을 복호화 한 뒤, 사용자를 찾는다
    User.findByToken(token,(err, user)=>{

        if(err) throw err;
        if(!user) return res.json({ isAuth: false, err: true}) //user 없으면, json으로 오류 전달
        
    });
    //사용자가 있으면 ok,


    //없으면 인증 x
}


module.exports = {auth};