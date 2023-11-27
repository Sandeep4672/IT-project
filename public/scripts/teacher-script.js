document.addEventListener('DOMContentLoaded', function () {
  const socket = io();

  function addNotification(notification) {
    const notificationElement = $(`
      <div class="notification" data-username="${notification.username}">
        <p>${notification.message}</p>
        <button class="tick-button">✔️</button>
        <button class="cross-button">❌</button>
      </div>
    `);
    $('.notification-container').append(notificationElement);
  }


  $.ajax({
    url: '/student/getNotifications',
    method: 'GET',
    success: function (notifications) {
      console.log("Teacher-scripts",notifications);
      notifications.forEach((notification) => {
        addNotification(notification);
      });
    },
    error: function (error) {
      console.error('Failed to retrieve notifications:', error);
    }
  });

  // Teacher Page Scripts
  socket.on('codeSubmission', (code) => {
    $('#student-code').append($('<div>').text(code));
  });

  socket.on('notification', (notification) => {
    console.log("Notificccccc",notification);
    addNotification(notification);
  });

  $('#send-feedback').click(() => {
    const feedback = $('#feedback-input').val();

    const urlParams = new URLSearchParams(window.location.search);
    const studentUsername = urlParams.get('student');
    console.log("SSS",studentUsername);

    socket.emit('teacherFeedback', { feedback, studentUsername });
});


  $('#student-code').on('mousedown', 'div', function () {
    $(this).toggleClass('highlight');
  });

  $('#broadcast-button').click(() => {
    const code = $('#code-input').val();
    $.ajax({
      url: '/student/codeSubmission',
      method: 'POST',
      data: { code: code,username:"Sandeep"},
      success: function (data) {
          console.log("Broadcast saved successfully:", data);
      },
      error: function (error) {
          console.error('Failed to save broadcast:', error);
      }
  });
    socket.emit('broadcastCode', code);
  });

  $('.notification-container').on('click', '.tick-button', function () {
    const notificationElement = $(this).closest('.notification');

    const username = notificationElement.data('username');

    const newTab = window.open(`/teacher/private?student=${username}`, '_blank');
    newTab.focus();
  });

  $('.notification-container').on('click', '.cross-button', function () {
    const confirmation = confirm('Are you sure you want to delete this notification?');
    const studentName = $(this).closest('.notification').find('p').text().split(' ')[0];
    socket.emit('deleteNotification', { studentName });
    if(confirmation){
      $(this).closest('.notification').remove();
    }
  });


  function getSelectedText() {
    let selectedText = '';
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== '') {
      selectedText = selection.toString();
    }
    return selectedText;
  }
  
  
  $('#student-code').on('mouseup', function (e) {
    const selectedText = getSelectedText().trim();
    if (selectedText !== '') {
      $('#highlight-options').css({
        display: 'block',
        left: e.pageX + 'px',
        top: e.pageY + 'px'
      });
    }
  });
  
  
  $('#foreground-highlight, #strikethrough-highlight').click(() => {
    const selectedText = getSelectedText().trim();
    if (selectedText !== '') {
      const command = $('#foreground-highlight').is(':focus') ? 'hiliteColor' : 'strikeThrough';
  
      const isHighlighted = document.queryCommandState(command);
      
      if (isHighlighted) {
        document.execCommand('removeFormat', false, null);
      } else {
        document.execCommand(command, false, 'yellow');
      }
  
      $('#highlight-options').css('display', 'none');
      const highlightedCode = $('#student-code').html();
      const urlParams = new URLSearchParams(window.location.search);
      const studentUsername = urlParams.get('student');
      console.log(studentUsername);
      socket.emit('sendHighlightedCode', highlightedCode,studentUsername);
    }
  });

  $('#button').on('click', function () {
    const confirmation = confirm('Are you sure you want to clear the broadcast?');
    if(confirmation){
      $('#code-input').val('');
      $.ajax({
        url: '/student/codeSubmission',
        method: 'POST',
        data: { code: '',username:"Sandeep"},
        success: function (data) {
            console.log("Broadcast saved successfully:", data);
        },
        error: function (error) {
            console.error('Failed to save broadcast:', error);
        }
    });
      socket.emit('broadcastCode', '');
    }
  });
  
});
