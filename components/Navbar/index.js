'use client'
import React from "react";

import { useState } from "react";
import { MagicTabSelect } from "react-magic-motion";

const underlineTabs = ["Productos", "Ordenes", "Envios"];

const UnderlineTabs = () => {
  const [selectedIndex, setSelectedIndex] = useState(1);

  const tabsComponents = underlineTabs.map((text, i) => {
    return (
      <button
        type="button"
        key={`tab-${text}`}
        onClick={() => setSelectedIndex(i)}
        style={{
          border: 0,
          cursor: "pointer",
        }}
        className="bg-slate-800 p-3 rounded-md my-2 text-white"
      >
        {text}

        {selectedIndex === i && (
          <div style={{ position: "relative", transform: "translateY(3px)" }}>
            <MagicTabSelect
              id="underline"
              transition={{ type: "spring", bounce: 0.3 }}

            >
              <div
                style={{
                  width: "100%",
                  height: "0.15rem",
                  backgroundColor: "white",
                  position: "absolute",
                }}
              />
            </MagicTabSelect>
          </div>
        )}
      </button>
    );
  });

  return <div style={{ display: "flex", gap: "0.5rem" }}>{tabsComponents}</div>;
};

export const NavbarComponent = () => {
  return (
    <div className=" w-screen flex justify-center  bg-black">
        <div className="font-sans text-white capitalize text-3xl m-2">
            Onfit dashboard
        </div>
        <div className="flex-1" />
      <UnderlineTabs />
        <div className="flex-1" />

    </div>
  );
};
