
const express=require('express')
const Router=express()
const multer=require('multer')
const  moment=require('moment')
const Post= require('../models/PostModel')
const User=require('../models/UserModel')
// const upload=multer({fileFilter: (req,file,callback)=>{

//     // console.log(file)
//     if (file.mimetype.startsWith('image/'))
//     {
//         callback(null,'uploads')
//     }
//     else 
//     {
//         callback(null,false)
//     }

//     // callback(null,true)
// },limits:{fileSize:500000}})
// // const a=require('')
const postController=require('../controller/postController')
const { contextsKey } = require('express-validator/src/base')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //files khi upload xong sẽ nằm trong thư mục "uploads" này - các bạn có thể tự định nghĩa thư mục này
      cb(null, './public/uploads') 
    },
    filename: function (req, file, cb) {
      // tạo tên file = thời gian hiện tại nối với số ngẫu nhiên => tên file chắc chắn không bị trùng
      const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) 
      cb(null, filename + '-' + file.originalname )
    }
  })
//Khởi tạo middleware với cấu hình trên, lưu trên local của server khi dùng multer
const upload = multer({ storage: storage })

Router.use(express.urlencoded({extended: true}))
Router.get("/",postController.post_index)
//create post 
Router.post("/",async (req,res)=>
{
    const id=req.cookies['session-secret']
    const idPost=[]
    const user=await User.findById(id)
    let uploader= upload.single('image')
     uploader(req,res,err=>{
        let image =req.file
        let post=req.body

        // console.log(image.path)
        // console.log(id)
        // console.log(post)
        if (!image)
        {
            const newPost=new Post({description:post.description,user:{name:user.name,avatar:user.avatar,role:"Sinh viên"},thumbnail:'',video:'',createdAt:moment().format('lll'),comments:[] })
            newPost.save();
            res.send({'data':newPost})
        }
        else if (err)
        {
            res.end(err)    
        }
        else
        {
            let path=image.path;

            
            const newPost=new Post({description:post.description,user:{name:user.name,avatar:user.avatar,role:"Sinh viên"},thumbnail:path.slice(14),video:'',createdAt:moment().format('lll'),comments:[] })
            newPost.save();
            //  user.updateOne({$push:{posts: newPost}})
            res.send({'data':newPost})
        }

    })

   
    
})
//update post User 
Router.post("/update/:id",async (req,res)=>
{
    var idPost=req.params.id
    const idUser=req.cookies['session-secret']
    const newPost=await Post.findById(idPost)
    const user=await User.findById(idUser)
    await user.updateOne({$push:{posts: newPost}})
    res.send('successful')
})


//update post
Router.put("/:id",postController.update_post)
//delete post
Router.delete("/:id",postController.delete_post)
//like and dislike post
Router.put("/:id/like",postController.like_post)
//get post 
Router.get("/:id",postController.get_post)
// get timeline post 
Router.get("/timeline/all",postController.post_timeline)
module.exports=Router
