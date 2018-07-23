M.AutoInit()

const signInButton = document.querySelector('#sign-in-button')
const signOutButton = document.querySelector('#sign-out-button')
const authDropdownItem = document.querySelector('#auth-dropdown-button')
const contactList = document.querySelector('#contact-list')
const conversationList = document.querySelector('#conversation-content')

function updateUIforSignIn(avatarSrc){
  authDropdownItem.innerHTML = `<i><img class="avatar-image" src="${avatarSrc}" /></i>`
}

function updateUIforSignOut(){
  authDropdownItem.innerHTML = `<i class="material-icons">more_vert</i>`
  contactList.innerHTML = ''
}

function shortenLeadingTextMessage(text){
  if (!text) return 'This is a fake text...'
  
  if (text.length > 50) {
    return text.substring(0, 47) + '...'
  }
  return text
}

function updateUIwithNewContact(userInfo){
  contactList.innerHTML += 
  `
    <li onclick="displayTextsFrom('${userInfo.id}')" class="contact-item avatar">
        <img src="${userInfo.url}" alt="user avatar" class="circle avatar-image">
        <div class="contact-name-and-text">
          <h6 class="title">${userInfo.name}</h6>
          <p class="gray-text first-text-message">${shortenLeadingTextMessage(userInfo.text)}</p>      
        </div>
        <div class="contact-timestamp">
          <p class="grey-text">3:33 pm</p>
        </div>
    </li>
  `
}

function updateUIwithTextData(data, recipientPhotoUrl){
  let finalHTML = ''
  if (recipientPhotoUrl){
    finalHTML = 
    `
    <li class="text-message-item left-aligned-text ">
      <img src="${recipientPhotoUrl}" alt="user avatar" class="circle avatar-image">
      <div class="text-message-content orange darken-3">
        <p class="white-text">${data.text}</p>
      </div>
    </li>      
    `
  } else {
    finalHTML =
    `
    <li class="text-message-item right-aligned-text">
      <div class="text-message-content white">
        <p class="black-text">${data.text}</p>
      </div>
    </li>      
    `    
  }
  
  conversationList.innerHTML += finalHTML
}

signInButton.addEventListener('click', e => {
  signInWithGoogle()
})

signOutButton.addEventListener('click', e => {
  signUserOut()
})
