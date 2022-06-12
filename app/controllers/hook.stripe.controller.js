// load the dependancies
const crypto = require("crypto");
const validator = require("validator");
const stripe = require('stripe')(process.env.STRIPE_LOCAL_API_KEY);
const db = require("../models");

// load the db
const Purchase = db.purchases;

// Find your endpoint's secret in your Dashboard's webhook settings
const endpointSecret = process.env.STRIPE_LOCAL_ENDPOINT_SECRET;

// completed hook
exports.completed = (req, res) => {


    const payload = req.body;
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);

    } catch (error) {

        // push the error to buffer
        res.locals.errors.push({
            location: "hook.stripe.controller.completed.1",
            code: error.code,
            message:
                error.message || "Some error occurred",
            from: "sequelize",
        });

        // return the correct vars
        res.status(500).json({
            message: "Server error",
            errors: res.locals.errors,
            reqid: res.locals.reqid,
        });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const id = session.client_reference_id;

        // check if title is present
        if (!id) {
            // retun the correct vars
            return res.status(400).json({
                message: "Id input value missing",
                reqid: res.locals.reqid,
            });
        }

        const purchase = {
            paid: true,
        };

        // Update the specific purchase in the db
        Purchase.update(purchase, {
            where: {
                id: id,
            },
        })
            .then((number) => {
                if (number == 1) {
                    // retun the correct vars
                    res.status(200).json({
                        message: "okay",
                        reqid: res.locals.reqid,
                    });
                } else {
                    // retun the correct vars
                    res.status(400).json({
                        message: "Purchase not updated",
                        reqid: res.locals.reqid,
                    });
                }
            })
            .catch((error) => {
                // push the error to buffer
                res.locals.errors.push({
                    location: "hook.stripe.controller.completed.1",
                    code: error.code,
                    message:
                        error.message || "Some error occurred while updating the purchase",
                    from: "sequelize",
                });

                // return the correct vars
                res.status(500).json({
                    message: "Server error",
                    errors: res.locals.errors,
                    reqid: res.locals.reqid,
                });
            });
    } else {

        // return the correct vars
        res.status(400).json({
            message: "No event type",
            errors: res.locals.errors,
            reqid: res.locals.reqid,
        });
    }

};