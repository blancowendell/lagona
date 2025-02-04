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
        layout: "JasProfilesLayout",
      },
      // {
      //   layout: "institutionslayout",
      // },
      // {
      //   layout: "courseslayout",
      // },
      // {
      //   layout: "master_studentlayout",
      // },
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
  // {
  //   role: "MAYOR",
  //   routes: [
  //     {
  //       layout: "indexlayout",
  //     },
  //     {
  //       layout: "accesslayout",
  //     },
  //     {
  //       layout: "adminuserslayout",
  //     },
  //     {
  //       layout: "institutionslayout",
  //     },
  //     {
  //       layout: "courseslayout",
  //     },
  //     {
  //       layout: "master_studentlayout",
  //     },
  //     {
  //       layout: "announcementslayout",
  //     },
  //     {
  //       layout: "pendingapplicationlayout",
  //     },
  //     {
  //       layout: "calendarlayout",
  //     },
  //     {
  //       layout: "questionslayout",
  //     },
  //     {
  //       layout: "scholarshiplayout",
  //     },
  //     {
  //       layout: "approvedapplicationlayout",
  //     },
  //     {
  //       layout: "master_gradeslayout",
  //     },
  //   ],
  // },
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



