// import { api } from "@/convex/_generated/api";
// import { convexQuery } from "@convex-dev/react-query";
// import { useQuery } from "@tanstack/react-query";

const useCategories = () => {
  // const { data } = useQuery({
  //   ...convexQuery(api.categories.getCategories),
  // });

  const data = [
    {
      id: "all",
      label: "Todas as categorias",
    },
    {
      id: "605196",
      label: "Automotive & Motorcycle",
    },
    {
      id: "602284",
      label: "Baby & Maternity",
    },
    {
      id: "801928",
      label: "Books, Magazines & Audio",
    },
    {
      id: "951432",
      label: "Collectibles",
    },
    {
      id: "605248",
      label: "Fashion Accessories",
    },
    {
      id: "700437",
      label: "Food & Beverages",
    },
    {
      id: "604453",
      label: "Furniture",
    },
    {
      id: "700645",
      label: "Health",
    },
    {
      id: "604968",
      label: "Home Improvement",
    },
    {
      id: "600001",
      label: "Home Supplies",
    },
    {
      id: "600942",
      label: "Household Appliances",
    },
    {
      id: "953224",
      label: "Jewelry Accessories & Derivatives",
    },
    {
      id: "600024",
      label: "Kitchenware",
    },
    {
      id: "824584",
      label: "Luggage & Bags",
    },
    {
      id: "824328",
      label: "Menswear & Underwear",
    },
    {
      id: "602118",
      label: "Pet Supplies",
    },
    {
      id: "856720",
      label: "Pre-Owned",
    },
    {
      id: "603014",
      label: "Sports & Outdoor",
    },
    {
      id: "600154",
      label: "Textiles & Soft Furnishings",
    },
    {
      id: "604579",
      label: "Tools & Hardware",
    },
    {
      id: "604206",
      label: "Toys & Hobbies",
    },
    {
      id: "834312",
      label: "Virtual Products",
    },
    {
      id: "601152",
      label: "Womenswear & Underwear",
    },
  ];

  return {
    data: data,
  };
};

export default useCategories;
