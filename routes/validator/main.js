// var FormData = require('form-data');
// import { FormData } from './module.js';

window.addEventListener('load', () => {
    // console.log('Window load')
    $(document).ready(function () {
        var $j = jQuery.noConflict();
        // $j("#datepicker").datepicker();
        $j(".datepicker").datepicker({
            prevText: '<i class="fa fa-fw fa-angle-left"></i>',
            nextText: '<i class="fa fa-fw fa-angle-right"></i>'
        });

        
    });


        $('.trangchu-nav-categoryMessage').click(function () {
            $('nav .trangchu-nav-listMessage').toggleClass("show");
            $('.trangchu-nav-categoryMessage').toggleClass("clicked");
            $('.trangchu-nav-sidebarList .first').toggleClass("rotate");
        })

        $('.trangchu-nav-infoMessage').click(function () {
            $('nav .trangchu-nav-info_Message').toggleClass("show");
            $('.trangchu-nav-sidebarList .second').toggleClass("rotate");
            $('.trangchu-nav-infoMessage').toggleClass("clicked");
        })

        $('.donvi').click(function () {
            $('nav .trangchu-nav-listMessage .donviList').toggleClass('show');
            $('.donvi').toggleClass("clicked");
            $('.trangchu-nav-listMessage .first-donvi').toggleClass('rotate');
        })

        $('.khoa').click(function () {
            $('nav .khoaList').toggleClass("show");
            $('nav .third').toggleClass("rotate");
            $('.khoa').toggleClass('clicked');

        })

        $('.phongban').click(function () {
            $('nav .phongban').toggleClass("show");
            $('nav .fourth').toggleClass("rotate");
            $('.phongban').toggleClass('clicked');

        })
        $('.Chude').click(function () {
            $('nav .chudeShow').toggleClass("show");
            $('nav .second-chude').toggleClass("rotate");
            $('.Chude').toggleClass('clicked');

        })

        $('.trangchu-header-nameProfile').click(function () {
            $('.right_area').toggleClass('show');
            $('.trangchu-header-nameProfile').toggleClass('clicked')
        })

        $('.postSetting').click(function() {

            var idPost = $(this).data('id');
            $('.textSetting#'+idPost).toggleClass('show');

        })
    
    $(() => {
        const $form = $('#formCreate')
        // console.log($form.image)
        $form.on('submit', handleCreatePost)

        function loadPost(e) {

            let timeCreate = e.data.createdAt;
            // let timeCreate ='';
            
            let desc=e.data.description;
            let avatar=e.data.user.avatar;
            let name=e.data.user.name
            let image=e.data.thumbnail
            // let desc='';

            // console.log(desc)

            let post = `<div class="trangchu-newFeed-container">
            <div class="trangchu-newFeed">
                
                <div class="trangchu-status">

                    <div class="trangchu-nav-headerPost">

                                <div class="postTopLeft">
                                    <img class="img_userPost" src="`+avatar+`" alt="">

                                        <span class="name_userPost">`+name+`</span>

                                        <span class="postDate">`+ timeCreate + `</span>

                                   <span class="postSetting"><i class="fas fa-ellipsis-h"></i></span>
                                </div>

                                <div class="textSetting">
                                    
                                        <ul>
                                            <a href="#">
                                                <li><i class="fa fa-user" aria-hidden="true"></i>Lưu bài viết</li>
                                            </a>
                                            <a href="#">
                                                <li><i class="fa fa-users" aria-hidden="true"></i>Chỉnh sửa bài viết</li>
                                            </a>
                                            <a href="#">
                                                <li><i class="fa fa-inbox" aria-hidden="true"></i>Xóa bài viết</li>
                                            </a>
                                          
                                       </ul>

                
                                   
                                </div>
                    </div>

                    <div class="trangchu-nav-contentPost">
                        
                        <div class="postText">
                            `+ desc + `
                        </div>

                        <div class="postText">

        

                        <img src="`+image+`" alt="">

                
                        </div>

                    </div>

                    <hr class="shareHr">


                    <div class="trangchu-nav-commentPost">

                            <img src="/picture.jpg" class="img-user-comment" alt="">

                        
                            <div class="content-comment">
                                <a href="" class="name-comment-Post">Nguyen Hau </a>
                                <div>Ai đó giúp mình đi, có xe không chạy thì nó kì quá :)))</div>
                            </div>
                    </div>

                    <div class="trangchu-nav-userComment">

                        <a href="">
                            <span class="trangchu-comment-post">
                                <img src="/profile.jpg" alt="">
                            </span>
                        </a>

                        <input type="text" class="content-userComment" size='60'
                            placeholder="What's on your mind, Nguyen?">
                    </div>

                </div>

            </div>
        </div>`

            $('.timeline').before(post)
            $('#description').val('')
            $('#image_file').val('')
            // timeline.append(post)


            // console.log(e)
            // let xhr=new XMLHttpRequest();
            // xhr.addEventListener('load',e=>
            // {

            //     let json=xhr.response;
            //     console.log(json);
            // })
            // xhr.open('GET','http://localhost:9090/api/posts',true);
            // xhr.responseType='json';
            // xhr.send();
            // const options1 = {
            //     type: 'GET',
            //     url: 'http://localhost:9090/api/posts',
            //     data: {e},
            //     }

            //     $.ajax(options1).done(response => {
            //     console.log(response)
            //     // console.log(typeof(response))
            //     // loadPost(response);
            //     })
            // $.ajax({
            //     url: "http://localhost:9090/home/index",
            //     type: "get", //send it through get method
            //     data: e,
            //     success: function(response) {
            //       //Do Something
            //       console.log(response)
            //     },
            //     error: function(xhr) {
            //       //Do Something to handle error
            //     }
            //   });
        }

        function handleCreatePost(e) {
            e.preventDefault()
            // let userId = document.getElementById('imgProfile').getAttribute('data-id')
            // // var input = $("<input>")
            // //     .attr("type", "hidden")
            // //     .attr("name", "userID").val(userId);

            
            let file = document.getElementById("image_file").files[0];

            // if (file){
            //     console.log(file.name);
            //   }
              console.log(document.forms['formCreate'].elements['description'].value)
              console.log(document.forms['formCreate'].elements['id'].value)
              var description=document.forms['formCreate'].elements['description'].value
              var id=document.forms['formCreate'].elements['id'].value
            // $form.append('image',file)
            // const options = {
            //     method: $form.attr('method'),
            //     url: $form.attr('action'),
            //     data: $form.serialize(),
            //     // enctype: 'multipart/form-data', 
            // }
            // console.log(options);
            // $.ajax(options).done(response => {
            //     // loadPost(response);
            // })

            var form = new FormData();
            form.set('image',file)
            form.set('description',description)
            form.set('id',id)
            let xhr=new XMLHttpRequest();
            xhr.open('POST','http://localhost:9090/api/posts',true)
            xhr.addEventListener('load',e=>
            {
                // console.log(xhr.responseText)
                const json=JSON.parse(xhr.responseText)
                const id =json.data._id
                console.log(json.data._id)
                // console.log(e)
                loadPost(json);
                var form1 = new FormData();

                let xhr1=new XMLHttpRequest();
                xhr1.open('POST','http://localhost:9090/api/posts/update/'+id,true)
                xhr1.addEventListener('load',e=>{
                    console.log(xhr.responseText)

                })
                xhr1.send(form1)
                // $('#formCreate').unbind('submit').submit();
            })
            xhr.send(form)
        }

        function handleDeletePost(idPost)
        {
            const options={
                method: "DELETE",
                url: "/api/posts/"+idPost,
                // data: idUserPost,
            }
            $.ajax(options).done(response => {
                // loadPost(response);
                // console.log(response.post);
            })
        }

        $('.deletePost').click(function(e)
        {
            e.preventDefault();
            var idPost = $(this).data('id');
            var idUserPost=$(this).data('user')
            $('.trangchu-newFeed-container.'+idPost).remove();
            handleDeletePost(idPost,idUserPost)
        })
    })


}
)

function countChar(val) {
    val.style.height = "10px";
    val.style.height = (25 + val.scrollHeight) + "px";
};
// function showSettingPost($this)
// {
//     $(this).toggleClass('show');

// }
function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/login/google');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        console.log('Signed in as: ' + xhr.responseText);
        if (xhr.responseText==='success')
        {
            signOut();
            // console.log(xhr.user)
            location.assign('/home/index')
        }
        if (xhr.responseText==='Fail') 
        {
            signOut();
            location.assign('/login/?err=1')

        }
    };
    xhr.send(JSON.stringify({token: id_token}));
}
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}