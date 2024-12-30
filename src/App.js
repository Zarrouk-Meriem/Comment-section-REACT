import { useState } from "react";
import data from "./data.json";
function App() {
  const currentUser = data.currentUser;
  const initialComments = data.comments;
  const [comments, setComments] = useState(initialComments);
  return (
    <div container>
      <div className="comments">
        {comments.map((comment) => (
          <div className="container">
            <Comment
              currentUser={currentUser}
              key={comment.id}
              comment={comment}
              reply={false}
              onSetComments={setComments}
            />
            {comment.replies.length !== 0 && (
              <div className="replies">
                {comment.replies.map((reply) => (
                  <Comment
                    key={reply.id}
                    currentUser={currentUser}
                    comment={reply}
                    reply={true}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <TextSender
        btnText="send"
        src={currentUser.image.png}
        comments={comments}
        onSetComments={setComments}
        currentUser={currentUser}
      />
    </div>
  );
}
function TextSender({ btnText, src, comments, onSetComments, currentUser }) {
  const [commentContent, setCommentContent] = useState("");
  const addedComment = {
    id: comments?.length + 1,
    content: commentContent,
    user: currentUser,
  };
  function handleSend(e) {
    e.preventDefault();
    onSetComments([...comments, addedComment]);
  }
  return (
    <div className="add-comment">
      <form className="user-comment">
        <img alt="profile" src={src} />
        <textarea
          placeholder="Add a Comment..."
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
        ></textarea>
        <button className={`${btnText}-btn`} onSubmit={handleSend}>
          {btnText}
        </button>
      </form>
    </div>
  );
}
function Comment({ comment, currentUser, reply, onSetComments }) {
  // function sendComment() {
  //   onSetComments();
  // }
  const [score, setScore] = useState(comment.score);
  function handleUpVote() {
    setScore(score + 1);
  }
  function handleDownVote() {
    if (score > 0) setScore(score - 1);
  }
  return (
    <div className="comment">
      <div className="likes-container">
        <ion-icon
          className="btn"
          name="add-outline"
          onClick={handleUpVote}
        ></ion-icon>
        <p>{score}</p>
        <ion-icon
          className="btn"
          name="remove-outline"
          onClick={handleDownVote}
        ></ion-icon>
      </div>
      <div className="comment-container">
        <div className="comment-header">
          <div className="contact-info">
            <img alt="profile" src={comment.user.image.png} />
            <p className="username">{comment.user.username}</p>
            {comment.user.username === currentUser.username && (
              <span className="hidden-you">You</span>
            )}
            <p className="date">{comment.createdAt}</p>
          </div>
          <div className="btns">
            {comment.user.username === currentUser.username && (
              <>
                <div className="btn delete-btn">
                  <img alt="reply-icon" src="./images/icon-delete.svg"></img>
                  <p>delete</p>
                </div>
                <div className="btn edit-btn">
                  <img alt="reply-icon" src="./images/icon-edit.svg"></img>
                  <p>Edit</p>
                </div>
              </>
            )}
            {comment.user.username !== currentUser.username && (
              <div className="btn reply-btn">
                <img alt="reply-icon" src="./images/icon-reply.svg"></img>
                <p>Reply</p>
              </div>
            )}
          </div>
        </div>
        <div className="comment-description">
          {reply && <span>@{comment.replyingTo} </span>}
          {comment.content}
        </div>
      </div>
    </div>
  );
}

export default App;
