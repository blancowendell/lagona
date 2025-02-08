var roleacess = [
  {
    role: "Admin",
    routes: [
      {
        layout: "AdminIndexLayout",
      },
      {
        layout: "AdminHubsLayout",
      },
      {
        layout: "AdminLoadingStationLayout",
      },
      {
        layout: "AdminRidersLayout",
      },
      {
        layout: "AdminMerchantsLayout",
      },
      {
        layout: "AdminShareholdersLayout",
      },
      // {
      //   layout: "announcementslayout",
      // },
      // {
      //   layout: "pendingapplicationlayout",
      // },
      // {
      //   layout: "calendarlayout",
      // },
      // {
      //   layout: "questionslayout",
      // },
      // {
      //   layout: "scholarshiplayout",
      // },
      // {
      //   layout: "approvedapplicationlayout",
      // },
      // {
      //   layout: "master_gradeslayout",
      // },
    ],
  },
  {
    role: "Merchant",
    routes: [
      {
        layout: "MerchantIndexLayout",
      },
      {
        layout: "MerchantProductsLayout",
      },
      {
        layout: "MerchantCategoryLayout",
      },
      {
        layout: "MerchantProductsLayout",
      },
      {
        layout: "MerchantComboLayout",
      },
      {
        layout: "MerchantSoloLayout",
      },
      {
        layout: "MerchantItemLayout",
      },
      {
        layout: "MerchantExtraLayout",
      },
      {
        layout: "MerchantInventoryLayout",
      },
      {
        layout: "MerchantOrdersLayout",
      },
      // {
      //   layout: "scholarshiplayout",
      // },
      // {
      //   layout: "approvedapplicationlayout",
      // },
      // {
      //   layout: "master_gradeslayout",
      // },
    ],
  },
  // {
  //   role: "STUDENT",
  //   routes: [
  //     {
  //       layout: "studentindexlayout",
  //     },
  //     {
  //       layout: "studentprofilelayout",
  //     },
  //     {
  //       layout: "finishapplicationlayout",
  //     },
  //     {
  //       layout: "testpermitlayout",
  //     },
  //     // {
  //     //   layout: "ojtreqabsentlayout",
  //     // },
  //     // {
  //     //   layout: "ojtprofilelayout",
  //     // },
  //   ],
  // },
];


exports.AdminValidator = function (req, res, layout) {

  let ismatch = false;
  let counter = 0;
  if (req.session.accesstype == "Admin" && layout == "IndexLayout") {
    console.log("hit");
    return res.render(`${layout}`, {
      image: req.session.image,
      admin_id: req.session.admin_id,
      fullname: req.session.fullname,
      role_type: req.session.role_type,
      status: req.session.status,
    });
  } else {
    roleacess.forEach((key, item) => {
      counter += 1;
      var routes = key.routes;

      routes.forEach((value, index) => {

        if (key.role == req.session.role_type && value.layout == layout) {
          console.log("Role: ", req.session.role_type, "Layout: ", layout);
          ismatch = true;

          return res.render(`${layout}`, {
            image: req.session.image,
            admin_id: req.session.admin_id,
            fullname: req.session.fullname,
            role_type: req.session.role_type,
            status: req.session.status,
          });
        }
      });

      if (counter == roleacess.length) {
        if (!ismatch) {
          res.redirect("/AdminLogin");
        }
      }
    });
  }
};

exports.MerchantValidator = function (req, res, layout) {

  let ismatch = false;
  let counter = 0;
  if (req.session.accesstype == "Merchant" && layout == "MerchantIndex") {
    console.log("hit");
    return res.render(`${layout}`, {
      image: req.session.image,
      merchant_id: req.session.merchant_id,
      merchant_code: req.session.merchant_code,
      fullname: req.session.fullname,
      role_type: req.session.role_type,
      status: req.session.status,
    });
  } else {
    roleacess.forEach((key, item) => {
      counter += 1;
      var routes = key.routes;

      routes.forEach((value, index) => {

        if (key.role == req.session.role_type && value.layout == layout) {
          console.log("Role: ", req.session.role_type, "Layout: ", layout);
          ismatch = true;

          return res.render(`${layout}`, {
            image: req.session.image,
            merchant_id: req.session.merchant_id,
            merchant_code: req.session.merchant_code,
            fullname: req.session.fullname,
            role_type: req.session.role_type,
            status: req.session.status,
          });
        }
      });

      if (counter == roleacess.length) {
        if (!ismatch) {
          res.redirect("/MerchantLogin");
        }
      }
    });
  }
};


// exports.UserValidator = function (req, res, layout) {
//   // console.log(layout);

//   let ismatch = false;
//   let counter = 0;
//   // //console.log(roleacess.length)
//   if (req.session.accesstype == "STUDENT" && layout == "studentindexlayout") {
//     console.log("hit");
//     return res.render(`${layout}`, {
//       image: req.session.image,
//       studentid: req.session.studentid,
//       fullname: req.session.fullname,
//       accesstype: req.session.accesstype,
//       status: req.session.status,
//     });
//   } else {
//     roleacess.forEach((key, item) => {
//       counter += 1;
//       var routes = key.routes;

//       routes.forEach((value, index) => {
//         // console.log(`${key.role} - ${value.layout}`);

//         if (key.role == req.session.accesstype && value.layout == layout) {
//           console.log("Role: ", req.session.accesstype, "Layout: ", layout);
//           ismatch = true;

//           return res.render(`${layout}`, {
//             image: req.session.image,
//             studentid: req.session.studentid,
//             fullname: req.session.fullname,
//             accesstype: req.session.accesstype,
//             status: req.session.status,
//           });
//         }
//       });

//       if (counter == roleacess.length) {
//         if (!ismatch) {
//           res.redirect("/login");
//         }
//       }
//     });
//   }
// };



