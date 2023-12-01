import React from "react";

const EditPostModal = ({ params }: { params: { id: string } }) => {
  console.log(2);
  return (
    <div>
      <p>EditPostModal</p>
      {params.id}
    </div>
  );
};

export default EditPostModal;
