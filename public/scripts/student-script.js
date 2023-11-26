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
      return false;
  }

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
  });
  