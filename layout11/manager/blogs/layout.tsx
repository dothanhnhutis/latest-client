import React from "react";

const PhotoLayout = (props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) => {
  return (
    <div>
      {props.children}
      {props.modal}
    </div>
  );
};

export default PhotoLayout;
