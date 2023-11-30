import React from "react";

const EditBlogPage = ({ params }: { params: { id: string } }) => {
  console.log(1);
  console.log(params.id);
  return <div>EditBlogPage</div>;
};

export default EditBlogPage;
