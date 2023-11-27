document.addEventListener('DOMContentLoaded', function () {
  const socket = io();


  function getStudentName(callback) {
    $.ajax({
      url: '/student/getStudentName', 
      method: 'GET',
      success: function (data) {
        callback(null, data.name);
      },
      error: function (error) {
        callback(error, null);
      }
    });
  }


  function hasSubmittedCode(callback) {
    getStudentName((error, studentName) => {
        if (error) {
            console.error('Failed to retrieve student name:', error);
            callback(error, null);
        } else {
            $.ajax({
                url: '/student/hasSubmittedCode',
                method: 'GET',
                data: { username: studentName },
                success: function (data) {
                    callback(null, data.hasSubmittedCode);
                },
                error: function (error) {
                    callback(error, null);
                }
            });
        }
    });
}

getStudentName((error, studentName) => {
  if (error) {
      console.error('Failed to retrieve student name:', error);
  } else {
      socket.emit('registerStudent', studentName);
  }
});

$('#submit-code').click(() => {
  hasSubmittedCode((error, hasSubmitted) => {
      if (error) {
          console.error('Failed to check code submission status:', error);
      } else {
          if (hasSubmitted) {
              alert('You have already submitted a code. Please wait for feedback.');
          } else {
              const code = $('#code-input').val();
              getStudentName((error, studentName) => {
                  if (error) {
                      console.error('Failed to retrieve student name:', error);
                  } else {
                      $.post('/student/codeSubmission', { code: code, username: studentName }, (response) => {
                          console.log(response);
                      });
                      socket.emit('submitCode', code, studentName);
                  }
              });
          }
      }
  });
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

  socket.on('highlightedCodeToStudents', (highlightedCode) => {
    console.log(highlightedCode);
    $('#highlighted-code').html(highlightedCode);
   });
});

