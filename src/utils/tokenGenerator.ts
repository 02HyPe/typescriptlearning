import { sign } from "jsonwebtoken";
import { asyncHandler } from "../middleware/error/async_handler";

// export const generateAccessToken = (userName: string, email: string) => {
//   const token = sign(
//     {
//       userName: userName,
//       email: email,
//     },
//     process.env.ACCESS_TOKEN_SECERET,
//     {
//       expiresIn: 60 * 3,
//     }
//   );

//   return token;
// };

// export const generateRefreshToken = asyncHandler(
//   async (userName: string, email: string) => {
//     const token = sign(
//       {
//         userName: userName,
//         email: email,
//       },
//       process.env.REFRESH_TOKEN_SECERET,
//       {
//         expiresIn: "2h",
//       }
//     );
//     return token;
//   }
// );

// export const generateRefreshAndAccessToken = (
//   userName: string,
//   email: string
// ) => {
//   const token = sign(
//     {
//       userName: userName,
//       email: email,
//     },
//     process.env.REFRESH_TOKEN_SECERET,
//     {
//       expiresIn: "2h",
//     }
//   );
//   return token;
// };
