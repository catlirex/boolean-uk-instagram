let activeUser = null
let currentChip = null;

function displayPreviewSection(){

    let createPostSection = document.querySelector(".create-post-section")
    let previewPostCard = document.createElement("div")
    previewPostCard.setAttribute("class","post")
    createPostSection.append(previewPostCard)

    if(activeUser !== null){
        previewPostCard.append(createUserChip(activeUser))
    }
    else{
        const dummyUser = {
            avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
            username: "Please Select User"
        }
        previewPostCard.append(createUserChip(dummyUser))
    }

    let previewImg = document.createElement("div")
    previewImg.setAttribute("class", "post--image loading-state")

    let previewContent = document.createElement("div")
    previewContent.setAttribute("class", "post--content")

    let previewH2 = document.createElement("h2")
    previewH2.setAttribute("class", "loading-state")
    let previewPara = document.createElement("p")
    previewPara.setAttribute("class", "loading-state")
    previewContent.append(previewH2, previewPara)

    previewPostCard.append(previewImg, previewContent)
}

function runPreview(previewPost){
    let previewImgContainer = document.querySelector(".post--image")
    previewImgContainer.classList.remove("loading-state");

    let previewImg = previewImgContainer.querySelector("img")
    if (previewImg === null){
     previewImg = document.createElement("img")
    }

    previewImg.setAttribute("src", previewPost.image)
    previewImg.setAttribute("alt", previewPost.title)
    previewImgContainer.append(previewImg)

    let previewContentContainer = document.querySelector(".post--content")
    let previewH2 =  previewContentContainer.querySelector("h2")
    previewH2.classList.remove("loading-state");
    previewH2.innerText = previewPost.title

    let previewPara =  previewContentContainer.querySelector("p")
    previewPara.classList.remove("loading-state");
    previewPara.innerText = previewPost.content

}

function createPostForm(createPostSection){
    postForm = document.createElement("form")
    postForm.setAttribute("id","create-post-form")
    postForm.setAttribute("autocomplete","off")
    postForm.addEventListener("submit", function(event){
        event.preventDefault()
        if (activeUser === null){
            alert("Please select user account from top bar before create new post")
        }
        else{
        const newPost = {
            title: postForm.title.value,
            content: postForm.content.value,
            image:{
                src: postForm.image.value,
                alt: postForm.title.value
            },
            likes:0,
            userId: activeUser.id
        }

        postNewPost(newPost)
        postForm.reset()
    }

    })

    let formH2 = document.createElement("h2")
    formH2.innerText = "Create a post"

    let imgLabel = document.createElement("label")
    imgLabel.setAttribute("for", "image")
    imgLabel.innerText = "Image"

    let imgInput = document.createElement("input")
    imgInput.setAttribute("id", "image")
    imgInput.setAttribute("name", "image")
    imgInput.setAttribute("type", "text")

    let titleLabel = document.createElement("label")
    titleLabel.setAttribute("for", "title")
    titleLabel.innerText = "Title"

    let titleInput = document.createElement("input")
    titleInput.setAttribute("id", "title")
    titleInput.setAttribute("name", "title")
    titleInput.setAttribute("type", "text")

    let contentLabel = document.createElement("label")
    contentLabel.setAttribute("for", "content")
    contentLabel.innerText = "Content"

    let contentInput = document.createElement("textarea")
    contentInput.setAttribute("id", "content")
    contentInput.setAttribute("name", "content")
    contentInput.setAttribute("rows", "2")

    let formBtnsContainer = document.createElement("div")
    formBtnsContainer.setAttribute("class", "action-btns")

    let previewBtn = document.createElement("button")
    previewBtn.setAttribute("id", "preview-btn")
    previewBtn.setAttribute("type", "button")
    previewBtn.innerText = "Preview"
    previewBtn.addEventListener("click", function(event){
        event.preventDefault()
        
        if (activeUser === null){
            alert("Please select user account from top bar before preview")
        }
        else{
            const previewPost = {
                title: postForm.title.value,
                content: postForm.content.value,
                image:postForm.image.value    
            }
            runPreview(previewPost)
        }
    })

    let submitBtn = document.createElement("button")
    submitBtn.setAttribute("type", "submit")
    submitBtn.innerText = "Post"

    formBtnsContainer.append(previewBtn, submitBtn)
    postForm.append(formH2, imgLabel, imgInput, titleLabel, titleInput, contentLabel, contentInput, formBtnsContainer)
    createPostSection.append(postForm)
}

