document.getElementById('fetchBtn').addEventListener('click', fetchData);
document.getElementById('xhrBtn').addEventListener('click', fetchXHR);
document.getElementById('postForm').addEventListener('submit', sendPostData);
document.getElementById('putForm').addEventListener('submit', updatePostData);
document.getElementById('deleteForm').addEventListener('submit', deletePostData);

const output = document.getElementById('output');
const message = document.getElementById('message');

function displayResult(element, data, isError = false) {
  element.className = isError ? 'error' : '';
  if (isError) {
    element.innerHTML = `<strong>Error:</strong> ${data}`;
  } else {
    element.innerHTML = `
      <h3>Post ID: ${data.id}</h3>
      <h4>${data.title}</h4>
      <p>${data.body}</p>
    `;
  }
}

function fetchData() {
  fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return res.json();
    })
    .then(data => displayResult(output, data))
    .catch(error => displayResult(output, error.message, true));
}

function fetchXHR() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts/2');
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);
      displayResult(output, data);
    } else {
      displayResult(output, `Status ${xhr.status}: ${xhr.statusText}`, true);
    }
  };
  xhr.onerror = () => displayResult(output, 'Network error occurred.', true);
  xhr.send();
}

function sendPostData(e) {
  e.preventDefault();
  const title = document.getElementById('postTitle').value;
  const body = document.getElementById('postBody').value;

  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body })
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to create post');
      return res.json();
    })
    .then(data => {
      message.className = '';
      message.innerHTML = `<strong>Post Created:</strong><br>ID: ${data.id}<br>Title: ${data.title}<br>Body: ${data.body}`;
    })
    .catch(error => {
      message.className = 'error';
      message.innerHTML = `<strong>Error:</strong> ${error.message}`;
    });
}

function updatePostData(e) {
  e.preventDefault();
  const id = document.getElementById('postId').value;
  const title = document.getElementById('updateTitle').value;
  const body = document.getElementById('updateBody').value;

  const xhr = new XMLHttpRequest();
  xhr.open('PUT', `https://jsonplaceholder.typicode.com/posts/${id}`);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);
      message.className = '';
      message.innerHTML = `<strong>Post Updated:</strong><br>ID: ${data.id}<br>Title: ${data.title}<br>Body: ${data.body}`;
    } else {
      message.className = 'error';
      message.innerHTML = `<strong>Error:</strong> Status ${xhr.status}: ${xhr.statusText}`;
    }
  };
  xhr.onerror = () => {
    message.className = 'error';
    message.innerHTML = `<strong>Error:</strong> Network error occurred.`;
  };
  xhr.send(JSON.stringify({ title, body }));
}

function deletePostData(e) {
  e.preventDefault();
  const id = document.getElementById('deleteId').value;

  fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: 'DELETE',
  })
    .then(res => {
      if (res.ok) {
        message.className = '';
        message.innerHTML = `<strong>Post Deleted:</strong> Post with ID ${id} has been deleted.`;
      } else {
        throw new Error(`Delete failed with status ${res.status}`);
      }
    })
    .catch(error => {
      message.className = 'error';
      message.innerHTML = `<strong>Error:</strong> ${error.message}`;
    });
}
