/* eslint-disable no-console */

/*
 * This is a client-side example of how to use the ApiResponse type.
 * Note that the example is written using React, but these utilities
 * are not React-specific.
 *
 * Also, many parts are commented out to avoid errors (as this project
 * is not set up to run React code)
 */

import { ApiResponse, consumeApiResponse } from "../src/api";
// ... other imports

type Data = Record<string, string>;

// const Component = () => {
// const [data, setData] = useState<Data>(null);
// const [error, setError] = useState<Error>(null);

// useEffect(() => {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchData = async () => {
  const res = await fetch("https://my-api.com");
  const resData = await res.json();

  const apiResponse = ApiResponse<Data>(resData);
  const data = consumeApiResponse<Data>(apiResponse);

  if (!data.ok) {
    // const error = data.unwrapErr(); <-- if you want to be forceful and risk crashing your page

    const error = data.unwrap();
    // return setError(error.message);
    return error;
  }

  const myData = data.unwrap();
  // do something with myData
  // setData(myData);
  return myData;
};

// fetchData();
// }, []);

/* return (
    <>
      {data && <div>{data}</div>}
      {error && <div>{error}</div>}
    </>
  ); */
// };

// obviously the type inference doesn't work here, but you get the idea:
// you would have separate state/variables for the data and error
// and you would use the data if it's there, or the error if it's not
