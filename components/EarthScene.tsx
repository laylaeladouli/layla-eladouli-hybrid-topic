"use client";

import {Canvas, useLoader} from "@react-three/fiber";
import {OrbitControls, Stars} from "@react-three/drei";
import * as THREE from "three";

function Earth() {

    const texture = useLoader(THREE.TextureLoader, "/earth.jpg");

    return (
        <mesh>
            <sphereGeometry args={[2.5, 64, 64]} />
            <meshStandardMaterial map={texture} />
        </mesh>
    );
}

export default function EarthScene() {

    return (
        <div style={{ height: "600px" }}>
            <Canvas style={{ background: "black" }}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 5, 5]} intensity={2} />
                <directionalLight position={[-5, -3, -5]} intensity={1} />

                <Stars
                    radius={100}
                    depth={50}
                    count={5000}
                    factor={4}
                    fade
                />
                <Earth />

                <OrbitControls />
            </Canvas>
        </div>
    );
}