function postNewPost(newPost){

        fetch(`http://localhost:3000/posts`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                title: newPost.title,
                content: newPost.content,
                image:{
                    src: newPost.image.src,
                    alt: newPost.image.alt
                },
                likes:0,
                userId: newPost.userId,
            })
        })
        .then(response => response.json())
        .then(function(NewPost){
            displayFeed(NewPost)
        })
        
} 

function displayHeaderUser (users){
    let headerWrapper = document.createElement("div")
    headerWrapper.setAttribute("class","wrapper")

    let mainHeader = document.querySelector(".main-header")

    mainHeader.append(headerWrapper)

    
    let chipEl = []
    
    for(user of users){
        chipEl = createUserChip(user)
        headerWrapper.append(chipEl)
    }
    
}

function createUserChip(user){
    let chip = document.createElement("div")
    
    chip.setAttribute("class","chip")

    chip.addEventListener("click", function(){

        if(currentChip !== null) currentChip.classList.remove("active")
        activeUser = user
        currentChip = chip
        chip.setAttribute("class", "chip active")
        // setTimeout(activeUpdate, 10)

        let previewPostCard = document.querySelector("div.post")
        previewPostCard.remove()
        displayPreviewSection()
        })

    let avatar = document.createElement("div")
    avatar.setAttribute("class","avatar-small")
    
    let userImg = document.createElement("img")
    userImg.setAttribute("src", user.avatar)
    userImg.setAttribute("alt", user.username)
    
    avatar.append(userImg)

    let userName = document.createElement("span")
    userName.innerText = user.username

    chip.append(avatar, userName)

    return chip
}

// function activeUpdate(){
//     let chipsArray = document.querySelectorAll(".chip")
//     for (chip of chipsArray){
//         if (chip !== currentChip) chip.setAttribute("class","chip")
//     }
// }

function displayFeedList(posts){

    let feedSection = document.createElement("section")
    feedSection.setAttribute("class","feed")

    let feedList = document.createElement("ul")
    feedList.setAttribute("class","stack")

    let main = document.querySelector("main")
    main.append(feedSection)
    feedSection.append(feedList)

    for(post of posts){
        displayFeed(post)
    }

}

function displayFeed(post){
    let userId = post.userId

    let postLi = document.createElement("li")
    postLi.setAttribute("class", "post")

    getSingleUser(userId)
        .then(function(user){
            let chip = createUserChip(user)
            postLi.prepend(chip)
        })

    let imgContainer = document.createElement("div")
    imgContainer.setAttribute("class","post--image")

    let postImg = document.createElement("img")
    postImg.setAttribute("src", post.image.src)
    postImg.setAttribute("alt",post.image.alt)
    imgContainer.append(postImg)
    
    let postContentContainer = document.createElement("div")
    postContentContainer.setAttribute("class","post--content")

    h2El = document.createElement("h2")
    h2El.innerText = post.title

    let para = document.createElement("p")
    para.innerText = post.content
    postContentContainer.append(h2El, para)

    let commentsContainer = document.createElement("div")
    commentsContainer.setAttribute("class", "post--comments")
    let h3El = document.createElement("h3")
    h3El.innerText = "Comments"
    commentsContainer.prepend(h3El)

    postLi.append(imgContainer, postContentContainer, insertLikeSection(post), commentsContainer)

    let commentsArray = post.comments
    if(commentsArray !== undefined){
        for(comment of post.comments){
            commentsContainer.append(displayComment(comment, commentsContainer))
            }
    
    }
    

    let feedList = document.querySelector(".stack")
    feedList.prepend(postLi)

    insertCommentForm(post)
    
}

