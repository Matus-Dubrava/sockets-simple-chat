const nameInp = document.getElementById('username'),
      messageInp = document.getElementById('message'),
      submitBtn = document.getElementById('chat-btn'),
      chatWind = document.getElementById('chat-window')
      socket = io.connect('http://localhost:4000');

function addMessage(chat, messageObj) {
  const { name, message } = messageObj;
  chat.innerHTML += `<p><strong>${name}: </strong>${message}</p>`;
}

const addMessageLocal = addMessage.bind(null, chatWind);

function validateNonEmpty(field, message) {
  if (!field.value) {
    field.classList.add('field-error');
    field.setAttribute('placeholder', message);
    return false;
  } else {
    return true;
  }
}

(async function loadMessages() {
  const data = await fetch('/messages');
  const messages = await data.json();
  messages.forEach(addMessageLocal);
})();

submitBtn.addEventListener('click', (evt) => {
  let name = nameInp.value,
      message = messageInp.value,
      isValid = false;

  isValid = validateNonEmpty(nameInp, 'Name is required');
  isValid = validateNonEmpty(messageInp, 'Message is required.') && isValid;

  if (isValid) { socket.emit('chat-message', { name, message }); }
});

nameInp.addEventListener('input', (evt) => {
  nameInp.classList.remove('field-error');
});

messageInp.addEventListener('input', (evt) => {
  messageInp.classList.remove('field-error');
});

socket.on('chat-message', addMessageLocal);
