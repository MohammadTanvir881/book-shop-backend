import { Order } from "./orders.model";

const calculateRevenue = async () => {
  const revenueData = await Order.aggregate([
    {
      $addFields: {
        product: { $toObjectId: "$product" },
      },
    },
    {
      $lookup: {
        from: "books", // Collection name
        localField: "product",
        foreignField: "_id",
        as: "bookDetails",
      },
    },
    { $unwind: "$bookDetails" },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: { $multiply: ["$bookDetails.price", "$quantity"] },
        },
      },
    },
  ]);

  return revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
};

export const totalRevenueIncome = {
  calculateRevenue,
};
