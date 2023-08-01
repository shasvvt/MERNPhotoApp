import React, { useState, useRef } from "react";
import { useForm } from "../../hooks/form-hook";
import { VALIDATOR_REQUIRE } from "../../utils/validators";
import "./InteractionModal.css";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Input from "../FormElements/Input";
import Button from "../FormElements/Button";

const InteractionModal = ({ children, onComment, onLike }) => {
  const [show, setShow] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState(false);

  const commentRef = useRef();

  const handleMouseEnter = () => {
    setShow(true);
  };

  const handleMouseLeave = () => {
    setShow(false);
    setShowCommentBox(false);
  };

  const cssClasses = `content ${show ? "contentOpen" : "contentClose"}`;

  const toggleComment = () => {
    setShowCommentBox(prevState => !prevState);
    setComment(null)
  };

  const handleComment = () => {
    let comment = commentRef.current.value;
    // setComment(prevState => commentRef.current.value);
    // console.log(comment);
    onComment(comment);
  }

  const cssClassesComment = `commentContainer ${showCommentBox ? 'commentContainerOpen' : 'commentContainerClose'}`

  return (
    <div
      className="contianer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div className={cssClasses}>
        <span>
          <FavoriteRoundedIcon onClick={onLike}/>
        </span>
        <span>
          <ChatBubbleRoundedIcon onClick={toggleComment} />
        </span>
        {showCommentBox && (
          <div className="commentContianer">
            <input type="text" ref={commentRef} id="comment"/>
            <SendRoundedIcon onClick={handleComment}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractionModal;
