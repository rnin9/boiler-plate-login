const moongoose = require('mongoose');
const bcrpt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { json } = require('body-parser');

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
        maxlength: 60
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

userSchema.pre('save', function(next){ // 몽구스 기능. 
    var user = this;
        if(user.isModified('password')){ // 패스워드가 바뀔 때만, 암호화 진행 
            bcrpt.genSalt(saltRounds,function(err,salt){
               if(err) return next(err);
            
            bcrpt.hash(user.password, salt, function(err,hash){  // 비밀번호 암호화 시키기
                if(err) return next(err);
                user.password = hash;
                next();
            })
            }) 
        }else{       // 빠져나가게 만들어주기, 비밀번호 이외의 것이 들어온경우,
            next();
        }
   
})
 // mongoose method, 저장 전에, function을 진행 

userSchema.methods.comparePassword = function(plainPassword, cb){
    // plain password 1234, 암호화된 비밀번호.
    bcrpt.compare(plainPassword, this.password, function(err, isMatch){ //bcrpt 사용 
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.generateToken = function(cb){
    // json webtoken이용하여 token 생성.
    var user = this;
    var token = jwt.sign(user._id.toHexString(),'Token');
    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null,user);
       });
};

userSchema.static.findByToken = function(token,cb){
    var user = this;

    jwt.verify(token,'Token',function(err,decoded){

        //id를 이용해서 사용자를찾고,
       
        user.findOne({"_id": decoded, "token": token}, function(err,user){
            if(err) return cb(err);  //client token과 db token이 일치하는지 확인
            cb(null, user);
        })
    })
}
const User = moongoose.model('User',userSchema) // 이름과 shema

module.exports = {User}  // 다른 곳에서 쓸 수 있도록 한다.