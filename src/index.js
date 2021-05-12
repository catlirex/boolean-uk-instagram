let root = document.querySelector("#root")

let mainHeader = document.createElement("header")
mainHeader.setAttribute("class", "main-header")

let main = document.createElement("main")
main.setAttribute("class", "wrapper")

root.append(mainHeader, main)


function displayHeaderUser (users){
    let headerWrapper = document.createElement("div")
    headerWrapper.setAttribute("class","wrapper")
    mainHeader.append(headerWrapper)

    let currentChip = null;
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
        currentChip = chip
        console.log(currentChip)
        chip.setAttribute("class", "chip active")

        setTimeout(activeUpdate, 10)
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

function activeUpdate(){
    let chipsArray = document.querySelectorAll(".chip")
    for (chip of chipsArray){
        if (chip !== currentChip) chip.setAttribute("class","chip")
    }
 }


function displayMain(){
    fetch("http://localhost:3000/users")
        .then(function(response){
            return response.json()
        })
        .then(function(users){
            displayHeaderUser(users)
        })
        .catch((error) => {
            console.log(error)
            alert("There is something wrong.....")
        });

}

displayMain()


