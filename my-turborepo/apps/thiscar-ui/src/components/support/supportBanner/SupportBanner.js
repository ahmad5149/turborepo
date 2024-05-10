import React from "react";
import QuestionSection from "./QuestionSection";
import ChatSection from "./ChatSection";
import "../../../contents/scss/supportBanner.scss";

function SupportBanner(props) {
  return (
    <div className='container-fluid support_page'>
      <div className='row d-flex  justify-content-around py-5'>
        <QuestionSection questionSection={props.questionSection} />
        <ChatSection chatSection={props.chatSection} />
      </div>
    </div>
  );
}

export default SupportBanner;
