import React from 'react'

const SoundSection = () => {

  const handleLearnMore = () => {
    //need to get reference to the last section
    const element = document.querySelector('.display-section');

    window.scrollTo({
      top: element?.getBoundingClientRect().bottom,
      left: 0,
      behavior: 'smooth'
    });
  }

  return (
    <div className='sound-section wrapper'>
      <div className='body'>
        <div className='sound-section-content content'>
          <h2 className='title'>
            New Sound System
          </h2>

          <p className='text'>
            Feel the bass.
          </p>

          <span className='description'>
            From $42.69/mo. for 24mo. or $999 with trade‑in.
          </span>

          <ul className='links'>
            <li className=''>
              <button className='button'>
                Buy
              </button>
            </li>

            <li>
              <a className='link' onClick={handleLearnMore}>
                Learn more
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SoundSection