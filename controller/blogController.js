const model = require("../models/index");

// exports.index = (req, res, next) => {
//   // res.send("respond with a resource");
//   res.status(200).json({
//       message: "ดึงข้อมูล blog ทั้งหมด"
//   })
// };

exports.index = async (req, res, next) => {

  const blogs = await model.Blog.findAll({
    include: [
      {
        model: model.User,
        as: "user",
        attributes: ["id", "name"],
      },
    ],
    order: [
      ["id", "desc"],
    ],
  });

  res.status(200).json({
    data: blogs,
  });
};
