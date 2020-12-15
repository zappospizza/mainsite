// Stripe secret Key on Netlify ENV Variable
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// The inventory (Only one language at the moment)
const inventory = require('./data/items.json');

exports.handler = async (event) => {
   // get the mandatory information for charging the client : sku + quantity
   //   The following URLs are set according to form language
   //   Get language (formlang) transmited from the form
   //   Get Absolute path for images on the Stripe checkout page
   const { sku, quantity, formlang, stripePath } = JSON.parse(event.body);
   // Find the product
   const product = inventory.find((p) => p.sku === sku);
   // Sanitize quantity
   const validateQuantity = quantity > 0 && quantity < 11 ? quantity : 1;

   // Create Stripe session
   const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      shipping_address_collection: {
         // All available countries Worldwide
         allowed_countries: ['AC','AD','AE','AF','AG','AI','AL','AM','AO','AQ','AR','AT','AU','AW','AX','AZ','BA','BB','BD','BE','BF','BG','BH','BI','BJ','BL','BM','BN','BO','BQ','BR','BS','BT','BV','BW','BY','BZ','CA','CD','CF','CG','CH','CI','CK','CL','CM','CN','CO','CR','CV','CW','CY','CZ','DE','DJ','DK','DM','DO','DZ','EC','EE','EG','EH','ER','ES','ET','FI','FJ','FK','FO','FR','GA','GB','GD','GE','GF','GG','GH','GI','GL','GM','GN','GP','GQ','GR','GS','GT','GU','GW','GY','HK','HN','HR','HT','HU','ID','IE','IL','IM','IN','IO','IQ','IS','IT','JE','JM','JO','JP','KE','KG','KH','KI','KM','KN','KR','KW','KY','KZ','LA','LB','LC','LI','LK','LR','LS','LT','LU','LV','LY','MA','MC','MD','ME','MF','MG','MK','ML','MM','MN','MO','MQ','MR','MS','MT','MU','MV','MW','MX','MY','MZ','NA','NC','NE','NG','NI','NL','NO','NP','NR','NU','NZ','OM','PA','PE','PF','PG','PH','PK','PL','PM','PN','PR','PS','PT','PY','QA','RE','RO','RS','RU','RW','SA','SB','SC','SE','SG','SH','SI','SJ','SK','SL','SM','SN','SO','SR','SS','ST','SV','SX','SZ','TA','TC','TD','TF','TG','TH','TJ','TK','TL','TM','TN','TO','TR','TT','TV','TW','TZ','UA','UG','US','UY','UZ','VA','VC','VE','VG','VN','VU','WF','WS','XK','YE','YT','ZA','ZM','ZW','ZZ']
      },
      // The real next URL for the web site language
      // success_url: `${process.env.URL}`+rootUrl+`/thanks/`,
      // cancel_url:  `${process.env.URL}`+rootUrl+`/oops/`,
      success_url: '${process.env.URL}' + '/thanks/',
      cancel_url:  '${process.env.URL}',

      // Information about the product
      line_items: [
         {
            name: '[' + product.sku + '] ' + product.name ,
            description: product.description,
            amount: product.amount,
            currency: product.currency,
            quantity: validateQuantity,
         },
      ],
   });

   return {
      statusCode: 200,
      body: JSON.stringify({
         sessionId: session.id,
         publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      }),
   };

};