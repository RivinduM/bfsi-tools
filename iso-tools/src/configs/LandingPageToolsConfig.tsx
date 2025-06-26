const Config = window.Config;

export enum ToolStatus {
  active,
  inactive,
  maintenance,
}

export interface ITool {
  title: string;
  description: string;
  image: string;
  link: string;
  status: ToolStatus;
}

export interface IToolGroup {
  title: string;
  description: string;
  tools: ITool[];
}

export const toolGroups: IToolGroup[] = [
  {
    title: "Data Transformation",
    description: "Prebuilt data transformation among different message formats",
    tools: [
      {
        title: "MT to MX",
        description:
          "This API offers BFSI IT developers a turnkey solution for effortlessly converting MT messages to MX standards. It enables rapid integration and data exchange while reducing development complexity and accelerating time-to-market.",
        image: "/tools-logo/with-background/mt-mx.png",
        link: "/mt-mx",
        status: Config.tools.MT_TO_MX
          ? ToolStatus.active
          : ToolStatus.maintenance,
      },
      {
        title: "MX to MT",
        description:
          "This API offers BFSI IT developers a turnkey solution for effortlessly converting MX messages to MT standards. It enables rapid integration and data exchange while reducing development complexity and accelerating time-to-market.",
        image: "/tools-logo/with-background/mx-mt.png",
        link: "/mx-mt",
        status: Config.tools.MX_TO_MT
          ? ToolStatus.active
          : ToolStatus.maintenance,
      },
      {
        title: "Generate ISO 8583",
        description:
          "This API offers BFSI IT developers a turnkey solution for effortlessly generating ISO 8583 messages. It enables rapid integration and data exchange while reducing development complexity and accelerating time-to-market.",
        image: "/tools-logo/with-background/iso8583.png",
        link: "/iso8583",
        status: Config.tools.ISO8583
          ? ToolStatus.active
          : ToolStatus.maintenance,
      }
    ]
  },
  {
      title: "Open Banking",
      description:
         "WSO2 Open Banking leverages WSO2 API-first integration products to form a purpose-built solution to satisfy the full technology requirements of global open banking.",
      tools: [
        {
          title: "Open Banking Sandbox",
          description: "The WSO2 Open Banking Developer Portal Sandbox provides a simulated environment to test the waters of WSO2 Open Banking. It allows users to subscribe and consume APIs from the context of a banking application.",
          image: "/tools-logo/with-background/ob.png",
          link: "https://openbanking.wso2.com/",
          status: Config.tools.OPEN_BANKING_SANDBOX
            ? ToolStatus.active
            : ToolStatus.maintenance,
        }
      ]
  }
];
