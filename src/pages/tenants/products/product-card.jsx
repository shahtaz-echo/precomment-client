import { imgMinified } from "@/lib/minified";
import React from "react";
import { Link } from "react-router";

const ProductCard = ({ data }) => {
  return (
    <Link to={data?.url} target="_blank">
      <div className="h-48 mb-4">
        <img
          src={imgMinified(data?.image_url)}
          alt={data?.name}
          className="w-full h-full border object-contain"
        />
      </div>
      <h4 className="text-lg font-medium">{data?.name}</h4>
      <p className="text-muted-foreground line-clamp-2">{data?.description}</p>
    </Link>
  );
};

export default ProductCard;
