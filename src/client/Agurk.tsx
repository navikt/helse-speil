import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import { AnimationClip, AnimationMixer, FrontSide, Mesh } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// @ts-ignore
import agurk from './assets/agurk.gltf';

const keys = {
    KeyW: 'forward',
    ArrowUp: 'forward',
    KeyS: 'backward',
    ArrowDown: 'backward',
    KeyA: 'left',
    ArrowLeft: 'left',
    KeyD: 'right',
    ArrowRight: 'right',
};

const usePlayerControls = () => {
    const [movement, setMovement] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false,
    });
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) =>
            setMovement((m) => ({ ...m, [keys[e.code as keyof typeof keys]]: true }));
        const handleKeyUp = (e: KeyboardEvent) =>
            setMovement((m) => ({ ...m, [keys[e.code as keyof typeof keys]]: false }));
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);
    return movement;
};

const Player = () => {
    const { scene, animations } = useLoader<any, any>(GLTFLoader, agurk);
    const mixer = useRef<AnimationMixer>();
    const playerRef = useRef<Mesh>();
    const movement = usePlayerControls();

    const getAnimation = (key: 'walk' | 'idle'): AnimationClip =>
        animations.find((it: AnimationClip) => it.name === key) as AnimationClip;

    useEffect(() => {
        if (animations.length) {
            mixer.current = new AnimationMixer(scene);
            mixer.current!.timeScale = 1.8;
            mixer.current!.clipAction(getAnimation('idle'))?.play();
        }
    }, [animations]);

    useFrame((state, delta) => {
        mixer.current?.update(delta);
        if (movement.forward) {
            playerRef.current?.translateZ(delta);
            mixer.current?.clipAction(getAnimation('walk'))?.play();
        } else if (movement.backward) {
            playerRef.current?.translateZ(-delta);
            mixer.current?.clipAction(getAnimation('walk'))?.play();
        } else {
            mixer.current?.clipAction(getAnimation('walk'))?.stop();
        }

        if (movement.left) {
            playerRef.current!.rotateY(delta * 2);
        } else if (movement.right) {
            playerRef.current!.rotateY(-delta * 2);
        }
    });

    useEffect(() => {
        scene.traverse((child: any) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.side = FrontSide;
            }
        });
    }, [scene]);

    return <primitive ref={playerRef} object={scene} scale={1} />;
};

const Agurk = () => {
    return (
        <Canvas
            shadows
            style={{
                position: 'fixed',
                width: '100vw',
                height: '100vh',
                zIndex: 10000,
                top: 0,
                left: 0,
                pointerEvents: 'none',
            }}
            orthographic
            camera={{ zoom: 100, position: [10, 10, 10] }}
        >
            <React.Suspense fallback={null}>
                <Player />
                <directionalLight position={[5, 20, 15]} />
                <directionalLight position={[10, 10, 10]} />
            </React.Suspense>
        </Canvas>
    );
};

export default Agurk;
