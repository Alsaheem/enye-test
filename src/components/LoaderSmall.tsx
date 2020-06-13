import React from "react";
import "./LoadingSmall.css";

export default function LoaderSmall() {
  return (
    <>
      <div className="spinner">
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
      </div>
    </>
  );
}
