ipc = require('electron').ipcRenderer;
ipc.on('message', (event, message) => console.log(message));

const openSecondWindowButton = document.getElementById('second-window');

openSecondWindowButton.addEventListener('click', (event) => {

    console.log("second-window: clicked")
    ipc.send('by-w1', { 'clicked': 'yes', 'value': 1 });

});