document.addEventListener('DOMContentLoaded', function () {
    const socket = io();
  
    // Student Page Scripts
    $('#submit-code').click(() => {
      const code = $('#code-input').val();
      socket.emit('submitCode', code);
    });
  
    $('#clear-code').click(() => {
      $('#code-input').val('');
    });
  
    socket.on('teacherFeedback', (feedback) => {
      $('#teacher-feedback').append(`<p>${feedback}</p>`);
    });
  
    // Student View Scripts
    socket.on('codeBroadcast', (code) => {
      document.getElementById('code-display').innerHTML = `<pre>${code}</pre>`;
    });
  });
  