/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeCategory
// ====================================================

export interface seeCategory_seeCategory_photos {
  __typename: "CoffeeShopPhoto";
  id: number | null;
  url: string | null;
}

export interface seeCategory_seeCategory_wholeCategories {
  __typename: "Category";
  id: number | null;
  name: string | null;
}

export interface seeCategory_seeCategory {
  __typename: "CoffeeShop";
  id: number | null;
  name: string | null;
  latitude: string | null;
  longitude: string | null;
  photos: (seeCategory_seeCategory_photos | null)[] | null;
  wholeCategories: (seeCategory_seeCategory_wholeCategories | null)[] | null;
}

export interface seeCategory {
  seeCategory: (seeCategory_seeCategory | null)[] | null;
}

export interface seeCategoryVariables {
  categoryId: number;
  cursor?: number | null;
}
