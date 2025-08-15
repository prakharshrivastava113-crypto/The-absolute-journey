import Axios, { type AxiosRequestHeaders } from "axios";
import {
  collectionsIds,
  continentsIdMap,
  regionsIdMap,
  requestHeader,
  statesIdMap,
  typeOfListingsIdMap,
} from "./constant";
import { ItemCollectionListApiResponse, MenuItem, WorldItem } from "./types";

export const callApi = async ({
  url,
  method,
  request,
  headers,
  logCurl,
}: {
  url: string;
  method: string;
  request?: unknown;
  headers?: unknown;
  logCurl?: boolean;
}) => {
  if (logCurl) {
    console.log(`curl -X ${method.toUpperCase()} "${url}"`);
    if (request) {
      console.log(`-H "Content-Type: application/json"`);
      console.log(`-d '${JSON.stringify(request)}'`);
    }
  }

  const response = await Axios({
    url,
    method,
    [method.toLowerCase() === "get" ? "params" : "data"]: request,
    headers: headers as AxiosRequestHeaders,
  });
  return response.data;
};

async function fetchData() {
  try {
    const [indianDestinations, indianExperiences, worldDestination] =
      await Promise.allSettled([
        callApi({
          url: `https://api.webflow.com/v2/collections/${collectionsIds["absolute-india"]["destinations"]}/items`,
          method: "GET",
          headers: requestHeader,
          logCurl: true,
        }),
        callApi({
          url: `https://api.webflow.com/v2/collections/${collectionsIds["absolute-india"]["experiences"]}/items`,
          method: "GET",
          headers: requestHeader,
          logCurl: true,
        }),
        callApi({
          url: `https://api.webflow.com/v2/collections/${collectionsIds["absolute-world"]}/items`,
          method: "GET",
          headers: requestHeader,
          logCurl: true,
        }),
      ]);
    return {
      indianDestinations:
        indianDestinations.status === "fulfilled"
          ? indianDestinations.value
          : null,
      indianExperiences:
        indianExperiences.status === "fulfilled"
          ? indianExperiences.value
          : null,
      worldDestination:
        worldDestination.status === "fulfilled" ? worldDestination.value : null,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

const processIndianDestinationData = (
  itemCollectionList: ItemCollectionListApiResponse
): MenuItem[] => {
  const regionsMap = new Map();
  itemCollectionList?.items.forEach((item) => {
    const regionName = regionsIdMap[item.fieldData.region];
    const stateName = statesIdMap[item.fieldData.state];
    const city = {
      id: item.fieldData.slug,
      name: item.fieldData.name,
      weblink: item.fieldData.weblink.replace(
        "https://www.theabsolutejourney.com/",
        "/"
      ),
    };

    if (!regionName || !stateName) return;

    if (!regionsMap.has(regionName)) {
      regionsMap.set(regionName, new Map());
    }

    const statesMap = regionsMap.get(regionName);
    if (!statesMap.has(stateName)) {
      statesMap.set(stateName, []);
    }

    statesMap.get(stateName).push(city);
  });

  const regions = Object.values(regionsIdMap).map((regionName: string) => {
    const statesMap = regionsMap.get(regionName);
    const states = Array.from(statesMap.entries()).map(
      ([stateName, cities]) => ({
        id: stateName.toLowerCase().replace(/\s+/g, "-"),
        name: stateName,
        submenu: cities,
      })
    );

    return {
      id: regionName.toLowerCase(),
      name: regionName.toUpperCase(),
      submenu: states,
    };
  });
  return regions;
};

const processIndianExperienceData = (worldItems: { items: WorldItem[] }) => {
  return worldItems?.items.map((item) => ({
    id: item.fieldData.slug,
    name: item.fieldData.name,
    weblink: `/indian-experiences/${item.fieldData.slug}`,
  }));
};

const processWorldDestinationData = (worldItems: { items: WorldItem[] }) => {
  const result: Record<string, Record<string, MenuItem[]>> = {};

  worldItems?.items.forEach((item) => {
    const continents = item.fieldData["continent-2"].map(
      (continent) => continentsIdMap[continent]
    );
    const type = typeOfListingsIdMap[item.fieldData["type-of-listing"]];

    continents.map((continent) => {
      if (!result[type]) {
        result[type] = {};
      }
      if (!result[type][continent]) {
        result[type][continent] = [];
      }
      result[type][continent].push({
        id: item.fieldData.slug,
        name: item.fieldData["internal-reference"],
        weblink: `/absolute-world/${item.fieldData.slug}`,
      });
    });
  });

  //add self drive tours
  const selfDriveTours: MenuItem = {
    id: "self-drive-tours",
    name: "Self-Drive Tours",
    hasSubmenu: true,
    weblink: "/destinations/iceland-selfdrive",
    submenu: [
      {
        id: "iceland",
        name: "Iceland",
        weblink: "/destinations/iceland-selfdrive",
      },
    ],
  };

  return [
    selfDriveTours,
    {
      id: "destinations",
      name: "Destinations",
      hasSubmenu: true,
      weblink: "/world/destinations",
      submenu: Object.entries(result["Destinations"]).map(
        ([region, states]) => {
          return {
            id: region.toLowerCase().replace(/\s+/g, "-"),
            name: region,
            submenu: states,
          };
        }
      ),
    },
    {
      id: "expedition",
      name: "Expedition",
      hasSubmenu: false,
      weblink: "/world/expedition",
      submenu: Object.entries(result["Expedition"]).map(([region, states]) => {
        return {
          id: region.toLowerCase().replace(/\s+/g, "-"),
          name: region,
          submenu: states,
        };
      }),
    },
    {
      id: "magical",
      name: "Magical",
      hasSubmenu: false,
      weblink: "/world/magical",
      submenu: Object.entries(result["Magical"]).map(([region, states]) => {
        return {
          id: region.toLowerCase().replace(/\s+/g, "-"),
          name: region,
          submenu: states,
        };
      }),
    },
    {
      id: "remote",
      name: "Remote",
      hasSubmenu: false,
      weblink: "/world/remote",
      submenu: Object.entries(result["Remote"]).map(([region, states]) => {
        return {
          id: region.toLowerCase().replace(/\s+/g, "-"),
          name: region,
          submenu: states,
        };
      }),
    },
  ] as MenuItem[];
};

export const processData = async () => {
  const webflowData = await fetchData();
  const indianRegions = processIndianDestinationData(
    webflowData.indianDestinations
  );
  const indianExperiences = processIndianExperienceData(
    webflowData.indianExperiences
  );
  const worldMenu = processWorldDestinationData(webflowData.worldDestination);

  const response: MenuItem[] = [
    {
      id: "absolute-india",
      name: "ABSOLUTE INDIA",
      hasDropdown: true,
      submenu: [
        {
          id: "destinations",
          name: "Destinations",
          hasSubmenu: true,
          submenu: indianRegions,
          weblink: "/india/destinations-in-india",
        },
        {
          id: "excellence",
          name: "Excellence",
          hasSubmenu: false,
          weblink: "/india/indian-excellence",
        },
        {
          id: "experiences",
          name: "Experiences",
          hasSubmenu: true,
          submenu: indianExperiences,
          weblink: "/india/experiences-in-india",
        },
      ],
    },
    {
      id: "absolute-world",
      name: "ABSOLUTE WORLD",
      hasDropdown: true,
      submenu: worldMenu,
    },
    {
      id: "absolute-air",
      name: "ABSOLUTE AIR",
      hasDropdown: false,
      weblink: "/private-jet-journeys",
    },
    {
      id: "aurora",
      name: "AURORA",
      hasDropdown: false,
      weblink: "/aurora",
    },
    {
      id: "journal",
      name: "JOURNAL",
      hasDropdown: false,
      weblink: "/journal",
    },
    {
      id: "about-us",
      name: "ABOUT US",
      hasDropdown: false,
      weblink: "/about-us",
    },
    {
      id: "covid-safety",
      name: "COVID SAFETY & TRAVEL",
      hasDropdown: false,
      weblink: "/covid-safety-travel",
    },
  ];
  return response;
};
