import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import { AnimationAction, AnimationClip, AnimationMixer, FrontSide, LoopOnce, Mesh } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// @ts-ignore
import agurk from './assets/agurk.gltf';

type Animation = 'idle' | 'walk' | 'step' | 'point' | 'turn_head';

type Movement = 'forward' | 'backward' | 'left' | 'right' | 'point';

const keys = {
    KeyW: 'forward',
    ArrowUp: 'forward',
    KeyS: 'backward',
    ArrowDown: 'backward',
    KeyA: 'left',
    ArrowLeft: 'left',
    KeyD: 'right',
    ArrowRight: 'right',
    KeyP: 'point',
};

const usePlayerControls = () => {
    const [movement, setMovement] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false,
        point: false,
    });
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (Object.keys(keys).some((it) => it === e.code)) {
                setMovement((m) => ({ ...m, [keys[e.code as keyof typeof keys]]: true }));
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (Object.keys(keys).some((it) => it === e.code)) {
                setMovement((m) => ({ ...m, [keys[e.code as keyof typeof keys]]: false }));
            }
        };
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

    const getAnimation = (key: Animation): AnimationClip =>
        animations.slice(1).find((it: AnimationClip) => it.name === key) as AnimationClip;

    const playAnimation = (key: Animation): AnimationAction => mixer.current!.clipAction(getAnimation(key)).play();

    const stopAnimation = (key: Animation): AnimationAction => mixer.current!.clipAction(getAnimation(key)).stop();

    const playAnimationOnce = (key: Animation): AnimationAction => {
        const action = mixer.current!.clipAction(getAnimation(key));
        action.clampWhenFinished = true;
        action.setLoop(LoopOnce, 1);
        return action.play();
    };

    const onlyActiveMovement = (key: Movement): boolean => {
        const entries = Object.entries(movement);
        return (
            !!entries.find(([moveKey, moveValue]) => moveKey === key && moveValue) &&
            entries.filter(([moveKey]) => moveKey !== key).every(([_, value]) => !value)
        );
    };

    useEffect(() => {
        if (animations.length) {
            mixer.current = new AnimationMixer(scene);
            mixer.current!.timeScale = 1;
        }
    }, [animations]);

    useFrame((state, delta) => {
        mixer.current?.update(delta);
        if (movement.forward) {
            playerRef.current?.translateZ(delta);
            playAnimation('walk');
            stopAnimation('step');
        } else if (movement.backward) {
            playerRef.current?.translateZ(-delta);
            playAnimation('walk');
            stopAnimation('step');
        } else {
            stopAnimation('walk');
        }

        if (movement.left) {
            playerRef.current!.rotateY(delta * 2);
            if (!movement.forward && !movement.backward) {
                playAnimation('step');
            }
        } else if (movement.right) {
            playerRef.current!.rotateY(-delta * 2);
            if (!movement.forward && !movement.backward) {
                playAnimation('step');
            }
        } else {
            stopAnimation('step');
        }

        if (Object.values(movement).every((it) => !it)) {
            playAnimation('idle');
            playAnimation('turn_head');
        } else {
            stopAnimation('idle');
            stopAnimation('turn_head');
        }

        if (onlyActiveMovement('point')) {
            stopAnimation('idle');
            stopAnimation('turn_head');
            playAnimationOnce('point');
        } else {
            stopAnimation('point');
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
