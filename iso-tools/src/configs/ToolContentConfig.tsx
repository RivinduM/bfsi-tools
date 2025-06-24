import CableOutlinedIcon from "@mui/icons-material/CableOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import TransformOutlinedIcon from "@mui/icons-material/TransformOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import { ReactElement } from "react";
import {
  CcdaToFhir,
  ConnectToEmr,
  FhirPath,
  FhirValidation,
  MtToMx,
  SmartOnFhir,
} from "../components/accelerators";
import { MTMXGITHUBCONTENT } from "./GithubBladeConfig";

const Config = window.Config;

export enum ToolStatus {
  active,
  inactive,
  maintenance,
}

export interface Tool {
  title: string;
  subTitle: string;
  shortDescription: string;
  description: string;
  url: string;
  path: string;
  image: string;
  icon: ReactElement;
  component: ReactElement;
  githubContent: ReactElement;
  status?: ToolStatus;
}

export interface Sample {
  name: string;
  apiName?: string;
  data: string;
}

export const tools: Tool[] = [
  {
    title: "MT to MX",
    subTitle: "Transform",
    shortDescription: "Convert MT messages to ISO 20022",
    description:
      "Introducing our API for BFSI IT developers, enabling seamless conversion of MT messages to ISO 20022 format. Simplify integration and data exchange processes, experiencing reduced development complexity and accelerated time-to-market as you effortlessly transition to ISO 20022 standards.",
    path: "/mt-mx",
    image: "tools-logo/with-background/mt-mx.png",
    icon: <TransformOutlinedIcon sx={{ width: 23, height: 23 }} />,
    component: <MtToMx />,
    url: " https://wso2.com/solutions/financial-services/",
    githubContent: MTMXGITHUBCONTENT,
    status: Config.tools.MT_TO_MX
      ? ToolStatus.active
      : ToolStatus.maintenance,
  }
];
