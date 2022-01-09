require('dotenv').config()
const express=require('express')
const mongoose=require('mongoose')
const cookieParser=require('cookie-parser')
const cookie=require('cookie')
const User=require('./models/UserModel')
const Post= require('./models/PostModel')

const moment=require('moment')
var url=require('url')
//google Auth
const {OAuth2Client}=require('google-auth-library');
const client=new OAuth2Client(process.env.CLIENT_ID)
process.env.PWD = process.cwd()
const PORT=process.env.PORT || 8080
const UserRoute=require('./routes/user')
const AuthRoute=require('./routes/auth')
const PostRoute=require('./routes/posts')
const PhongbanRoute=require('./routes/phongban')
const HomeRoute=require('./routes/home')
const loginValidator = require('./routes/validator/loginValidatator-admin')
const MessageRoute=require('./routes/message')

const { validationResult } = require('express-validator')
const flash = require('express-flash')
const bcrypt=require('bcrypt')
const session = require('express-session')

const registerValidator = require('./routes/validator/registerValidator')


const axios = require("axios");
var ThongbaoDB = require("./models/ThongbaoModel");


const AccountSchema = require('./models/Account')
// var database;
const app=express()
app.set('view engine','ejs')


app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/users",UserRoute)
app.use("/api/auth",AuthRoute)
app.use("/api/posts",PostRoute)
app.use("/api/phongban",PhongbanRoute)
app.use("/home",HomeRoute)
app.use('/message',MessageRoute)



// app.use(express.static(__dirname + '/public'));
// app.use("/public", express.static(__dirname + "/public"));
// app.use(express.static('public'));
app.use(express.static(__dirname + '/routes'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/uploads'));
// app.use(express.static(process.env.PWD + '/public'));
// app.use(express.static(__dirname+  './uploads'));





app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'somesecret', 
    cookie: { maxAge: 60000 }
}));

app.use(flash());







{/* <link rel='stylesheet' href='/style.css' /> */}
app.get('/',(req,res)=>
{
    // database.collection('phongbans').find({}).toArray((err,result)=>
    // {
    //     if (err)throw err;
    //     res.send(result)
    // })
    
})
// app.get('/login',(req,res)=>
// {
//     const error=""
//     res.render('login',{error})
// })
app.get('/login',(req,res)=>
{
    // const err=req.params.err
    // var q =url.parse(req.url,true).query
    // var txt=q.err
    var error1=req.query.err
    // // console.log(error1)
    // // res.send(txt)
    // var error=''
    var error = req.flash('error') || ''
    const password = req.flash('password') || ''
    const username = req.flash('username') || ''
    if (error1==1)
    {
        error='Vui lòng sử dụng tài khoản email sinh viên để truy cập Website.'
        // console.log(error)
        return res.render('login',{error, password, username})
    }
    else 
    {
    //     // console.log(error)
    //     error=''
    
        return res.render('login', {error, password, username})


    }

    if(req.session.user){

        return res.redirect('/home/thongbao')
    }


})
app.post('/login', loginValidator,  (req, res) => {
    let result = validationResult(req)
    console.log(result)
    let acc = req.body
    if (result.errors.length === 0 ){
        const {username, password} = req.body
         AccountSchema.findOne({username: username})
        .then(acc => {
            if (!acc) {
                req.flash('error', 'Tài khoản không tồn tại')
                req.flash('password', password)
                req.flash('username', username)
                return res.redirect('/login')
            }
            account = acc
             return bcrypt.compare(password, acc.password)
        })
        .then(async(passwordMatch) => {
            if(!passwordMatch){
                req.flash('error', 'Sai username hoặc mật khẩu')
                req.flash('password', password)
                req.flash('username', username)
                return res.redirect('/login')
            }
                req.session.user = acc.username;
               
                res.cookie('user','1')
                const user=await AccountSchema.find({username: acc.username})
                req.user=user
                
                return res.redirect('/home/thongbao')

            
        })
    }
    else{
        result = result.mapped()
        let message
        for (m in result) {
            message = result[m].msg
            break
        }
        const{username, password} = req.body
    
        req.flash('error', message)
        req.flash('username', username)
        req.flash('password', password)
        res.redirect('/login')

    }
    
})



app.get('/home/register', (req, res) => {
    if(!req.session.user){
        return res.redirect('/login')
    }
    var auth =req.cookies['user']
    const error = req.flash('error') || ''
    const password = req.flash('password') || ''
    const username = req.flash('username') || ''
    const role = req.flash('role') || ''
    const role_post = req.flash('role_post') || ''
    res.render('register', {error, password, username, role, role_post,auth})
})



 
app.post('/home/register', registerValidator, (req, res) => {
    let result = validationResult(req)
    if(!req.session.user){
        return res.redirect('/login')
    }
    if(result.errors.length === 0 ){

        const {username, password, role, role_post} = req.body
        AccountSchema.findOne({username: username})
        .then(acc => {
            if (acc) {
                req.flash('error', 'Tài khoản này đã tồn tại (trùng username)')
                req.flash('password', password)
                req.flash('username', username)
                req.flash('role', role)
                req.flash('role_post', role_post)
                return res.redirect('/home/register')
            }
        })
        let hashed = bcrypt.hash(password, 10)
        .then(hashed =>{

            let user = new AccountSchema({
                username: username,
                password: hashed,
                role: role,
                role_post: role_post
                
            })
            return user.save().then(() => {
                req.flash('error', 'Đăng kí thành công')
                req.flash('password', password)
                req.flash('username', username)
                req.flash('role', role)
                req.flash('role_post', role_post)
                return res.redirect('/home/register')
            })

        })
    }
    else{
        result = result.mapped()
        let message
        for (m in result) {
            message = result[m].msg
            break
        }
        const{username, password,role,role_post} = req.body
    
        req.flash('error', message)
        req.flash('username', username)
        req.flash('password', password)
        req.flash('role', role)
        req.flash('role_post', role_post)
        res.redirect('/home/register')
    }

   
    
})





