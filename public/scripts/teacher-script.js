document.addEventListener('DOMContentLoaded', function () {
    const socket = io();
  
    // Teacher Page Scripts
    socket.on('codeSubmission', (code) => {
      $('#student-code').append($('<div>').text(code));
    });

    socket.on('notification', (message) => {
      console.log(message);
      $('.notification-container').append(`<p>${message}</p>`);
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

    $('.notification-container').on('click', 'p', function () {
      const studentName = $(this).text().split(' ')[0];
      window.location.href = `/teacher/private?student=${studentName}`;
  });

  });
  