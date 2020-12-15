// Handle form the Submit button
export async function handleFormSubmission(event) {
    event.preventDefault();
 
    // Custom Goal for plausible.io
    // plausible('ShopOrderClick');
 
    const form = new FormData(event.target);
 
    // Get the mandatory data from the form
    //    formlang : for multilanguage sites
    //    stripeImgPath : for local images in STATIC
    //    stripeImg : for local images in ASSETS
    const data = {
       sku: form.get('sku'),
       quantity: form.get('quantity'),
       formlang: form.get('formlang'),
       stripeImgPath: form.get(`stripeImgPath`),
       stripeImg: form.get(`stripeImg`),
    };
 
    // Create a Stripe Checkout
    const response = await fetch ('/.netlify/functions/create-checkout', {
       method: 'POST',
       headers: {
          'content-type': 'application/json',
       },
       body: JSON.stringify(data),
    }).then((res) => res.json());
 
    // Manage Checkout response & SessionID
    const stripe = Stripe(response.publishableKey);
    const { error } = await stripe.redirectToCheckout({
       sessionId: response.sessionId,
    });
 
    if (error) {
       console.error(error);
    }
 
 };
 