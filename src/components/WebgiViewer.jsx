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

const WebgiViewer = () => {

  const canvasRef = useRef(null);

  const setupViewer = useCallback(async () => {
    // Initialize the viewer
    const viewer = new ViewerApp({
      canvas: canvasRef.current,
    })

    // Add some plugins
    const manager = await viewer.addPlugin(AssetManagerPlugin)

    //get active camera
    // allows us to access the position and the target of the camera
    const camera = viewer.scene.activeCamera;
    const position = camera.position;
    const target = camera.target;
    //changing the view target and position is what gives us the 3d rotation effect

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

    // add a listener to update the camera position and target
    viewer.addEventListener('preFrame', () => {
      if (needsUpdate) {
        camera.positionTargetUpdated(true);
        needsUpdate = false;
      }

    });
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
}

export default WebgiViewer