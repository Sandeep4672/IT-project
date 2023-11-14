document.addEventListener('DOMContentLoaded', function () {
    const socket = io();
  
    // Teacher Page Scripts
    socket.on('codeSubmission', (code) => {
      $('#student-code').append($('<div>').text(code));
    });
  
    $('#send-feedback').click(() => {
      const feedback = $('#feedback-input').val();
      socket.emit('teacherFeedback', feedback);
    });
  
    $('#student-code').on('mousedown', 'div', function () {
      $(this).toggleClass('highlight');
    });
  
    // Public (Teacher's Side) Scripts
    $('#broadcast-button').click(() => {
      const code = $('#code-input').val();
      socket.emit('broadcastCode', code);
    });
  
    socket.on('codeBroadcast', (code) => {
      $('#code-display').html(`<pre>${code}</pre>`);
    });
  });
  