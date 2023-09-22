/* eslint-disable no-console */
import { ApiResponse } from "../src/api";

type Data = Record<string, string>;

const routeHandler = async (success: boolean): Promise<ApiResponse<Data>> => {
  const apiRes = await Promise.resolve({
    ok: success,
    json: async () =>
      Promise.resolve(
        success
          ? {
              some: "data",
            }
          : null
      ),
  });

  if (!apiRes.ok) {
    return ApiResponse<Data>(new Error("Something went wrong"));
  }

  const data = await apiRes.json();
  return ApiResponse<Data>(data!); // ignore the non-null assertion, we know it's not null
};

const successResponse = await routeHandler(true);
if (successResponse.success) {
  //          ✨ once again, type inference
  console.log(successResponse); // { success: true, data: "test" }
}

const errorResponse = await routeHandler(false);
if (!errorResponse.success) {
  //          ✨ and again
  console.log(errorResponse); // { success: false, error: Error: Something went wrong }
}
