document.addEventListener('DOMContentLoaded', function () {
  const socket = io();

  socket.on('codeSubmission', (code) => {
    $('#student-code').append($('<div>').html(code));
  });
  socket.on('notification', (notificationData) => {
    const { message, studentName } = notificationData;
    const link = studentName ? `<a href="/teacher/private/${studentName}">${message}</a>` : message;
    $('.notification-container').append(`<p>${link}</p>`);
});


  $('#send-feedback').click(() => {
    const feedback = $('#feedback-input').val();
    socket.emit('teacherFeedback', feedback);
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
    const selectedText = getSelectedText();
    if (selectedText !== '') {
      $('#highlight-options').css({
        display: 'block',
        left: e.pageX + 'px',
        top: e.pageY + 'px',
      });
    }
  });

  $('#foreground-highlight, #strikethrough-highlight').click(() => {
    const selectedText = getSelectedText();
    if (selectedText !== '') {
      const command = $('#foreground-highlight').is(':focus') ? 'hiliteColor' : 'strikeThrough';

      const span = document.createElement('span');
      span.textContent = selectedText;
      span.classList.add(command === 'hiliteColor' ? 'highlighted' : 'strikethrough');

      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(span);

      $('#highlight-options').css('display', 'none');
      
      const highlightedCode = $('#student-code').html();
      socket.emit('sendHighlightedCode', highlightedCode);
    }
  });
});
