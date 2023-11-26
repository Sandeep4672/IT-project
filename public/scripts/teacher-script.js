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
    socket.emit('teacherFeedback', feedback);
  });

  $('#student-code').on('mousedown', 'div', function () {
    $(this).toggleClass('highlight');
  });

  $('#broadcast-button').click(() => {
    const code = $('#code-input').val();
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
});
