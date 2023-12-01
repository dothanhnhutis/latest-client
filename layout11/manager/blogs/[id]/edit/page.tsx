import React from "react";

const PostDetail = ({ params }: { params: { id: string } }) => {
  console.log(1);
  console.log(params);
  return <div>PostDetail</div>;
};

export default PostDetail;
