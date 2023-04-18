import gsap from 'gsap';

//every time we edit the parameters of the camera, we want to call the onUpdate method to update it and re-render
export const scrollAnimation = (position, target, onUpdate, isMobile) => {
  const timeLine = gsap.timeline();

  timeLine.to(position, {
    x: !isMobile ? -3.38 : -7.0, //if mobile, then the x position is -7.0, otherwise -3.38
    y: !isMobile ? -10.74 : -12.2,
    z: !isMobile ? -5.93 : -6.0,
    scrollTrigger: {
      trigger: '.sound-section', //animation triggers in the second section
      start: 'top bottom', //animation starts when the top of the section is at the bottom of the viewport
      end: 'top top', //animation ends when the top of the section is at the top of the viewport
      scrub: 2, //animation delay for better animation scroll
      immediateRender: false, //prevents the animation from running on page load
    },
    onUpdate
  })
  .to(target, {
    x: !isMobile ? 1.52 : 0.7,
    y: !isMobile ? 0.77 : 1.9,
    z: !isMobile ? -1.08 : 0.7,
    scrollTrigger: {
      trigger: '.sound-section', 
      start: 'top bottom', 
      end: 'top top', 
      scrub: 2, 
      immediateRender: false, 
    },
  })
  .to('.jumbotron-section', {
    opacity: 0,
    scrollTrigger: {
      trigger: '.sound-section', 
      start: 'top bottom', 
      end: 'top top', 
      scrub: 2, 
      immediateRender: false, 
    },
  })
  .to('.sound-section-content', {
    opacity: 1,
    scrollTrigger: {
      trigger: '.sound-section', 
      start: 'top bottom', 
      end: 'top top', 
      scrub: 2, 
      immediateRender: false, 
    },
  }).to(position, {
    x: !isMobile ? 1.56 : 9.36,
    y: !isMobile ? 5.0 : 10.95,
    z: !isMobile ? 0.01 : 0.09,
    scrollTrigger: {
      trigger: '.display-section',
      start: 'top bottom', 
      end: 'top top', 
      scrub: 2, 
      immediateRender: false, 
    },
    onUpdate
  })
  .to(target, {
    x: !isMobile ? -0.55 : -1.62,
    y: !isMobile ? 0.32 : 0.02,
    z: !isMobile ? 0.0 : -0.06,
    scrollTrigger: {
      trigger: '.display-section', 
      start: 'top bottom', 
      end: 'top top', 
      scrub: 2, 
      immediateRender: false, 
    },
  }).to('.display-section', {
    opacity: 1,
    scrollTrigger: {
      trigger: '.display-section', 
      start: 'top bottom', 
      end: 'top top', 
      scrub: 2, 
      immediateRender: false, 
    },
  })
}

// all this is very confusing. He starts discussing this section starting around 54'