import { authenticate } from "../../../app/shopify.server";
import { useEffect } from "react";
import { useActionData, useSubmit } from "@remix-run/react";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
    await authenticate.admin(request);
  
    return null;
};

export const action = async ({ request }) => {
    const { admin } = await authenticate.admin(request);
    let startDiscountTime = new Date();
    let endDiscountTime = new Date();
    endDiscountTime.setDate(endDiscountTime.getDate() + 5);
  
    function generatePromoCode(length) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const codeArray = [];
    
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        codeArray.push(characters.charAt(randomIndex));
      }
    
      return codeArray.join('');
    }
  
    const response = await admin.graphql(
      `#graphql
      mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
        discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
          codeDiscountNode {
            codeDiscount {
              ... on DiscountCodeBasic {
                title
                codes(first: 10) {
                  nodes {
                    code
                  }
                }
                startsAt
                endsAt
                customerSelection {
                  ... on DiscountCustomerAll {
                    allCustomers
                  }
                }
                customerGets {
                  value {
                    ... on DiscountPercentage {
                      percentage
                    }
                  }
                  items {
                    ... on AllDiscountItems {
                      allItems
                    }
                  }
                }
                appliesOncePerCustomer
              }
            }
          }
          userErrors {
            field
            code
            message
          }
        }
      }`,
      {
        variables: {
          "basicCodeDiscount": {
            "title": "minigamesDiscount",
            "code": generatePromoCode[8],
            "startsAt": startDiscountTime,
            "endsAt": endDiscountTime,
            "customerSelection": {
              "all": true
            },
            "customerGets": {
              "value": {
                "percentage": 0.1
              },
              "items": {
                "all": true
              }
            },
            "appliesOncePerCustomer": true
          }
        },
      }
    );
    const responseJson = await response.json();
  
    return json({
      responseJson
    });
  };

  export default async function Index() { 
    const actionData = useActionData();
    const submit = useSubmit();
    const promotionCodeId = actionData?.promotionCode?.id.replace(
      "gid://shopify/PromotionCode/",
      ""
    );
  
    useEffect(() => {
      if (promotionCodeId) {
        shopify.toast.show("Promotion code created");
      }
    }, [promotionCodeId]);
    
  
    const generatePromotionCode = () => submit({}, { replace: true, method: "POST" });
  
    return generatePromotionCode()
}
