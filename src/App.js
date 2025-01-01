import { useState } from "react";
import data from "./data.json";

function App() {
  const currentUser = data.currentUser;
  const initialComments = data.comments;
  const [comments, setComments] = useState(initialComments);
  const [clickedReply, setClickedReply] = useState(false);
  const [clickedDelete, setClickedDelete] = useState(false);
  const [clickedId, setClickedId] = useState(null);

  function handleCancel() {
    setClickedDelete(false);
  }

  function handleDelete() {
    const updatedComments = comments.filter((comment) => {
      if (comment.replies.length !== 0) {
        comment.replies = comment.replies.filter(
          (reply) => reply.id !== clickedId
        );
      }
      return comment.id !== clickedId;
    });
    setComments(updatedComments);
    setClickedDelete(false);
  }

  return (
    <>
      {clickedDelete && (
        <div className="delete-panel-container">
          <div className="delete-bg" onClick={handleCancel}></div>
          <div className="delete-panel">
            <h3>Delete comment</h3>
            <p className="delete-text">
              Are you sure you want to delete this comment? This will remove the
              comment and can't be undone.
            </p>
            <div className="delete-panel-btns">
              <button className="CANCEL-btn btn" onClick={handleCancel}>
                Cancel
              </button>
              <button className="DELETE-btn btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex">
        <div className="comments">
          {comments
            .sort((b, a) => a.score - b.score)
            .map((comment, i) => (
              <div id={comment.id} key={comment.id} className="container">
                <Comment
                  currentUser={currentUser}
                  i={i}
                  id={comment.id}
                  key={comment.id}
                  comment={comment}
                  comments={comments}
                  onSetComments={setComments}
                  reply={false}
                  onSetClickedReply={setClickedReply}
                  onSetClickedId={setClickedId}
                  onSetClickedDelete={setClickedDelete}
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
                    {comment.replies
                      .sort((b, a) => a.score - b.score)
                      .map((reply, replyIndex) => (
                        <Comment
                          i={i}
                          key={reply.id}
                          currentUser={currentUser}
                          id={reply.id}
                          comments={comments}
                          onSetComments={setComments}
                          comment={reply}
                          reply={true}
                          replyIndex={replyIndex}
                          onSetClickedReply={setClickedReply}
                          onSetClickedId={setClickedId}
                          onSetClickedDelete={setClickedDelete}
                        />
                      ))}
                  </div>
                )}
              </div>
            ))}
        </div>
        <TextSender
          btnText="Send"
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
  src,
  comments,
  comment,
  onSetComments,
  currentUser,
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
    id: CommentsLength() + 1,
    content: commentContent,
    score: 0,
    createdAt: "Now",
    user: currentUser,
    replies: [],
    replyingTo: comment?.user.username,
  };

  function handleSend(e) {
    e.preventDefault();
    if (commentContent && commentContent.trim().length !== 0) {
      const updatedComments = [...comments, addedComment];
      updatedComments.sort((b, a) => a.score - b.score);
      onSetComments(updatedComments);
      setCommentContent("");
    } else alert("Empty field!");
  }

  function handleReply(e) {
    e.preventDefault();
    if (commentContent && commentContent.trim().length !== 0) {
      onSetClickedReply(!clickedReply);
      comment.replies.push(addedComment);
      const updatedComments = [...comments];
      updatedComments.sort((b, a) => a.score - b.score);
      onSetComments(updatedComments);
      setCommentContent("");
    } else alert("Empty field!");
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
        <button onClick={(e) => (reply ? handleReply(e) : handleSend(e))}>
          {btnText}
        </button>
      </form>
    </div>
  );
}

function Comment({
  comment,
  i,
  comments,
  onSetComments,
  currentUser,
  reply,
  replyIndex,
  onSetClickedReply,
  onSetClickedId,
  onSetClickedDelete,
}) {
  const [clickedEdit, setClickedEdit] = useState(false);
  const [textAreaContent, setTextAreaContent] = useState(comment.content);

  function handleUpVote() {
    const updatedComment = { ...comment, score: comment.score + 1 };
    updateComments(updatedComment);
  }

  function handleDownVote() {
    const updatedComment = { ...comment, score: comment.score - 1 };
    updateComments(updatedComment);
  }

  function updateComments(updatedComment) {
    const updatedComments = [...comments];
    if (reply) {
      updatedComments[i].replies[replyIndex] = updatedComment;
      updatedComments[i].replies.sort((b, a) => a.score - b.score);
    } else {
      updatedComments[i] = updatedComment;
    }
    updatedComments.sort((b, a) => a.score - b.score);
    onSetComments(updatedComments);
  }

  function handleEdit() {
    setClickedEdit(true);
  }

  function handleUpdate() {
    if (textAreaContent) {
      const updatedComment = { ...comment, content: textAreaContent };
      updateComments(updatedComment);
      setClickedEdit(false);
    } else alert("Empty field!");
  }

  function handleReply() {
    onSetClickedReply(true);
    onSetClickedId(comment.id);
  }

  function handleDelete() {
    onSetClickedDelete(true);
    onSetClickedId(comment.id);
  }

  return (
    <div className="comment">
      <div className="likes-container">
        <ion-icon name="add-outline" onClick={handleUpVote}></ion-icon>
        <p>{comment.score}</p>
        <ion-icon name="remove-outline" onClick={handleDownVote}></ion-icon>
      </div>
      <div className="comment-container">
        <div className="comment-header">
          <div className="contact-info">
            <img alt="profile" src={comment.user.image.png} />
            <p className="username">{comment.user.username}</p>
            {comment.user.username === currentUser.username && (
              <span className="hidden-you ">You</span>
            )}
            <p className="date">{comment.createdAt}</p>
          </div>
          <div className="btns">
            {comment.user.username === currentUser.username && (
              <>
                <button className="btn delete-btn" onClick={handleDelete}>
                  <img alt="delete icon" src="images/icon-delete.svg" />
                  Delete
                </button>
                <button className="btn edit-btn" onClick={handleEdit}>
                  <img alt="edit icon" src="images/icon-edit.svg" />
                  Edit
                </button>
              </>
            )}
            {comment.user.username !== currentUser.username && (
              <button className="btn reply-btn  " onClick={handleReply}>
                <img alt="reply icon" src="images/icon-reply.svg"></img>
                Reply
              </button>
            )}
          </div>
        </div>
        {clickedEdit ? (
          <form>
            <textarea
              className=""
              value={textAreaContent}
              onChange={(e) => setTextAreaContent(e.target.value)}
            ></textarea>
            <button className="update-btn" onClick={handleUpdate}>
              Update
            </button>
          </form>
        ) : (
          <div className="comment-description">
            <span>{reply && `@${comment.replyingTo} `}</span>
            {comment.content}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
