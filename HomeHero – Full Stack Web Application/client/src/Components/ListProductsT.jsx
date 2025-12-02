import React from "react";
const ListProducts = () => {
  return (
    <div>
      <button
        onClick={() => handleUpdate(product._id)}
        className="btn btn-primary"
      >
        Update
      </button>
    </div>
  );
};

export default ListProducts;
