/* eslint-disable import/no-unresolved */
import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';

const serverUrl = 'http://127.0.0.1:3000';

const errorRate = new Rate('errorRate');

export const options = {
  duration: '100s',
  vus: 50,
};

export default function runGetRequestTest() {
  // Tests the last 10% of the 10 million products in the database;
  const randomProductId = Math.floor(Math.random() * 1000000) + 9000000;
  // Run a get for the given product id
  const getResponse = http.get(`${serverUrl}/photos/${randomProductId}`);
  const { pictureId: pictureIdList } = getResponse.json();

  // Take one of the images from previous response to update
  const imageIdIndex = Math.floor(Math.random() * pictureIdList.length);
  const pictureId = pictureIdList[imageIdIndex];

  // To do: pass in a parameter for the body with what to update the image to
  const patchResponse = http.patch(
    `${serverUrl}/photos/${randomProductId}/${pictureId}`,
    {
      newImageLink: 'https://sdc-chewy.s3-us-west-2.amazonaws.com/images/product/img1.jpeg',
    },
  );
  errorRate.add(patchResponse.status !== 200);

  check(patchResponse, {
    'Response code was 200': (res) => {
      // console.log('Response status', res.status);
      return res.status === 200;
    },
    'Response is "success!"': (res) => {
      // console.log(res.body);
      return res.body === 'Success!';
    },
  });
}
