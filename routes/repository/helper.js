exports.generateUsernameAndPassword = (employee) => {
  try {
    const {
      me_id: employeeid,
      me_firstname: firstname,
      me_lastname: lastname,
      me_birthday: birthday,
    } = employee;

    // const username = (firstname.charAt(0) + lastname).toLowerCase();

    // const password = employeeid + birthday.replace(/-/g, "");

    function sanitizeName(name) {
      return name.replace(/\s+/g, '').replace(/(jr|sr)$/i, '');
    }

    const sanitizedFirstname = sanitizeName(firstname.charAt(0).toLowerCase());
    const sanitizedLastname = sanitizeName(lastname.toLowerCase());


    const username = sanitizedFirstname + sanitizedLastname;
    const password = employeeid + birthday.replace(/-/g, "");

    return { username, password };
  } catch (error) {
    console.log(error);
  }
};

exports.generateUsernameAndPasswordforemployee = (employee) => {
  try {
    const {
      me_id: newEmployeeId,
      me_firstname: firstname,
      me_lastname: lastname,
      me_birthday: birthday,
    } = employee;

    function sanitizeName(name) {
      return name.replace(/\s+/g, '').replace(/(jr|sr)$/i, '');
    }

    const sanitizedFirstname = sanitizeName(firstname.charAt(0).toLowerCase());
    const sanitizedLastname = sanitizeName(lastname.toLowerCase());


    const username = sanitizedFirstname + sanitizedLastname;
    const password = newEmployeeId + birthday.replace(/-/g, "");

    return { username, password };
  } catch (error) {
    console.log(error);
  }
};



exports.generateUsernameAndPasswordForApprentice = (apprentice) => {
  try {
    const {
      apprentice_id: newApprenticeId,
      apprentice_firstname: firstname,
      apprentice_lastname: lastname,
      apprentice_birthday: birthday,
    } = apprentice;

    // Generate username by combining the first name and the first letter of the last name
    const username = firstname.charAt(0).toLowerCase() + lastname.toLowerCase();

    // Generate the password by combining apprentice id and birthday
    const password = newApprenticeId + birthday.replace(/-/g, "");

    return { username, password };
  } catch (error) {
    console.log(error);
  }
};

exports.generateUsernamefoApplicant = (applicant) => {
  try {
    const { map_applicantid: newApplicantId, map_nickname: nickname } =
      applicant;

    const username = nickname.toLowerCase() + newApplicantId;

    return { username };
  } catch (error) {
    console.log(error);
  }
};

exports.UserLogin = (result, callback) => {
  try {
    const userData = [];

    result.forEach((row) => {
      userData.push({
        studentid: row.studentid,
        fullname: row.fullname,
        accesstype: row.accesstype,
        status: row.status,
        image: row.image,
      });
    });

    return userData;
  } catch (error) {
    console.log(error);
    callback(error);
  }
};


exports.CustomerLogin = (result, callback) => {
  try {
    const CustomerData = [];

    result.forEach((row) => {
      CustomerData.push({
        cus_id: row.cus_id,
        cus_fullname: row.cus_fullname,
        role_type: row.role_type,
      });
    });

    return CustomerData;
  } catch (error) {
    console.log(error);
    callback(error);
  }
};

exports.MerchantLogin = (result, callback) => {
  try {
    const MerchantData = [];

    result.forEach((row) => {
      MerchantData.push({
        merchant_id: row.merchant_id,
        merchant_code: row.merchant_code,
        fullname: row.fullname,
        role_type: row.role_type,
        status: row.status,
        image: row.image,
      });
    });

    return MerchantData;
  } catch (error) {
    console.log(error);
    callback(error);
  }
};

exports.AdminLogin = (result, callback) => {
  try {
    const AdminData = [];

    result.forEach((row) => {
      AdminData.push({
        admin_id: row.admin_id,
        fullname: row.fullname,
        role_type: row.role_type,
        status: row.status,
        image: row.image,
      });
    });

    return AdminData;
  } catch (error) {
    console.log(error);
    callback(error);
  }
};

exports.showSweetAlert = (title, text, icon, buttonText) => {
  try {
    swal({
      title: title,
      text: text,
      icon: icon,
      button: buttonText,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.generateUsernameAndPasswordforOjt = (ojt) => {
  try {
    const {
      mo_name: firstname,
      mo_lastname: lastname,
      mo_id: ojtID,
      mo_birthday: birthday,
    } = ojt;

    // Generate username by combining the first name and the first letter of the last name
    const username = firstname.toLowerCase() + lastname.charAt(0).toLowerCase();

    // Generate the password by combining employee id and birthday
    const password = ojtID + birthday.replace(/-/g, "");

    return { username, password };
  } catch (error) {
    console.log(error);
  }
};

exports.generateCode = function(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Characters to choose from
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
};


exports.refineCurrencyInput = function(currency) {
  // Remove the '₱' symbol and commas
  let refinedValue = currency.replace('₱', '').replace(/,/g, '');

  // Parse the value into a float (ensure it's a valid number with two decimal places)
  let numberValue = parseFloat(refinedValue);

  // Ensure it's formatted to two decimal places for the database
  return numberValue.toFixed(2);
};


exports.UnauthorizedTemplate = () => {
  const unauthorizedError = /*html*/ `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Token Expired</title>
    <!-- Bootstrap 4 CSS -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
      body {
        background-color: #f8f9fa;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .error-container {
        text-align: center;
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 40px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }

      .error-title {
        font-size: 3rem;
        font-weight: 700;
        color: #dc3545;
      }

      .error-message {
        font-size: 1.25rem;
        margin: 20px 0;
        color: #6c757d;
      }
    </style>
  </head>

  <body>
    <div class="error-container">
      <h1 class="text-warning">401</h1>
      <p class="error-message">Token Expired</p>
      <p>Your session has expired. Please log in again to continue.</p>
      <a href="/AdminLogin" class="btn btn-primary mt-3">Log In</a>
    </div>

    <!-- Bootstrap 4 JS and dependencies -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.4.4/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
  </body>

  </html>


  `;

  return unauthorizedError;

};


// Example of how to use the custom function:
// showSweetAlert("success", "Log in Successfully", "success", "Let's go!");
// showSweetAlert("incorrect", "Incorrect Credentials. Please try again!", "error", "AWW NO!!!");
