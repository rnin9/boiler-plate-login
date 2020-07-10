const moongoose = require('mongoose');
const bcrpt = require('bcrypt');
const saltRounds = 10;

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

userSchema.pre('save', function(next){
    var user = this;
    bcrpt.genSalt(saltRounds,function(err,salt){
        if(user.isModified('password')){ // 패스워드가 바뀔 때만, 암호화 진행 
        
            bcrpt.hash(user.password, salt, function(err,hash){
                if(err) return next(err);
                user.password = hash;
                next();
            })
        }
    })
    // 비밀번호 암호화 시키기


})
 // mongoose method, 저장 전에, function을 진행 

const User = moongoose.model('User',userSchema) // 이름과 shema

module.exports = {User}  // 다른 곳에서 쓸 수 있도록 한다.