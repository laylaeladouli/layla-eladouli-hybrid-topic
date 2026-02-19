"use client";

import {Canvas, useFrame, useLoader} from "@react-three/fiber";
import {CameraControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import {useRef} from "react";
import Marker, {countries} from "./marker";


function Earth() {

    const texture = useLoader(THREE.TextureLoader, "/earth.jpg");
    const earthRef = useRef<THREE.Mesh>(null!);

    // This runs on every frame (animation loop)
    useFrame(() => {
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.0002; // speed of rotation
        }
    });

    return (
        <mesh ref={earthRef}>
            <sphereGeometry args={[2.5, 64, 64]} />
            <meshStandardMaterial map={texture} />

            {countries.map((country) => (
                <Marker
                    key={country.name}
                    name={country.name}
                    lat={country.lat}
                    lng={country.lng}
                />
            ))}

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

                <CameraControls />
            </Canvas>
        </div>
    );
}
