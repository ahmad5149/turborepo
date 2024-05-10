import React from 'react';
import '../../contents/scss/faq.scss';

function Faq({ index, item, id }) {
  return (
    <div className='accordion-item' key={index}>
      <h2 className='accordion-header' id={`heading-${index}`}>
        <button
          className='accordion-button collapsed'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target={`#collapse-${index}`}
          aria-expanded='true'
          aria-controls={`collapse-${index}`}
        >
          {item.heading}
        </button>
      </h2>
      <div
        id={`collapse-${index}`}
        className='accordion-collapse collapse'
        aria-labelledby={`heading-${index}`}
        data-bs-parent={id}
        // data-bs-parent='#accordionExample'
      >
        <div className='accordion-body'>
          <p>{item.description}</p>
        </div>
      </div>
    </div>
  );
}

export default Faq;
