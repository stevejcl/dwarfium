import React from "react";
import ImageEditor from "@/components/ImageEditor";

const Editor: React.FC = () => {
  return (
    <section className="daily-horp d-inline-block w-100">
      <div className="container">
        <div className="page-container">
          <h1 className="page-title">Image Editor</h1>
          <ImageEditor />
        </div>
      </div>
    </section>
  );
};

export default Editor;
