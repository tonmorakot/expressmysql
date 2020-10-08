const bcryptjs = require("bcryptjs");
const model = require("../models/index");

exports.index = async (req, res, next) => {
  // res.send("respond with a resource");

  // const users = await model.User.findAll();

  // const users = await model.User.findAll({
  //   attributes: ['id','name','email','created_at'],
  //   order: [['id','desc']]
  // });

  // const users = await model.User.findAll({
  //   attributes: { exclude: 'password' },
  //   where: {
  //     email: 'tonmorakot@gmail.com'
  //   },
  //   order: [['id','desc']]
  // });

  // const users = await model.User.findAll({
  //   attributes: ['id','name',['email','username'],'created_at'],
  //   order: [['id','desc']]
  // });

  // const sql = `select id,name,email from users`;
  // const users = await model.sequelize.query(sql, {
  //   type: model.sequelize.QueryTypes.SELECT,
  // });

  const users = await model.User.findAll({
    attributes: { exclude: ["password"] },
    include: [
      {
        model: model.Blog,
        as: "blogs",
        attributes: ["id", "title"],
      },
    ],
    order: [
      ["id", "desc"],
      ["blogs", "id", "desc"],
    ],
  });

  res.status(200).json({
    data: users,
  });
};

exports.show = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await model.User.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      const error = new Error("ไม่พบข้อมูล");
      error.statusCode = 404;
      throw error;
    }

    const check = await bcryptjs.compare("aaddaa", user.password);

    res.status(200).json({
      data: user,
      pass: check,
    });
  } catch (error) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
      },
    });
  }
};

exports.insert = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    //check email ซ้ำ
    const existEmail = await model.User.findOne({
      where: {
        email: email,
      },
    });

    if (existEmail) {
      const error = new Error(
        "อีเมลนี้มีผู้ใช้ในระบบแล้ว กรุณาเปลี่ยนอีเมลใหม่"
      );
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcryptjs.genSalt(8);
    const passwordHash = await bcryptjs.hash(password, salt);

    // การเพิ่มข้อมูล
    const user = await model.User.create({
      name: name,
      email: email,
      password: passwordHash,
    });

    res.status(201).json({
      message: "เพิ่มข้อมูลเรียบร้อยแล้ว",
      data: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
      },
    });
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id, name, email, password } = req.body;

    const salt = await bcryptjs.genSalt(8);
    const passwordHash = await bcryptjs.hash(password, salt);

    // การแก้ไขข้อมูล
    const user = await model.User.update(
      {
        name: name,
        email: email,
        password: passwordHash,
      },
      {
        where: {
          id: id,
        },
      }
    );

    res.status(201).json({
      message: "แก้ไขข้อมูลเรียบร้อยแล้ว",
    });
  } catch (error) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
      },
    });
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await model.User.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      const error = new Error("ไม่พบผู้ใช้ในระบบ ไม่สามารถลบข้อมูลได้");
      error.statusCode = 400;
      throw error;
    }

    // การแก้ไขข้อมูล
    await model.User.destroy({
      where: {
        id: id,
      },
    });

    res.status(200).json({
      message: "ลบข้อมูลเรียบร้อยแล้ว",
    });
  } catch (error) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
      },
    });
  }
};
