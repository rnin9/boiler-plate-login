const moongoose = require('mongoose');

const userSchema = moongoose.Schema({
    name:{
        type: String,
        maxlength: 50
    },
    email:{
        type: String,
        trim: true, // space를 없애줌
        unique: 1
    },
    password:{
        type: String,
        maxlength: 50
    },
    role:{
        type: Number, // number 1이면 관리자, 2면 고객 등등...
        default: 0
    },
    image: String,
    token:{          // 유효성 관리
        type: String
    },
    tokenExp:{      // 토큰 사용 가능기간 
        type: Number
    }
})

const User = moongoose.model('User',userSchema) // 이름과 shema

module.exports = {User}  // 다른 곳에서 쓸 수 있도록 한다.