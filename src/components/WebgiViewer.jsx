import React, {
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useEffect
} from 'react' //useRef hook gets us the reference to an HTML element and then lets us do DOM manipulation on the reference.

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

  const canvasRef = useRef(null);
  const [viewerRef, setViewerRef] = useState(null)
  const [targetRef, setTargetRef] = useState(null)
  const [cameraRef, setCameraRef] = useState(null)
  const [positionRef, setPositionRef] = useState(null)

  //useImperativeHandle lets us expose the canvasRef to the parent component
  useImperativeHandle(ref, () => ({
    triggerPreview() {
      gsap.to(positionRef, {
        x: 13.04,
        y: -2.01,
        z: 2.29,
        duration: 2,
        onUpdate: () => {
          viewerRef.setDirty(); //basically just means the camera and the viewer need to be updated
          cameraRef.positionTargetUpdated(true); //position of the target has been updated
        }
      });

      gsap.to(targetRef, {
        x: 0.11,
        y: 0.0,
        z: 0.0,
        duration: 2,
      })
    }
  }));

  //using a callback to cache and memoize so we dont recreate the animation function on every render
  const memoizedScrollAnimation = useCallback((position, target, onUpdate) => {
    //check if the position, target, onUpdate exist
    if(position, target, onUpdate) {
      scrollAnimation(position, target, onUpdate);
    }
  }, []);

  const setupViewer = useCallback(async () => {
    // Initialize the viewer
    const viewer = new ViewerApp({
      canvas: canvasRef.current,
    })

    setViewerRef(viewer);//set the viewerRef to the viewer

    // Add some plugins
    const manager = await viewer.addPlugin(AssetManagerPlugin)

    //get active camera
    // allows us to access the position and the target of the camera
    const camera = viewer.scene.activeCamera;
    const position = camera.position;
    const target = camera.target;
    //changing the view target and position is what gives us the 3d rotation effect

    setCameraRef(camera);
    setPositionRef(position);
    setTargetRef(target);

    // Add plugins individually.
    await viewer.addPlugin(GBufferPlugin)
    await viewer.addPlugin(new ProgressivePlugin(32))
    await viewer.addPlugin(new TonemapPlugin(true))
    await viewer.addPlugin(GammaCorrectionPlugin)
    await viewer.addPlugin(SSRPlugin)
    await viewer.addPlugin(SSAOPlugin)
    await viewer.addPlugin(BloomPlugin)

    // This must be called once after all plugins are added.
    viewer.renderer.refreshPipeline()

    await manager.addFromPath("scene-black.glb");

    viewer.getPlugin(TonemapPlugin).config.clipBackground = true;

    // disable controls once we load the viewer
    viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

    // whenever we reload the website, we want the position to be on top
    window.scrollTo(0, 0);

    // only update the position and target under certain conditions
    let needsUpdate = true;

    // update camera view
    const onUpdate = () => {
      needsUpdate = true;
      viewer.setDirty(); //basically just means the camera and the viewer need to be updated
    }

    // add a listener to update the camera position and target
    viewer.addEventListener('preFrame', () => {
      if (needsUpdate) {
        camera.positionTargetUpdated(true);
        needsUpdate = false;
      }
    });

    memoizedScrollAnimation(position, target, onUpdate);
  }, []);

  // Run setupViewer once when the component is mounted
  useEffect(() => {
    setupViewer();
  }, []);


  return (
    <div id='webgi-canvas-container'>
      <canvas
        id='webgi-canvas'
        ref={canvasRef}
      />
    </div>
  )
})

export default WebgiViewer

//we need to use gsap to change the position of the camera