//시작점임.

const express = require('express')
const app = express()
const port = 5000
const bodyparser = require('body-parser');
const {User} = require("./models/User");
const config = require("./config/key");

// appication/x-www-form-urlencoded 부분 분석 해서 가져옴
app.use(bodyparser.urlencoded({extended: true}));
// application/json 부분 분석해서 가져옴
app.use(bodyparser.json());

const mongoose = require('mongoose')


mongoose.connect(config.mongoURI,{
    useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(()=> console.log('MongoDB connected...'))
    .catch(err=>console.log(err))


app.get('/',(req,res) => res.send('Hello world!'))

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


app.listen(port, ()=> console.log(`Example app listening on port ${port}!`));