function insertLikeSection(post){
    let likesSection = document.createElement("div")
    likesSection.setAttribute("class","likes-section")

    let numOfLike = document.createElement("span")
    numOfLike.setAttribute("class", "likes")
    numOfLike.innerText = post.likes

    let likeButton = document.createElement("button")
    likeButton.setAttribute("class", "like-button")
    likeButton.innerText = "???"
    likesSection.append(numOfLike, likeButton)
    likeButton.addEventListener('click', function(){
        post.likes ++
        fetch(`http://localhost:3000/posts/${post.id}`,{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                likes : post.likes
            })
        })
        .then(response => response.json())
        .then(function(json){
            numOfLike.innerText = json.likes
           
        })
        .catch((error) => {
            console.log(error)
            alert("There is something wrong.....")
          });

    })
    
    return likesSection
}

function insertCommentForm(post){
    let commentForm = document.createElement("form")
    commentForm.setAttribute("id", "create-comment-form")
    commentForm.setAttribute("autocomplete", "off")

    let inputLabel = document.createElement("label")
    inputLabel.setAttribute("for", "comment")
    inputLabel.innerText = "Add comment"

    let inputEl = document.createElement("input")
    inputEl.setAttribute("id", "comment")
    inputEl.setAttribute("name", "comment")
    inputEl.setAttribute("type", "text")

    let commentBtn = document.createElement("button")
    commentBtn.setAttribute("type","submit")
    commentBtn.innerText = "Comment"

    commentForm.append(inputLabel, inputEl, commentBtn)

    let commentsContainer = document.querySelector(".post div.post--comments")
    commentsContainer.append(commentForm)

    commentForm.addEventListener("submit", function(event){
        event.preventDefault()

        if (activeUser === null){
            alert("Please select user account from top bar before posting comment")
        }

        else{
            
            fetch(`http://localhost:3000/comments`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    content: commentForm.comment.value,
                    postId: post.id,
                    userId: activeUser.id
                })
            })
            .then(response => response.json())
            .then(function(NewComment){
                commentForm.before(displayComment(NewComment,commentsContainer))
            })
            commentForm.reset()
        }
        
        
    })
}

function displayComment(comment){
    
    let commentDiv = document.createElement("div")
    commentDiv.setAttribute("class", "post--comment")

    getSingleUser(comment.userId)
        .then(function(user){
            
            let avatar = document.createElement("div")
            avatar.setAttribute("class", "avatar-small")

            let userImg = document.createElement("img")
            userImg.setAttribute("src", user.avatar)
            userImg.setAttribute("alt", user.username)

            avatar.append(userImg)

            commentDiv.prepend(avatar)
        })
    
    para = document.createElement("p")
    para.innerText = comment.content
    commentDiv.append(para)

    return commentDiv
}

function getSingleUser(id){
    return fetch(`http://localhost:3000/users/${id}`)
        .then(function(response){
            return response.json()
        })
}

function getAllUsers(){
    return fetch("http://localhost:3000/users")
    .then(function(response){
        return response.json()
    })
    .catch((error) => {
        console.log(error)
        alert("There is something wrong.....")
    });

}

function getAllPosts(){
    return fetch("http://localhost:3000/posts")
    .then(function(response){
        return response.json()
    })
    .catch((error) => {
        console.log(error)
        alert("There is something wrong.....")
    });

}

function displayMain(){

    let root = document.querySelector("#root")
    
    let mainHeader = document.createElement("header")
    mainHeader.setAttribute("class", "main-header")

    let main = document.createElement("main")
    main.setAttribute("class", "wrapper")

    let createPostSection = document.createElement("section")
    createPostSection.setAttribute("class","create-post-section")
    
    root.append(mainHeader, main)
    main.append(createPostSection)

    createPostForm(createPostSection)
    displayPreviewSection()

    getAllUsers()
        .then(function(users){
            displayHeaderUser(users)
        })

    getAllPosts()
        .then(function(posts){
            displayFeedList(posts)
        })

        
}


displayMain()
