import { products } from '../data/products.json';
import axios from 'axios';
import { getDomain } from '.';
import authenticate from './authenticate';

export const initializeProducts = async () => {
  const domain = getDomain();
  const token = await authenticate();

  for await (const product of products) {
    const productImages: {
      colorId: string;
      imageUrl: string;
    }[] = [];
    for (const image of product.productImages) {
      const { data } = await axios.get(`${domain}/colors?name=${image.color}`);
      productImages.push({
        colorId: data[0]?.id as string,
        imageUrl: image.imageUrl,
      });
    }
    const payload = { ...product, productImages };
    // console.log(payload);
    const { data } = await axios.post(`${domain}/products`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(data);
  }
};
initializeProducts();
