import { AxiosRequestHeaders } from "axios";
import dotenv from "dotenv";
dotenv.config();

export const collectionsIds = {
  "absolute-india": {
    destinations: "6838717a173af359c44a98a7",
    experiences: "620b8a0b09a316e5cedde038",
  },
  "absolute-world": "620b8a0b09a3167a92dde043",
} as const;
export const collectionBaseURL = (collectionId: string) =>
  `https://api-cdn.webflow.com/v2/collections/${collectionId}/items`;
export const requestHeader = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.WEBFLOW_AUTH_KEY}`,
} as unknown as AxiosRequestHeaders;

export const regionsIdMap: Record<string, string> = {
  "399ad996ae4c7d73d6c76c23f37d82d6": "North",
  "507b50dc8ad4cdb2f6a76b3b9dae4495": "East",
  "76d61dac8cc6e4cf742c8471d132c94e": "South",
  "3ea253ded5d0f891c3cad2351dd53cdc": "West",
};

export const statesIdMap: Record<string, string> = {
  ad10ba606be737d1078f07f9908829b4: "Andaman and Nicobar Islands",
  "28b6d1dbcfb990896fb4f8711d7da62e": "Assam",
  "64ba3ab8aa1d7ae2901e635c9eac3874": "Chandigarh",
  "800202a439b7b1baf81ef8b346c75eec": "Daman and Diu",
  "0752d49ff4b7934a8e62cceb9f5106e7": "Delhi",
  "6074830e229351dfef112987140a57ad": "Goa",
  a2a3be127b8e0a53fb70ffbdece9ab99: "Gujarat",
  a75a9edbdeb5980a78e5b7413bac1a5b: "Himachal Pradesh",
  "5a4904f07ee4ca4385eb1870c197fd1e": "Jammu and Kashmir",
  "7b793578505b92f306870e4705c2b127": "Karnataka",
  "77409c58b0af6aae372478b002b2fb6f": "Kerala",
  "54b36ad0f262ab43edb6e04e278cfb2a": "Ladakh",
  abf87105ac55f215479efed59907ea5e: "Madhya Pradesh",
  a77628e4ab0ceb3b5c9ccb5996759d76: "Maharashtra",
  ebdadb5ae73cb9abeae676ba4da26313: "Odisha",
  b7e645b2e0702aa56a911efc98db84e9: "Puducherry",
  e15b91e12a0e6e8bd81c272605b1fb4c: "Punjab",
  "3ae4277f542ead2705a8f5b9b0446b25": "Rajasthan",
  ff11fe1330fa75a4e21918977c97e626: "Sikkim",
  "00907620a08c8e173db6a11d6388bf88": "Tamil Nadu",
  "647579f4c50c51332ac6bad30e138228": "Uttar Pradesh",
  cc3315caeec947d84d8579fc254552b6: "Uttarakhand",
  a93bc618a41e06fbd0c5eb8dc370118b: "West Bengal",
};

export const typeOfListingsIdMap: Record<string, string> = {
  "620b8a0b09a3161b42dde242": "Expedition",
  "620b8a0b09a31615a3dde240": "Magical",
  "620b8a0b09a3165b87dde23f": "Remote",
  "620b8a0b09a31621fedde23e": "Destinations",
};

export const continentsIdMap: Record<string, string> = {
  "620b8a0b09a3162a83dde11c": "South America",
  "620b8a0b09a3163272dde109": "North America",
  "620b8a0b09a316172bdde0f6": "Europe",
  "620b8a0b09a3166422dde0e2": "Australia",
  "620b8a0b09a31674a9dde0d0": "Asia",
  "620b8a0b09a3168facdde0bc": "Oceania",
  "620b8a0b09a3165815dde0a8": "Africa",
};
