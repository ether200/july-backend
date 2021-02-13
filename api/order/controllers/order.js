"use strict";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const {
      token,
      products,
      idUser,
      addressShipping,
      totalPayment,
    } = ctx.request.body;
    const charge = await stripe.charges.create({
      amount: (totalPayment * 100).toFixed(0),
      currency: "usd",
      source: token.id,
      description: `User ID: ${idUser}`,
    });

    const order = {
      user: idUser,
      books: products,
      totalPayment,
      idPayment: charge.id,
      addressShipping,
    };

    const entry = await strapi.query("order").create(order);

    return entry;
  },
};
