import gsap from 'gsap';

//every time we edit the parameters of the camera, we want to call the onUpdate method to update it and re-render
export const scrollAnimation = (position, target, onUpdate) => {
  const timeLine = gsap.timeline();

  timeLine.to(position, {
    x: -3.38,
    y: -10.74,
    z: -5.93 ,
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
    x: 1.52,
    y: 0.77,
    z: -1.08,
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
    x: 1.56,
    y: 5.0,
    z: 0.01 ,
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
    x: -0.55,
    y: 0.32,
    z: 0,
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