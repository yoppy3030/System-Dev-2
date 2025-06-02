// comments.js
const form = document.getElementById('comment-form');
const commentsContainer = document.getElementById('comments');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const comment = document.getElementById('comment').value.trim();

  if (username && comment) {
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment');
    commentDiv.innerHTML = `<strong>${username}</strong><p>${comment}</p>`;
    commentsContainer.prepend(commentDiv);
    form.reset();
  }
});
