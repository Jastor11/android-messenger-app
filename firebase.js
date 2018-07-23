// here we create a connection to our database
const database = firebase.firestore()
const auth = firebase.auth()

  // const firestore = firebase.firestore();
  const settings = {/* your settings... */ timestampsInSnapshots: true};
  database.settings(settings)

window.onload = () => initializeApp()

function initializeApp() {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      // do logged in stuff
      const avatarSrc = user.photoURL      
      updateUIforSignIn(avatarSrc)
      getUsersFriends()
    }
    else {
      // do logged out stuff
      updateUIforSignOut()      
    }
  })
}

// const firestore = firebase.firestore();
// const settings = {/* your settings... */ timestampsInSnapshots: true}
// database.settings(settings)

const provider = new firebase.auth.GoogleAuthProvider()
provider.addScope('profile')
provider.addScope('email')

function addUserToDatabase(userInfo, userId) {
  // the way you update the database is by 
  // creating a reference to a collection like this:
  const usersCollectionRef = database.collection('users')
  // then you can create a single document inside the collection like this:
  const newUserRef = usersCollectionRef.doc(userId)
  // you can also do that all at once like this:
  // const newUserRef = database.collection('users').doc(userId)
  // so here we've create a reference to a single document in the 'users' collection
  // then we update that collection with new information for the user
  newUserRef.set(userInfo)
}

function signInWithGoogle() {
  auth.signInWithPopup(provider)
    .then(result => {
      const token = result.credential.accessToken
      const user = result.user
      const avatarSrc = user.photoURL
      const name = user.displayName
      const email = user.email
      const userId = user.uid
      const userInfo = {
        name: name,
        id: userId,
        url: avatarSrc,
        email: email
      }
      updateUIforSignIn(avatarSrc)
      addUserToDatabase(userInfo, userId)

      console.log(user)
    })
    .catch(err => {
      console.log(err)
      updateUIforSignOut()
    })
}

function signUserOut() {
  auth.signOut()
    .then(res => {
      console.log('signed out')
      updateUIforSignOut()
    })
    .catch(err => {
      console.log('error signing out')
    })
}

// function addContactToUser(uid, contactId){
//   const contactsRef = database.collection('contacts')
//   contactsRef.add({
//     userId: uid,
//     contactId: contactId
//   })
// }

function getUsersFriends(){
  console.log('getting users friends')
  contactList.innerHTML = ''
  const uid = auth.currentUser.uid
  const query = database.collection('users')
  .get()
  .then( snapshot => {
    console.log(snapshot)
    if (snapshot.size) {
      snapshot.forEach( (snap, i) => {
        console.log(snap.data())
        updateUIwithNewContact(snap.data())
      })
      // for (let i = 0; i < snapshot.size; i++) {
      //   let userInfo = snapshot[i].data()
      //   console.log( userInfo )
      //   if (i === 0) {
      //     // getAndDisplayConversation(userInfo)
      //     updateUIwithNewContact(userInfo)
      //   } else {
      //     updateUIwithNewContact(userInfo)
      //   }
      // }
    }
  })
}

function getAndDisplayConversation(userInfo){
  const uid = auth.currentUser.uid
  const recipientId = userInfo.id
  getUserSentMessages(uid, recipientId)
  getUserRecievedMessages(uid, recipientId, userInfo.name)
}

function getUserSentMessages(uid, recipientId){
  const query = database.collection('messages')
  .where('sender', '==', uid)
  .where('recipient', '==', recipientId)
  .get()  
  .orderBy('timestamp', 'desc')
  .then( snapshot => {
    if (snapshot.size) {
      snapshot.forEach( message => {
        let data = message.data()
        console.log('user sent: '+data )
        updateUIwithTextData(data)
      })
    }
  })   
}

function getUserRecievedMessages(uid, recipientId, recipientName){
  const query = database.collection('messages')
  .where('sender', '==', recipientId)
  .where('recipient', '==', uid)
  .get()  
  .orderBy('timestamp', 'desc')  
  .then( snapshot => {
    if (snapshot.size) {
      let data = message.data()
      snapshot.forEach( message => console.log('user received: '+data ))
      updateUIwithTextData(data, recipientName)
    }
  })   
}

function displayTextsFrom(id){
  console.log('displaying texts from '+id)
}

function submitTextMessage(text, uid, recipientId){
  const messagesRef = database.collection('messages')
  messagesRef.add({
    sender: uid,
    recipient: recipientId,
    text: text,
    timestamp: new Date().toString()
  })  
}
