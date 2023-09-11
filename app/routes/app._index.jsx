import { useState, useCallback, useEffect } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit, Form, useActionData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  VerticalStack,
  Card,
  Button,
  Box,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { LegacyCard, LegacyTabs } from '@shopify/polaris'
import axios from 'axios';
import { getQRCode, validateQRCode } from "../models/update.server";



export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);

  const shop = session.shop
  const apiAccessToken = session.accessToken;


  const response = await admin.rest.resources.Asset.all({ session, theme_id: 150794174747, });
  //console.log(response, "its remix asset api");
  return json(response);
  // TODO: Complete this function to fetch the assets from the Shopify API
  // and return the home, product, and collection templates.

  return json({ data: {} });
};

export let action = async ({ request }) => {
  // Session is built by the OAuth process
  const { session, admin } = await authenticate.admin(request);

  const shop = session.shop;
  const apiAccessToken = session.accessToken;

  // Access the form data
  /** @type {any} */
  const data = {
    ...Object.fromEntries(await request.formData()),
    shop,
  };

  let string = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const arr = string.split("");

  const shuffledArr = arr.sort(() => Math.random() - 0.5);
  const shuffled = shuffledArr.join("");
  console.log("nnnnnnnnnnnnnnnnnnnnnnnnn",shuffledArr);

  let temp_key = '';
  let value = '';

  switch (data.key) {
    case "templates/index.json":
      try {
        // Fetch the existing asset
        let template = await admin.rest.resources.Asset.all({ session, theme_id: 150794174747, asset: { "key": "templates/index.json" } });
        let json_array = JSON.parse(JSON.stringify(template));

        // Create a new Asset object
        let asset = new admin.rest.resources.Asset({ session });
        asset.theme_id = 150794174747;
        asset.key = "templates/index."+shuffled.substr(1,10)+".json";
        asset.value = json_array.data[0]?.value;

        console.log('object',asset)

        // Save the new asset
       // await asset.save({ update: false });
        //console.log("Updated asset:", asset);
      } catch (e) {
        console.error("Error:", e);
      }
      break;
  }

  // Now you can use the email and password as needed for your logic
  // ...

  return json({ status: 'success' });
};


export default function Index() {
  const { data } = useLoaderData();
  //const { adata } = useActionData() || [];
  // console.log('action',adata);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const submit = useSubmit();

  const product = [];
  const collection = [];
  const index = [];
  //console.log(data);
  for (const template of data) {
    if (template.key.startsWith("templates/product")) {
      if (template.key.endsWith(".json")) {
        product.push(template);
      }
    }

    if (template.key.startsWith("templates/collection")) {
      if (template.key.endsWith(".json")) {
        collection.push(template);
      }
    }

    if (template.key.startsWith("templates/index")) {
      if (template.key.endsWith(".json")) {
        index.push(template);
      }
    }
  }




  const handleDuplicate = async () => {
    const data = {
      key: 'templates/index.json',
    };

    submit(data, { method: "post" });
    //     const { adata } = useActionData() || [];
    //  console.log('action',adata);
    switch (tabs[selectedTabIndex].content) {

      case 'Home Pages':
        // let get = await admin.rest.resources.Asset.all({ session, theme_id: 150794174747, asset: { "key": "templates/index.json" } });


        const data = {
          key: 'templates/index.json',
        };

        submit(data, { method: "post" });

      
        break;
      case 'Collection pages':
        break;
      case 'Product pages':
        break;
    }
    // TODO: Complete this function to submit the form with the selected asset key and theme ID.
  };

  const renderCard = (asset) => {
    // TODO: Complete this function to render a card for each asset with its key, theme ID, and updated at time.
  };

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelectedTabIndex(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: 'accepts-marketing-1',
      content: 'Home pages',
      panelID: 'accepts-marketing-content-1',
    },
    {
      id: 'repeat-customers-1',
      content: 'Collection pages',
      panelID: 'repeat-customers-content-1',
    },
    {
      id: 'prospects-1',
      content: 'Product pages',
      panelID: 'prospects-content-1',
    },
  ];

  const renderTabContent = () => {
    if (tabs[selectedTabIndex].content === 'Home pages') {
      const selectedData = index[selectedTabIndex];

      const renderedItems = index.map((item, i) => (
        <div key={i}>
          <p>Theme ID: {item?.theme_id}</p>
          <p>Key: {item?.key}</p>
          <p>Updated At: {item?.updated_at}</p>
        </div>
      ));

      return (
        <div>
          {renderedItems}
        </div>
      );


    } else if (tabs[selectedTabIndex].content === 'Collection pages') {


      const selectedData = collection[selectedTabIndex];
      const renderedItems = collection.map((item, i) => (
        <div key={i}>
          <p>Theme ID: {item?.theme_id}</p>
          <p>Key: {item?.key}</p>
          <p>Updated At: {item?.updated_at}</p>
        </div>
      ));

      return (
        <div>
          {renderedItems}
        </div>
      );

    } else if (tabs[selectedTabIndex].content === 'Product pages') {
      const selectedData = product[selectedTabIndex];

      const renderedItems = product.map((item, i) => (
        <div key={i}>
          <p>Theme ID: {item?.theme_id}</p>
          <p>Key: {item?.key}</p>
          <p>Updated At: {item?.updated_at}</p>
        </div>
      ));


      return (
        <div>
          {renderedItems}
        </div>
      );
    } else {
      return (
        <p>Tab {tabs[selectedTabIndex].content} selected</p>
      );
    }
  };

  return (
    <Page>
      <ui-title-bar title="Remix app template"></ui-title-bar>
      <VerticalStack gap="5">
        <Layout>
          <Layout.Section>
            {/* TODO: Render the Tabs and Panels components here */}
          </Layout.Section>
        </Layout>

        <Button
          primary
          onClick={handleDuplicate}
        >
          Duplicate Template
        </Button>
        <form method="post" >
          <label>Email address</label>
          <input type="email" name="email" />

          <label>Password</label>
          <input type="password" name="password" />

          <button type="submit">Log In</button>
        </form>
        <LegacyCard>
          <LegacyTabs tabs={tabs} selected={selectedTabIndex} onSelect={handleTabChange}>
            <LegacyCard.Section title={tabs[selectedTabIndex].content}>
              {renderTabContent()}
            </LegacyCard.Section>
          </LegacyTabs>
        </LegacyCard>
      </VerticalStack>
    </Page>
  );
}
