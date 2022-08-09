import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { MockList } from "@graphql-tools/mock";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import faker from "faker";
import { ImageContentType } from "./generated/globalTypes";
import AutoMockedProvider from "./utils/AutoMockedProvider";
import Products, { PRODUCTS_QUERY } from "./Products";

const mocks = [
  {
    request: {
      query: PRODUCTS_QUERY,
      variables: {
        preferredContentType: ImageContentType.JPG,
      },
    },
    result: {
      data: {
        products: {
          edges: [
            {
              node: {
                id: "123",
                title: "Nike Shoes",
                images: {
                  edges: [
                    {
                      node: {
                        id: "456",
                        transformedSrc: "https://www.images.com/shoe.jpg",
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
  },
];

it("renders with MockedProvider", async () => {
  const { findByText, getByText } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Products />
    </MockedProvider>
  );

  expect(getByText("Loading products...")).toBeInTheDocument();

  const productTag = await findByText("Nike Shoes");
  expect(productTag).toBeInTheDocument();
});

it("renders with AutoMockedProvider", async () => {
  const mockResolvers = (store: any) => ({
    Product: () => ({
      title: "Nike Shoes",
      images: () => ({
        edges: () => new MockList([0, 3]),
      }),
    }),
    Image: () => ({
      transformedSrc: (_: any, { preferredContentType }: any) =>
        `https://images.com/cat.${preferredContentType.toLowerCase()}`,
    }),
  });

  const { findByText, getByText } = render(
    <AutoMockedProvider mockResolvers={mockResolvers}>
      <Products />
    </AutoMockedProvider>
  );

  expect(getByText("Loading products...")).toBeInTheDocument();

  const productTag = await findByText("Nike Shoes");
  expect(productTag).toBeInTheDocument();
});

it("matches snapshot using seeds", async () => {
  faker.seed(123);

  const mockResolvers = (store: any) => ({
    URL: () => "https://www.shopify.com",
    ID: () => faker.random.uuid(),
  });

  const { findByTestId, asFragment } = render(
    <AutoMockedProvider mockResolvers={mockResolvers}>
      <Products />
    </AutoMockedProvider>
  );

  await findByTestId("result");
  expect(asFragment()).toMatchSnapshot();
});
