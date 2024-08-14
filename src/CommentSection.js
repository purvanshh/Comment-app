import React, { useState } from 'react';
import uuid from 'react-uuid';
import moment from 'moment';
import './CommentSection.css';

const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [currentComment, setCurrentComment] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [replyComment, setReplyComment] = useState({ text: '', name: '', commentId: null });
  const [editing, setEditing] = useState({ type: null, id: null, text: '', commentId: null });

  const addComment = () => {
    if (currentName && currentComment) {
      const newComment = {
        id: uuid(),
        name: currentName,
        comment: currentComment,
        timestamp: moment().format('LLL'),
        replies: [],
      };
      setComments([newComment, ...comments]); 
      setCurrentComment('');
      setCurrentName('');
    }
  };

  const addReply = (id, replyText, replyName) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === id) {
        const newReply = {
          id: uuid(),
          name: replyName,
          comment: replyText,
          timestamp: moment().format('LLL'),
        };
        return { ...comment, replies: [...comment.replies, newReply] };
      }
      return comment;
    });
    setComments(updatedComments);
    setReplyComment({ text: '', name: '', commentId: null });
  };

  const editComment = (id, newComment) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === id) {
        return { ...comment, comment: newComment };
      }
      return comment;
    });
    setComments(updatedComments);
    setEditing({ type: null, id: null, text: '', commentId: null });
  };

  const editReply = (commentId, replyId, newReplyText) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        const updatedReplies = comment.replies.map((reply) => {
          if (reply.id === replyId) {
            return { ...reply, comment: newReplyText };
          }
          return reply;
        });
        return { ...comment, replies: updatedReplies };
      }
      return comment;
    });
    setComments(updatedComments);
    setEditing({ type: null, id: null, text: '', commentId: null });
  };

  const renderReplyInput = (commentId) => (
    <div className="reply-input-container">
      <input
        className="input"
        type="text"
        placeholder="Your Name"
        value={replyComment.name}
        onChange={(e) => setReplyComment({ ...replyComment, name: e.target.value })}
      />
      <input
        className="input"
        type="text"
        placeholder="Your Reply"
        value={replyComment.text}
        onChange={(e) => setReplyComment({ ...replyComment, text: e.target.value })}
      />
      <button
        className="button"
        onClick={() => addReply(commentId, replyComment.text, replyComment.name)}
      >
        Post Reply
      </button>
    </div>
  );

  const renderCommentItem = (comment) => (
    <div className="comment-container" key={comment.id}>
      <span className="name">{comment.name}</span>
      {editing.type === 'comment' && editing.id === comment.id ? (
        <div>
          <input
            className="input"
            type="text"
            value={editing.text}
            onChange={(e) => setEditing({ ...editing, text: e.target.value })}
          />
          <button
            className="button"
            onClick={() => editComment(comment.id, editing.text)}
          >
            Save Comment
          </button>
        </div>
      ) : (
        <p className="comment-text">{comment.comment}</p>
      )}
      <span className="timestamp">{comment.timestamp}</span>
      <div className="actions-container">
        <button
          className="action-button"
          onClick={() => setReplyComment({ ...replyComment, commentId: comment.id })}
        >
          Reply
        </button>
        {editing.type !== 'comment' && (
          <button
            className="action-button"
            onClick={() => setEditing({ type: 'comment', id: comment.id, text: comment.comment })}
          >
            Edit
          </button>
        )}
      </div>
      {replyComment.commentId === comment.id && renderReplyInput(comment.id)}
      {comment.replies.map((reply) => (
        <div className="reply-container" key={reply.id}>
          <span className="name">{reply.name}</span>
          {editing.type === 'reply' && editing.id === reply.id ? (
            <div>
              <input
                className="input"
                type="text"
                value={editing.text}
                onChange={(e) => setEditing({ ...editing, text: e.target.value })}
              />
              <button
                className="button"
                onClick={() => editReply(comment.id, reply.id, editing.text)}
              >
                Save Reply
              </button>
            </div>
          ) : (
            <p className="comment-text">{reply.comment}</p>
          )}
          <span className="timestamp">{reply.timestamp}</span>
          <div className="actions-container">
            {editing.type !== 'reply' && (
              <button
                className="action-button"
                onClick={() => setEditing({ type: 'reply', id: reply.id, text: reply.comment, commentId: comment.id })}
              >
                Edit Reply
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container">
      <input
        className="input"
        type="text"
        placeholder="Your Name"
        value={currentName}
        onChange={(e) => setCurrentName(e.target.value)}
      />
      <input
        className="input"
        type="text"
        placeholder="Your Comment"
        value={currentComment}
        onChange={(e) => setCurrentComment(e.target.value)}
      />
      <button className="button" onClick={addComment}>
        Post Comment
      </button>
      {comments.map(renderCommentItem)}
    </div>
  );
};

export default CommentSection;
