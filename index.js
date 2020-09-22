//시작점임.

const express = require('express')
const app = express()
const port = 5000
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const {User} = require("./models/User");
const config = require("./config/key");
const auth = require('./middleware/auth');

// appication/x-www-form-urlencoded 부분 분석 해서 가져옴
app.use(bodyparser.urlencoded({extended: true}));
// application/json 부분 분석해서 가져옴
app.use(bodyparser.json());
app.use(cookieparser());
const mongoose = require('mongoose')


mongoose.connect(config.mongoURI,{
    useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(()=> console.log('MongoDB connected...'))
    .catch(err=>console.log(err))


app.get('/',(req,res) => res.send('Hello world! & siwon'))

app.post('/register',(req, res)=>{
    //회원가입시 필요한 정보들을 client에서 가져오면,
    // 그것들을 DB에 넣어준다. 
    const user = new User(req.body) // body 안에는 json 형식으로 데이터가 들어있음.
    
    user.save((err, userInfo) =>{
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success:true
        })
    }) // 몽고 db 메소드
})

app.post('/login',(req,res)=>{
   
    User.findOne({email: req.body.email},(err,user)=>{
        if(!user){
         return res.json({
             loginSuccess: false,   
             message:"해당하는 이메일을가진 User가 없습니다."    // 요청된 이메일이 db에 존재하는지 찾기 
         })   
        }
        
        
    user.comparePassword(req.body.password, (err,isMatch)=>{
        if(!isMatch){
            return res.json({
                loginSuccess:false,
                message:"비밀번호가 다릅니다."  //이메일이 있으면, 비밀번호가 같은지 확인.
            })
        }
        user.generateToken((err, user)=>{
            if(err) return res.status(400).send(err);

            res.cookie("x_auth",user.token)
            .status(200)
            .json({ loginSuccess : true , userId:user._id});
            //토큰을 저장한다. 어디에?  쿠키 or local storage or 세션
        })  
    })
    })

    //비밀번호까지 맞으면, token을 생성함.
})

app.get('api/user/auth', auth, (req,res)=>{     //여길 통과했다는것은, 인증을 완료했다는 뜻.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role=== 0? true : false,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    });
})


app.listen(port, ()=> console.log(`Example app listening on port ${port}!`));