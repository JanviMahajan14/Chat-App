const socket = io()

// Elements
const $messageForm = document.querySelector("#message-form")
const $messageFormInput = document.querySelector("input")
const $messageFormButton = document.querySelector("button")
const $shareLocationButton = document.querySelector("#share-location")
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

socket.on('message',(message)=>{
    const html = Mustache.render(messageTemplate,{
      message: message.text,
      createdAt: moment(message.createdAt).format('hh:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('location-message',(url)=>{
  const html = Mustache.render(locationTemplate,{
    location: url.location,
    createdAt: moment(url.createdAt).format('hh:mm a')
  })
  $messages.insertAdjacentHTML('beforeend',html)
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    $messageFormButton.disabled = true
    socket.emit('send-message',$messageFormInput.value,(data)=>{
      console.log("The message is ",data)
      $messageFormButton.disabled = false
      $messageFormInput.value = ''
      $messageFormInput.focus()
    })
})

$shareLocationButton.addEventListener('click',()=>{
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser')
  } else {
    $shareLocationButton.disabled = true
    navigator.geolocation.getCurrentPosition((location)=>{
          socket.emit('shareLocation',{
            latitude:location.coords.latitude,
            longitude:location.coords.longitude
        },()=>{
          console.log("Your location is shared")
          $shareLocationButton.disabled = false
        })
    });
  }
});