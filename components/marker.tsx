"use client";

import * as THREE from "three";
import {useEffect, useState} from "react";
import {Billboard, Html} from "@react-three/drei";

function latLngToVector3(lat: number, lng: number, radius: number) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
}

export const countries = [
    { name: "Morocco", lat: 33, lng: -6 },
    { name: "Belgium", lat: 50.5, lng: 4.5 },
    { name: "USA", lat: 38, lng: -97 },
    { name: "Spain", lat: 40, lng: -3 },
    { name: "South Korea", lat: 36.5, lng: 127.8 },
];

export default function Marker({
    name, lat, lng, isSelected, onSelect,
}: {
    name: string;
    lat: number;
    lng: number;
    isSelected: boolean;
    onSelect: () => void;
}) {
    const position = latLngToVector3(lat, lng, 2.6);
    const [description, setDescription] = useState<string | null>(null);

    useEffect(() => {
        if (!isSelected) return;
        async function fetchWiki() {
            try {
                const response = await fetch(
                    `https://en.wikipedia.org/api/rest_v1/page/summary/${name}`
                );
                const data = await response.json();
                setDescription(data.extract);
            } catch (error) {
                console.error("Wiki fetch error:", error);
            }
        }
        fetchWiki();
    }, [isSelected, name]);


    return (
        <mesh
            position={position}
            scale={0.3}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
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
            {isSelected && (
                <Billboard follow>
                    <Html position={[0, 0.2, 0]}
                      occlude
                      transform={false}
                >
                    <div
                        style={{background: "rgba(0,0,0,0.85)",
                            color: "white",
                            padding: "6px 12px",
                            borderRadius: "12px",
                            fontSize: "13px",
                            whiteSpace: "normal",
                            width: "300px",
                            lineHeight: "1.5",      //better spacing
                            wordWrap: "break-word", //wrap long words
                            boxSizing: "border-box",
                            wordBreak: "break-word",
                        }}
                    >
                        <strong style={{ display: "block", marginBottom: "8px", fontSize: "9px" }}>{name}</strong>
                        <p style={{ marginTop: "6px", fontSize: "6px" }}>
                            {description ? description : "Loading..."}
                        </p>

                    </div>
                    </Html>
                </Billboard>
            )}
        </mesh>
    );
}