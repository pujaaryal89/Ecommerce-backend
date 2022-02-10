// const items = [
//     {
//         seller_id: 22,
//         products: [
//             {
//                 quantity: 1,
//                 productId: 1,
//             },
//         ],
//     },
//     {
//         seller_id: 26,
//         products: [
//             {
//                 quantity: 1,
//                 productId: 1,
//             },
//             {
//                 quantity: 1,
//                 productId: 1,
//             },
//         ],
//     },
// ];

// const addProductToCart = (seller_id, product_id, quantity, items) => {
//     const seller_list = items.map((item) => item.seller_id);
//     if (seller_list.includes(seller_id)) {
//         items.forEach((item) => {
//             if (item.seller_id == seller_id) {
//                 item.products.push({
//                     quantity: quantity,
//                     productId: product_id,
//                 });
//             }
//         });
//     } else {
//         items.push({
//             seller_id: seller_id,
//             products: [{ quantity: quantity, productId: product_id }],
//         });
//     }
//     console.log(items);
// };

// addProductToCart(23, 2, 10, items);

//array xa simply , array deko xa 4ota element number jati deko xa tyo array teti ma
//split garne

// * array = [1,2,3,4], splitTo = 2 output = [[1,2],[3,4]] [[1][2][3,4]]

const array = [1, 2, 3, 4];

const splitArray = (array, splitNo) => {
    const length = array.length;
    const n = Math.ceil(length / splitNo, 1);
    const newArray = [];
    const i = array.findIndex((i) => i == splitNo);
    console.log(i);
};

splitArray(array, 2);
