import React, {
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useEffect
} from 'react'; //useRef hook gets us the reference to an HTML element and then lets us do DOM manipulation on the reference.

import {
  ViewerApp,
  AssetManagerPlugin,
  GBufferPlugin,
  ProgressivePlugin,
  TonemapPlugin,
  SSRPlugin,
  SSAOPlugin,
  BloomPlugin,
  GammaCorrectionPlugin,
  mobileAndTabletCheck,
} from "webgi";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollAnimation } from '../lib/scroll-animation';

//animation that triggers when the user scrolls down
//here we define what is the function we will trigger from the App component
gsap.registerPlugin(ScrollTrigger);

const WebgiViewer = forwardRef((props, ref) => {
  
  const [viewerRef, setViewerRef] = useState(null);
  const [targetRef, setTargetRef] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [positionRef, setPositionRef] = useState(null);
  //check if we are on a mobile device
  const [isMobile, setIsMobile] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);  //this is used to determine if we are in preview mode or not so that we can close it out
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);

  //useImperativeHandle lets us expose the canvasRef to the parent component
  useImperativeHandle(ref, () => ({
    triggerPreview() {
      setPreviewMode(true);
      canvasContainerRef.current.style.pointerEvents = 'all'; //allows us to interact with the canvas
      props.contentRef.current.style.opacity = '0';

      gsap.to(positionRef, {
        x: 13.04,
        y: -2.01,
        z: 2.29,
        duration: 2,
        onUpdate: () => {
          viewerRef.setDirty(); //basically just means the camera and the viewer need to be updated
          cameraRef.positionTargetUpdated(true); //position of the target has been updated
        },
      });
      gsap.to(targetRef, { x: 0.11, y: 0.0, z: 0.0, duration: 2 });

      // set and enable the 3d model to be rotated
      viewerRef.scene.activeCamera.setCameraOptions({ controlsEnabled: true });
    },
  }));

  //using a callback to cache and memoize so we dont recreate the animation function on every render
  const memoizedScrollAnimation = useCallback((position, target, isMobile, onUpdate) => {
    //check if the position, target, onUpdate exist
    if (position && target && onUpdate) {
      scrollAnimation(position, target, isMobile, onUpdate);
    }
  }, []);

  const setupViewer = useCallback(async () => {
    // Initialize the viewer
    const viewer = new ViewerApp({
      canvas: canvasRef.current,
    });

    setViewerRef(viewer);//set the viewerRef to the viewer

    // check if mobile
    const isMobileOrTablet = mobileAndTabletCheck();
    setIsMobile(isMobileOrTablet);

    // Add some plugins
    const manager = await viewer.addPlugin(AssetManagerPlugin);

    //get active camera
    // allows us to access the position and the target of the camera
    const camera = viewer.scene.activeCamera;
    const position = camera.position;
    const target = camera.target;
    //changing the view target and position is what gives us the 3d rotation effect

    setTargetRef(target);
    setPositionRef(position);
    setCameraRef(camera);

    // Add plugins individually.
    await viewer.addPlugin(GBufferPlugin);
    await viewer.addPlugin(new ProgressivePlugin(32));
    await viewer.addPlugin(new TonemapPlugin(true));
    await viewer.addPlugin(GammaCorrectionPlugin);
    await viewer.addPlugin(SSRPlugin);
    await viewer.addPlugin(SSAOPlugin);
    await viewer.addPlugin(BloomPlugin);

    // This must be called once after all plugins are added.
    viewer.renderer.refreshPipeline();

    await manager.addFromPath("scene-black.glb");

    viewer.getPlugin(TonemapPlugin).config.clipBackground = true;

    // disable controls once we load the viewer
    viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

    //if it is a mobile device
    if (isMobileOrTablet) {
      position.set(-16.7, 1.17, 11.7);
      target.set(0, 1.37, 0);
      props.contentRef.current.className = 'mobile-or-tablet'; //using this class we will hide elements that are not needed on mobile
    }





    // update camera view
    const onUpdate = () => {
      needsUpdate = true;
      viewer.setDirty(); //basically just means the camera and the viewer need to be updated
    };
    // whenever we reload the website, we want the position to be on top
    window.scrollTo(0, 0);
    // only update the position and target under certain conditions
    let needsUpdate = true;
    // add a listener to update the camera position and target
    viewer.addEventListener('preFrame', () => {
      if (needsUpdate) {
        camera.positionTargetUpdated(true);
        needsUpdate = false;
      }
    });

    memoizedScrollAnimation(position, target, isMobileOrTablet, onUpdate);
  }, []);

  // Run setupViewer once when the component is mounted
  useEffect(() => {
    setupViewer();
  }, []);

  // EXIT BUTTON //
  //when the user clicks the exit button, we want to exit the preview mode
  const handleExit = useCallback(() => {
    canvasContainerRef.current.style.pointerEvents = 'none';
    
    viewerRef.scene.activeCamera.setCameraOptions({ controlsEnabled: false });
    props.contentRef.current.style.opacity = '1';
    // reposition the iphone back to its OG position
    gsap.to(positionRef, {
        x: !isMobile ? 1.56 : 9.36,
        y: !isMobile ? 5.0 : 10.95,
        z: !isMobile ? 0.01 : 0.09,
        // scrollTrigger: {
        //   trigger: '.display-section',
        //   start: 'top bottom',
        //   end: 'top top',
        //   scrub: 2,
        //   immediateRender: false,
        // },
        onUpdate: () => {
          viewerRef.setDirty(); //basically just means the camera and the viewer need to be updated
          cameraRef.positionTargetUpdated(true); //position of the target has been updated
        },
      });
    gsap.to(targetRef, {
      x: !isMobile ? -0.55 : -1.62,
      y: !isMobile ? 0.32 : 0.02,
      z: !isMobile ? 0.0 : -0.06,
      // scrollTrigger: {
      //   trigger: '.display-section',
      //   start: 'top bottom',
      //   end: 'top top',
      //   scrub: 2,
      //   immediateRender: false,
      // },
    });

    setPreviewMode(false);
  }, [canvasContainerRef, viewerRef, positionRef, cameraRef, targetRef]);

  const setupCamera = useCallback(() => {
    const camera = viewerRef.scene.activeCamera;
    const position = camera.position;
    const target = camera.target;
  
    setTargetRef(target);
    setPositionRef(position);
    setCameraRef(camera);
  }, [viewerRef]);
  
  return (
    <div
      id='webgi-canvas-container'
      ref={canvasContainerRef}
    >
      <canvas
        id='webgi-canvas'
        ref={canvasRef}
      />
      {/* if we are in preview mode, click the button to exit */}
      {previewMode && (
        <button
          className='button'
          onClick={handleExit}
        >
          Exit
        </button>
      )}
    </div>
  );
});

export default WebgiViewer;

//we need to use gsap to change the position of the camera