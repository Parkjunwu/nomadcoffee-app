/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeCoffeeShops
// ====================================================

export interface seeCoffeeShops_seeCoffeeShops_user {
  __typename: "User";
  username: string;
  avatarURL: string | null;
  isMe: boolean;
  isFollowing: boolean | null;
}

export interface seeCoffeeShops_seeCoffeeShops_photos {
  __typename: "CoffeeShopPhoto";
  id: number | null;
  url: string | null;
}

export interface seeCoffeeShops_seeCoffeeShops_wholeCategories {
  __typename: "Category";
  id: number | null;
  name: string | null;
}

export interface seeCoffeeShops_seeCoffeeShops {
  __typename: "CoffeeShop";
  id: number | null;
  name: string | null;
  latitude: string | null;
  longitude: string | null;
  user: seeCoffeeShops_seeCoffeeShops_user | null;
  photos: (seeCoffeeShops_seeCoffeeShops_photos | null)[] | null;
  wholeCategories: (seeCoffeeShops_seeCoffeeShops_wholeCategories | null)[] | null;
}

export interface seeCoffeeShops {
  seeCoffeeShops: (seeCoffeeShops_seeCoffeeShops | null)[] | null;
}

export interface seeCoffeeShopsVariables {
  cursor?: number | null;
}
