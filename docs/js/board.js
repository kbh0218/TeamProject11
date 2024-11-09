let currentBoard = 1;
const postList = document.getElementById('postList');
const postModal = document.getElementById('postModal');
const commentModal = document.getElementById('commentModal');
const contentModal = document.getElementById('contentModal'); // 글의 내용 모달
const postContentDiv = document.getElementById('postContent'); // 글의 내용 표시 영역
const postForm = document.getElementById('postForm');
const commentForm = document.getElementById('commentForm');
let editingPost = null;
let selectedPostIndex = null;

function navigateToBoard(boardNumber) {
    currentBoard = boardNumber;
    document.querySelector('h2').textContent = `${boardNumber}번 식당 게시판`;
    loadPosts();
}

document.getElementById('newPostBtn').onclick = function () {
    postModal.style.display = 'block';
    postForm.reset();
    editingPost = null;
};

function closeModal() {
    postModal.style.display = 'none';
}

postForm.onsubmit = function (event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const recommend = document.querySelector('input[name="recommend"]:checked').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;

    const post = { title, content, recommend, rating, board: currentBoard, comments: [], likes: 0 };

    if (editingPost !== null) {
        updatePost(editingPost, post);
    } else {
        savePost(post);
    }

    closeModal();
    loadPosts();
};

function savePost(post) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));
}

function loadPosts() {
    postList.innerHTML = '';
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.filter(post => post.board === currentBoard).forEach((post, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${post.title} (${post.recommend})</strong><br> <!-- 추천/비추천 표시 -->
            <button onclick="showContent(${index})">글의 내용</button>
            <button onclick="likePost(${index})">좋아요 (${post.likes})</button>
            <button onclick="openCommentModal(${index})">댓글 보기</button>
            <button onclick="deletePost(${index})">삭제</button>
        `;
        postList.appendChild(li);
    });
}


function deletePost(index) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];

    // 현재 게시판에 속한 게시글만 필터링한 후 삭제할 게시글을 찾음
    const filteredPosts = posts.filter(post => post.board === currentBoard);
    const globalIndex = posts.indexOf(filteredPosts[index]); // 원본 배열에서 인덱스 찾기

    if (globalIndex !== -1) {
        posts.splice(globalIndex, 1); // 해당 인덱스의 게시글 삭제
        localStorage.setItem('posts', JSON.stringify(posts)); // localStorage에 반영
        loadPosts(); // 게시글 목록 다시 로드
    }
}


function showContent(index) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts[index];

    postContentDiv.textContent = post.content; // 게시글 내용 표시
    contentModal.style.display = 'block'; // 모달 열기
}

function closeContentModal() {
    contentModal.style.display = 'none'; // 모달 닫기
}

function likePost(index) {
    let posts = JSON.parse(localStorage.getItem('posts'));
    posts[index].likes += 1;
    localStorage.setItem('posts', JSON.stringify(posts));
    loadPosts();
}

function openCommentModal(index) {
    selectedPostIndex = index;
    commentModal.style.display = 'block';
    loadComments();
}

function closeCommentModal() {
    commentModal.style.display = 'none';
}

commentForm.onsubmit = function (event) {
    event.preventDefault();
    const comment = document.getElementById('commentInput').value;
    const posts = JSON.parse(localStorage.getItem('posts'));
    posts[selectedPostIndex].comments.push(comment);
    localStorage.setItem('posts', JSON.stringify(posts));
    loadComments();
    commentForm.reset();
};

function loadComments() {
    const posts = JSON.parse(localStorage.getItem('posts'));
    const commentsDiv = document.getElementById('comments');
    commentsDiv.innerHTML = posts[selectedPostIndex].comments.map(c => `<p>${c}</p>`).join('');
}

window.onload = loadPosts;


/*
let currentBoard = 1;
const postList = document.getElementById('postList');
const postModal = document.getElementById('postModal');
const commentModal = document.getElementById('commentModal');
const postForm = document.getElementById('postForm');
const commentForm = document.getElementById('commentForm');
let editingPost = null;
let selectedPostIndex = null;

function navigateToBoard(boardNumber) {
    currentBoard = boardNumber;
    document.querySelector('h2').textContent = `${boardNumber}번 식당 게시판`;
    loadPosts();
}

document.getElementById('newPostBtn').onclick = function() {
    postModal.style.display = 'block';
    postForm.reset();
    editingPost = null;
};

function closeModal() {
    postModal.style.display = 'none';
}

postForm.onsubmit = function(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const recommend = document.querySelector('input[name="recommend"]:checked').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;

    const post = { title, content, recommend, rating, board: currentBoard, comments: [], likes: 0 };

    if (editingPost !== null) {
        updatePost(editingPost, post);
    } else {
        savePost(post);
    }

    closeModal();
    loadPosts();
};

function savePost(post) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));
}

function likePost(index) {
    let posts = JSON.parse(localStorage.getItem('posts'));
    posts[index].likes += 1;
    localStorage.setItem('posts', JSON.stringify(posts));
    loadPosts();
}

function openCommentModal(index) {
    selectedPostIndex = index;
    commentModal.style.display = 'block';
    loadComments();
}

function closeCommentModal() {
    commentModal.style.display = 'none';
}

commentForm.onsubmit = function(event) {
    event.preventDefault();
    const comment = document.getElementById('commentInput').value;
    const posts = JSON.parse(localStorage.getItem('posts'));
    posts[selectedPostIndex].comments.push(comment);
    localStorage.setItem('posts', JSON.stringify(posts));
    loadComments();
    commentForm.reset();
};

function loadComments() {
    const posts = JSON.parse(localStorage.getItem('posts'));
    const commentsDiv = document.getElementById('comments');
    commentsDiv.innerHTML = posts[selectedPostIndex].comments.map(c => `<p>${c}</p>`).join('');
}

// scripts.js

function loadPosts() {
    postList.innerHTML = '';
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.filter(post => post.board === currentBoard).forEach((post, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${post.title} - ${post.rating}점 (${post.recommend})</span>
            <button onclick="likePost(${index})">좋아요 (${post.likes})</button>
            <button onclick="openCommentModal(${index})">댓글 보기</button>
            <button onclick="deletePost(${index})">삭제</button> <!-- 삭제 버튼 추가 -->
        `;
        postList.appendChild(li);
    });
}

