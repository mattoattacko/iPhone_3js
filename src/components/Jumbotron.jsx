import React from 'react';
import Iphone from '../assets/images/iphone-14.jpg';
import HoldingIphone from '../assets/images/iphone-hand.png';

const Jumbotron = () => {

  // Scroll to section
  const handleLearnMore = () => {
    const element = document.querySelector('.sound-section');
    // we want to take the top position of the element and scroll down
    // if the element is undefined, don't execute the getBoundingClientRect() method. We do this to avoid errors.
    window.scrollTo({
      top: element?.getBoundingClientRect().top,
      left: 0,
      behavior: 'smooth'
    });
  }

  return (

    <div className="jumbotron-section wrapper">
      <h2 className="title">
        New
      </h2>

      <img 
        src={Iphone}
        alt='New iPhone 14'
      />

      <p className='text'>
        Big and bigger.
      </p>

      <span className='description'>
        From $42.69/mo. for 24mo. or $999 with trade‑in.
      </span>

      <ul className='links'>
        <li>
          <button className='button'>
            Buy
          </button>
        </li>        
        <li>
          <a 
            className='link'
            onClick={handleLearnMore}
          >
            Learn more
          </a>
        </li>
      </ul>

      <img 
        src={HoldingIphone}
        alt='Holding iPhone'
        className='iphone-img'
      />
    </div>
  )
}

export default Jumbotron