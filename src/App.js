import { useState } from "react";
import data from "./data.json";
function App() {
  const currentUser = data.currentUser;
  const initialComments = data.comments;
  const [comments, setComments] = useState(initialComments);
  const [clickedReply, setClickedReply] = useState(false);
  const [clickedDelete, setClickedDelete] = useState(false);

  const [clickedId, setClickedId] = useState(null);
  return (
    <>
      {clickedDelete && (
        <div
          className="delete-panel-container"
          // onClick={() => setClickedDelete(false)}
        >
          <div className="delete-panel">
            <h3>Delete comment</h3>
            <p className="delete-text">
              Are you sure you want to delete this comment? This will remove the
              comment and can't be undone.
            </p>
            <div className="delete-panel-btns ">
              <button className="CANCEL-btn btn">Cancel</button>
              <button className="DELETE-btn btn">Delete</button>
            </div>
          </div>
        </div>
      )}
      <div>
        <div className="comments">
          {comments.map((comment) => (
            <div id={comment.id} key={comment.id} className="container">
              <Comment
                currentUser={currentUser}
                id={comment.id}
                comment={comment}
                reply={false}
                onSetClickedReply={setClickedReply}
                onSetClickedId={setClickedId}
                setClickedDelete={setClickedDelete}
                clickedReply={clickedReply}
              />
              {clickedReply && clickedId === comment.id && (
                <TextSender
                  btnText="Reply"
                  id={comment.id}
                  src={currentUser.image.png}
                  comment={comment}
                  comments={comments}
                  onSetComments={setComments}
                  reply={true}
                  currentUser={currentUser}
                  clickedReply={clickedReply}
                  onSetClickedReply={setClickedReply}
                />
              )}

              {comment.replies && (
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
          id={currentUser.id}
          src={currentUser.image.png}
          comments={comments}
          onSetComments={setComments}
          currentUser={currentUser}
        />
      </div>
    </>
  );
}
function TextSender({
  reply = false,
  btnText,
  id,
  src,
  comments,
  comment,
  onSetComments,
  currentUser,
  marginBottom = "0",
  onSetClickedReply,
  clickedReply,
}) {
  const [commentContent, setCommentContent] = useState("");
  function CommentsLength() {
    let length = comments.length;
    comments.forEach((comment) => {
      if (comment.replies) length += comment.replies.length;
    });
    return length;
  }
  const addedComment = {
    createdAt: "Now",
    id: CommentsLength() + 1,
    content: commentContent,
    user: currentUser,
    score: 0,
    replies: [],
    replyingTo: comment?.user.username,
  };
  function handleSend(e) {
    e.preventDefault();
    if (commentContent) {
      onSetComments([...comments, addedComment]);
      setCommentContent("");
    } else alert("Empty field!");
    document.getElementById("textArea").focus();
  }
  function handleReply(e) {
    e.preventDefault();
    if (commentContent) {
      onSetClickedReply(!clickedReply);
      comment.replies.push(addedComment);
      onSetComments(comments);
      setCommentContent("");
    } else alert("Empty field!");
    document.getElementById("textArea").focus();
  }
  return (
    <div className="add-comment">
      <form className="user-comment">
        <img alt="profile" src={src} />
        <textarea
          id="textArea"
          placeholder="Add a Comment..."
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
        ></textarea>
        <button
          className={`${btnText}-btn`}
          onClick={(e) => {
            reply ? handleReply(e) : handleSend(e);
          }}
        >
          {btnText}
        </button>
      </form>
    </div>
  );
}
function Comment({
  comment,
  currentUser,
  reply,
  onSetClickedReply,
  onSetClickedId,
  setClickedDelete,
  clickedReply,
}) {
  const [score, setScore] = useState(comment.score);
  const [clickedEdit, setClickedEdit] = useState(false);

  const [textAreaContent, setTextAreaContent] = useState(` ${comment.content}`);

  function handleUpVote() {
    setScore(score + 1);
  }
  function handleDownVote() {
    if (score > 0) setScore(score - 1);
  }
  function handleEdit() {
    setClickedEdit(true);
  }
  function handleUpdate() {
    if (textAreaContent) {
      comment = { ...comment, content: textAreaContent };
      setTextAreaContent(`${comment.content}`);
      setClickedEdit(false);
    } else alert("Empty field!");
  }
  function handleReply() {
    onSetClickedReply(true);
    onSetClickedId(comment.id);
  }
  return (
    <>
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
                  <div
                    className="btn delete-btn"
                    onClick={() => setClickedDelete(true)}
                  >
                    <img alt="delete-icon" src="./images/icon-delete.svg"></img>
                    <p>delete</p>
                  </div>
                  <div className="btn edit-btn" onClick={handleEdit}>
                    <img alt="edit-icon" src="./images/icon-edit.svg"></img>
                    <p>Edit</p>
                  </div>
                </>
              )}
              {comment.user.username !== currentUser.username && (
                <div
                  style={
                    reply ? { cursor: "not-allowed" } : { cursor: "pointer" }
                  }
                  className="btn reply-btn"
                  onClick={handleReply}
                >
                  <img alt="reply-icon" src="./images/icon-reply.svg"></img>
                  <p>Reply</p>
                </div>
              )}
            </div>
          </div>
          {clickedEdit ? (
            <>
              <textarea
                className="text-box-update"
                value={textAreaContent}
                onChange={(e) => setTextAreaContent(e.target.value)}
              ></textarea>
              <button className="btn update-btn" onClick={handleUpdate}>
                Update
              </button>
            </>
          ) : (
            <div className="comment-description">
              {reply && <span>@{comment.replyingTo} </span>}
              {textAreaContent}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