function deletePost(index) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.splice(index, 1); // 해당 인덱스의 게시글 삭제
    localStorage.setItem('posts', JSON.stringify(posts)); // localStorage에 반영
    loadPosts(); // 게시글 목록 다시 로드
}

// 전역 변수 추가
const contentModal = document.getElementById('contentModal');
const postContentDiv = document.getElementById('postContent');

// 게시글 목록 로드 함수 수정
function loadPosts() {
    postList.innerHTML = '';
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.filter(post => post.board === currentBoard).forEach((post, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${post.title}</strong><br>
            <button onclick="showContent(${index})">글의 내용</button> <!-- 글의 내용 버튼 -->
            <button onclick="likePost(${index})">좋아요 (${post.likes})</button>
            <button onclick="openCommentModal(${index})">댓글 보기</button>
            <button onclick="deletePost(${index})">삭제</button>
        `;
        postList.appendChild(li);
    });
}

// 글의 내용 모달 열기 함수
function showContent(index) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts[index];

    postContentDiv.textContent = post.content; // 게시글 내용 표시
    contentModal.style.display = 'block'; // 모달 열기
}

// 글의 내용 모달 닫기 함수
function closeContentModal() {
    contentModal.style.display = 'none'; // 모달 닫기
}


function showContent(index) {
    const contentDiv = document.getElementById(`content-${index}`);
    if (contentDiv.style.display === 'none') {
        contentDiv.style.display = 'block'; // 내용 보이기
    } else {
        contentDiv.style.display = 'none';  // 내용 숨기기
    }
}



window.onload = loadPosts;
*/