app.post('/login/google',(req,res)=>
{
    let token=req.body.token
    let user={}
    
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // console.log(payload) 
        user.email=payload.email
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
      }
      verify()
      .then(()=>{
            // const user= await new User({password:'123'});
            // const id=user._id
            // await user.save()
            if (user.email.includes("@student.tdtu.edu.vn"))
            {
                res.cookie('session-token',token)
                res.send('success')
            }
            else
            {
                // res.status("error")
                // console.log("error")
                res.send('Fail')
            }
            // res.cookie('session-secret',id)

      })
      .catch(console.error);
    // console.log(token);
})
app.get('/home/message', async  (req,res)=>
{
    try 
    {
        if(!req.session.user){
            return res.redirect('/login')
        }
        var auth =req.cookies['user']
        let user=req.user;
        const postTimeline=await Post.find({}).sort({createdAt: -1})
        res.render('trangchu',{postTimeline,user,auth})
    }
    catch(err)
    {
    res.status(400).json(err)

    }   
})
app.get('/home/index', async  (req,res)=>
{
    // if(!req.session.user){
    //     return res.redirect('/login')
    // }
    try 
    {
        var auth =req.cookies['user']
        if (req.cookies['user']==='0')
        {
            let user=req.user;
            checkAuthenticated()
            const postTimeline=await Post.find({}).sort({createdAt: -1})
            res.render('trangchu',{postTimeline,user,auth})
        }
        else 
        {
            let user=req.user;
            const postTimeline=await Post.find({}).sort({createdAt: -1})
            res.render('trangchu',{postTimeline,user,auth})
        }
      

    }
    catch(err)
    {
    res.status(400).json(err)

    }   
})

app.get('/chitietthongbao/:id',async (req,res)=>
{
    if(!req.session.user){
        return res.redirect('/login')
    }
    var id=req.params.id
    var auth =req.cookies['user']

    // console.log(id);
    let id1=req.cookies['session-secret']
    // const user = await User.findById(id1)
    const thongbaos=await ThongbaoDB.findById(id)
    console.log(thongbaos)
    res.render('chitietthongbao',{thongbaos,auth})
  

})
// app.get('/chitietthobgbao',(req,res)=>
// {
//     const thongbaos={}
//     res.render('chitietthongbao',{thongbaos})
// })
app.get('/home/thongbao', async (req,res)=>
{
    if(!req.session.user){
        return res.redirect('/login')
    }
    try 
    {
        // let user=req.user;
        let id=req.cookies['session-secret']
        // const user = await User.findById(id)
        var auth =req.cookies['user']
        const thongbaos=await ThongbaoDB.find({})
        res.render('thongbao',{thongbaos,auth})
    }
    catch(err)
    {
    res.status(400).json(err)

    }   
})
// app.get('/')
app.get('/home/dangthongbao',async (req,res)=>
{
    if(!req.session.user){
        return res.redirect('/login')
    }
    var id =req.cookies['session-secret']
    var auth =req.cookies['user']

    // const user =await User.findById(id)
    res.render('dangthongbao',{auth})
})


app.post('/home/dangthongbao',async (req,res)=>
{
    // var id =req.cookies['session-secret']
    if(!req.session.user){
        return res.redirect('/login')
    }
    var auth =req.cookies['user']
    // const user =await AccountSchema.findById(id)
    let thongbaodb = new ThongbaoDB({
        title: req.body.title,
        text: req.body.text,
        user: req.body.name,
        createdAt: moment().format("DD/MM/YYYY HH:mm")

    })
    thongbaodb
        .save(thongbaodb)
        .then(data => {
            res.render('thongbao',{auth})
        })
    
})
// app.get('/home/thongbao/chitietthongbao/:id', async (req,res)=>
//     {))

app.get('/test',checkAuthenticated,(req,res)=>
{
    let user=req.user;
    res.render('test',{user})
})



app.get('/home/thongbaokhoa',(req,res)=>
{
    res.render('thongbaokhoa')
})


app.get('/trangchu',(req,res)=>
{
    res.render('trangchu')
})
app.get('/logout',(req,res)=>
{
    res.clearCookie('session-token')
    res.clearCookie('user')
    res.redirect('login')
})
function checkAuthenticated(req,res,next)
{
    let token=req.cookies['session-token']

    let user = {};

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        // const userid = payload['sub'];
        // console.log(payload)
        const findAccount=await User.findOne({email: payload.email})

        if(!findAccount)
        {
            const Account= await new User({name:payload.name,email: payload.email, avatar: payload.picture, username: payload.email,posts: []})
            await Account.save();
        }
        // console.log('Tài khoản đã tồn tại!!!')

        // user.name=payload.name;
        user.email=payload.email;
        // user.picture=payload.picture;
        
       
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
        // const id_session=user._id;
      }
      verify()
      .then(async ()=>{
        const userAccount=await User.findOne({email: user.email})
            res.cookie('session-secret',userAccount._id.toString())
            res.cookie('user','0')
            // res.send('success')
            // user.id=userAccount._id.toString();
            req.user=userAccount;
            req.session.user = userAccount.email;

            next();
      })
      .catch(err=>
      {
          console.log(err)
          res.redirect('/login')
      });
    
}

app.listen(PORT,()=> {
    console.log('http://localhost:'+PORT)
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true,useUnifiedTopology: true}).then(()=>
    console.log('Connected to MongoDB')
)})