import defaultUser from '../utils/default-user';
import User from './StaticUser'
import { CONFIG } from '../CONFIG';
function getCurrentToken() {
  return localStorage.getItem("token");
}
export async function signIn(email, password) {
  try {
    const data = JSON.stringify({ email, password });
    const response = await fetch(CONFIG.BaseUrl + "Auth/LogIn", {
      method: "POST",
      body: data,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${getCurrentToken()}` // Token ekleniyor
      }
    });
    const result = await response.json();
    if (result.type === 0) {
      let userInfo = {
        email: result.data[0].userName,
        avatarUrl: result.data[0].imageUrl
      };

      let userProfile = {
        userName: result.data[0].userName,
        avatarUrl: result.data[0].imageUrl,
        userId: result.data[0].mongoId
      };

      localStorage.setItem("token", result.data[0].token);
      localStorage.setItem("userCode", result.data[0].userName);
      localStorage.setItem("userId", result.data[0].mongoId);
      localStorage.setItem("userData", JSON.stringify(userProfile));

      // User objesine de bilgileri kaydediyoruz
      User.user = userProfile;

      return {
        isOk: true,
        data: userInfo
      };
    }
    else {
      // result içerisinden dönen message değerini hata mesajı olarak kullanıyoruz
      throw new Error(result.definitionLang || "Authentication failed");
    }
  }
  catch(error) {
    return {
      isOk: false,
      message: error.message
    };
  }
}

export async function getUser() {
  try {
    const token = getCurrentToken();
    if (!token) {
      return {
        isOk: false
      };
    }

    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      return {
        isOk: true,
        data: JSON.parse(storedUserData)
      };
    }

    return {
      isOk: false
    };
  }
  catch {
    return {
      isOk: false
    };
  }
}

// export async function createAccount(email, password) {
//   try {
//     // Send request
//     console.log(email, password);

//     return {
//       isOk: true
//     };
//   }
//   catch {
//     return {
//       isOk: false,
//       message: "Failed to create account"
//     };
//   }
// }

export async function changePassword(email, recoveryCode) {
  try {
    // Send request
    console.log(email, recoveryCode);

    return {
      isOk: true
    };
  }
  catch {
    return {
      isOk: false,
      message: "Failed to change password"
    }
  }
}

export async function resetPassword(email) {
  try {
    // Send request
    console.log(email);

    return {
      isOk: true
    };
  }
  catch {
    return {
      isOk: false,
      message: "Failed to reset password"
    };
  }
}
