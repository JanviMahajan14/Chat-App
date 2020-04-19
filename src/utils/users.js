const users = []

const addUsers = ({id, username, room}) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room) {
        return {
            error:" UserName or room are required!"
        }
    }

    const existingUser = users.find((user)=>{
        return user.username === username && user.room === room
    })

    if(existingUser){
        return {error: "User already in use!"}
    }

    const user = {id, username, room}
    users.push(user)
    return user
}

const removeUsers = (id) =>{
    const index = users.findIndex((user)=>user.id == id)
    if(index == -1){
        return {error: "No such user exists!"}
    }
    const result = users[index]
    users.splice(index,1)
    return result
}

const getUsers = (id) => {
    const user = users.find((user)=>{
        return user.id == id
    })

    if(!user){
        return {error: "No such user exists"}
    }

    return user
}

getUsersInRoom = (room) =>{
    const user = users.filter((user)=>user.room == room)
    if(!user){
        return []
    }
    return user
}

// console.log(addUsers({id:"1234", username:"Heart", room: "hello"}))
// console.log(addUsers({id:"4567", username:"Jaan", room: "hello"}))
// console.log(getUsers(4567))
// console.log(getUsersInRoom("hello"))
// console.log(getUsersInRoom("chalo"))
// console.log(removeUsers('4567'))

module.exports = {
    addUsers,
    removeUsers,
    getUsers,
    getUsersInRoom
}