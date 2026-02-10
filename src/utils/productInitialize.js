export const getDefaultListingData = () => ({
  categoryId: null,
  subCategoryOneId: null,
  subCategoryTwoId: null,
  brandId: null,

  images: {
    mainImage: null,
    galleryImages: [],
    videos: []
  },

  type: "simple",

  name: "",
  sku: "",
  status: "Active",

  regularPrice: "",
  salePrice: "",
  productPrice: "",
  commissionRate: "",
  commissionAmount: "",
  gstAmount: "",
  tcsAmount: "",
  shippingCharge: "",

  minOrderQuantity: 1,
  stockQty: "",
  minStockQty: "",

  fulfillmentBy: "",
  procurementType: "",
  procurementSLA: "",
  shippingProvider: "",

  packageLength: 0,
  packageBreadth: 0,
  packageHeight: 0,
  packageWeight: 0,

  hsn: "",
  luxuryCess: "",
  taxCode: "",

  countryOfOrigin: "",
  manufacturerDetails: "",
  packerDetails: "",
  importerDetails: "",

  productDetails: [],
  description: "",
  more: "",

  specifications: [],
  attributes: []
});
