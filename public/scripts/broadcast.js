document.addEventListener('DOMContentLoaded', function () {
    // Your script here
    const socket = io();
  
    // Teacher Page Scripts
    socket.on('codeSubmission', (code) => {
      $('#student-code').append($('<div>').text(code));
    });
  
    $('#send-feedback').click(() => {
      const feedback = $('#feedback-input').val();
      socket.emit('teacherFeedback', feedback);
    });
  
    $('#student-code').on('mousedown', 'div', function() {
      $(this).toggleClass('highlight'); 
    });
  
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
  
    // Public (Teacher's Side) Scripts
    $('#broadcast-button').click(() => {
      const code = $('#code-input').val();
      socket.emit('broadcastCode', code);
    });
  
    socket.on('codeBroadcast', (code) => {
      $('#code-display').html(`<pre>${code}</pre>`);
    });
  
    // Student View Scripts
    socket.on('codeBroadcast', (code) => {
      document.getElementById('code-display').innerHTML = `<pre>${code}</pre>`;
    });
  });
  