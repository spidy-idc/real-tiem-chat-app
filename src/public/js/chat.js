const socket = io({transports: ['websocket']});
const nameBoxGroup = document.querySelector('#nameBoxGroup');
const messageForm = document.querySelector('#messageForm');
const messagePlaceholder = document.querySelector('#message_placeholder');

const generateRoom = async () => {
    let room = await fetch('/current_user', {credentials: 'include'});
    room = await room.json()
    return room.username;
}

//websockets code

socket.on('message', message => {
    var time = moment(message.createdAt).format("DD MMM hh:mm a")
    const html = `<div class="media w-50 mb-3">
    <div class="media-body ml-3">
    <p class="font-weight-bold text-capitalize">${message.sender}</p>
    <div class="bg-light rounded py-2 px-3 mb-2">
        <p id="messageTextDisplay" class="text-small mb-0 text-muted">${message.message}</p>
    </div>
    <p class="small text-muted">${time}</p>
    </div>
</div>`;
    messagePlaceholder.innerHTML += html;
})

const joinRoom = async () => {
    const room = await generateRoom()
    socket.emit('joinRoom', room);
}

joinRoom()

const error = location.search.split('?error=')[1];
if(error)
    alert(error)

const generateMessageId = async username => {
        let current_user = await fetch('/current_user', {credentials: 'include'});
        current_user = await current_user.json()
        let messageid = [username, current_user.username];
        messageid = messageid.sort()
        messageid = messageid[0] + messageid[1];
        return messageid;
}

nameBoxGroup.addEventListener('click', async e => {
    if(e.target.id !== 'nameBoxGroup') {
        const username = e.target.textContent.trim()
        const recieverExists = document.querySelector('.reciever');
        const activeExists = document.querySelector('.active');
        if(activeExists)
            activeExists.classList.remove('active');
        if(recieverExists) {
            recieverExists.classList.remove('reciever');
        }
        e.target.classList.add('reciever');
        e.target.classList.add('active');
        messagePlaceholder.innerHTML = ''
        const chatId = await generateMessageId(username)
        let chats = await fetch(`/getChats/${chatId}`);
        if(chats.status == 500)
             return alert('No Chats yet');
        chats = await chats.json()
        chats = chats.messages;
        messagePlaceholder.innerHTML = ''
        chats.forEach(chat => {
            var time = moment(chat.createdAt).format("DD MMM hh:mm a")
            const html = `<div class="media w-50 mb-3">
                <div class="media-body ml-3">
                <p class="font-weight-bold text-capitalize">${chat.sender}</p>
                <div class="bg-light rounded py-2 px-3 mb-2">
                    <p id="messageTextDisplay" class="text-small mb-0 text-muted">${chat.message}</p>
                </div>
                <p class="small text-muted">${time}</p>
                </div>
            </div>`;
            messagePlaceholder.innerHTML += html;
        })

    }
});

messageForm.addEventListener('submit', async e => {
    e.preventDefault();
    const message = messageForm.messageFormText.value;
    const receiver = document.querySelector('.reciever').textContent.trim();
    console.log(receiver)
    let sender = await fetch('/current_user', {credentials: 'include'});
    sender = await sender.json()
    sender = sender.username;
    const chatId = await generateMessageId(receiver);
    let messageCount = await fetch(`/messageSeq?chatId=${chatId}`, {credentials: 'include'});
    messageCount = await messageCount.json();
    let messageSeq = messageCount.count;
    messageSeq++;
    const dest = receiver;
    let messageObj = {sender, receiver, chatId, message, messageSeq, dest};
    socket.emit('sendMessage', messageObj, (err) => {
        if(err)
            return location = location + '?error=Message not Sent'
        
        messageForm.messageFormText.value = '';
    });
});