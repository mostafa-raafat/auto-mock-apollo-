import React from "react";
import { useQuery } from "@apollo/client";

import gql from "graphql-tag";
import { ImageContentType } from "./generated/globalTypes";

export const PRODUCTS_QUERY = gql`
  query ProductsData($preferredContentType: ImageContentType) {
    products(first: 10) {
      edges {
        node {
          id
          title
          images(first: 3) {
            edges {
              node {
                id
                transformedSrc(
                  maxWidth: 150
                  maxHeight: 100
                  preferredContentType: $preferredContentType
                )
              }
            }
          }
        }
      }
    }
  }
`;

export default function Products() {
  const { data, error, loading } = useQuery(PRODUCTS_QUERY, {
    variables: { preferredContentType: ImageContentType.JPG },
  });

  console.log({ error, data, loading });

  if (error) {
    return <div>Error loading products...</div>;
  }
  if (loading || !data) {
    return <div>Loading products...</div>;
  }

  return (
    <div data-testid="result">
      {data.products.edges.map(({ node: product }: any) => (
        <div key={product.id}>
          <h2>{product.title}</h2>
          <p>ID {product.id}</p>

          <ul className="images">
            {product.images.edges.map(({ node: image }: any, index: number) => (
              <li className="image-item" key={image.id || index}>
                <img src={image.transformedSrc} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
