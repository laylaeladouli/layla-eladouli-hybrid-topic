"use client";

import {Canvas, useFrame, useLoader} from "@react-three/fiber";
import {CameraControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import {useRef, useState} from "react";

function latLngToVector3(lat: number, lng: number, radius: number) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
}

function Marker() {
    const position = latLngToVector3(33, -6, 2.6);
    const [showLabel, setShowLabel] = useState(false);

    return (
        <mesh
            position={position}
            scale={0.3}
            onClick={(e) => {
                e.stopPropagation();
                setShowLabel((prev) => !prev);
            }}
            onPointerOver={() => {
                document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
                document.body.style.cursor = "default";
            }}
        >
            {/* Pin Head */}
            <mesh position={[0, 0.1, 0]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="red" />
            </mesh>

            {/* Pin Body */}
            <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.05, 0]}>
                <coneGeometry args={[0.05, 0.2, 16]} />
                <meshStandardMaterial color="red" />
            </mesh>

            {/* Label */}
            {showLabel && (
                <Html
                    position={[0, 0.2, 0]}
                    distanceFactor={8}
                    occlude
                >
                    <div
                        style={{
                            background: "rgba(0,0,0,0.85)",
                            color: "white",
                            padding: "6px 12px",
                            borderRadius: "12px",
                            fontSize: "13px",
                            whiteSpace: "nowrap"
                        }}
                    >
                        Morocco
                    </div>
                </Html>
            )}
        </mesh>
    );
}

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

            <Marker />

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
