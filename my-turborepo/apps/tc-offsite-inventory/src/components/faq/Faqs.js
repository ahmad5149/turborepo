import React from 'react';
import '../../contents/scss/faq.scss';
import Faq from '../faq/Faq';

function Faqs(props) {
  return (
    <div className='faq-grey'>
      <div className='py-5 Faq_container'>
        <h2 className='d-flex justify-content-start pb-3'>FAQ</h2>
        <div className='accordion accordion-faq' id='accordionExample'>
          {props?.faq?.faqInformation?.faqList?.map((item, index) => (
            <Faq index={index} item={item} id={'#accordionExample'} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Faqs;
