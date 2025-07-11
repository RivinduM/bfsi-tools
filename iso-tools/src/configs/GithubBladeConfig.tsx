import { Box, Link, Typography } from "@mui/material";
import { ReactElement } from "react";

export const MTMXGITHUBCONTENT: ReactElement = (
  <Typography
    variant="body1"
    align="justify"
    maxWidth="lg"
    color="text.secondary"
    lineHeight={{ xs: 1.7, md: 1.9 }}
  >
    This tool transforms MT messages to ISO 20022 format. Data transformation
    conditions are taken from the{" "}
    <Link
      href="https://www2.swift.com/mapping/#/"
      target="_blank"
      color="secondary.main"
      sx={{ textDecoration: "none" }}
    >
      official ISO 20022 mappings guide
    </Link>{" "}
    and based on the feedback received from the users. The service is written in{" "}
    <Link
      href="https://ballerina.io/use-cases/integration/"
      target="_blank"
      color="secondary.main"
      sx={{ textDecoration: "none" }}
    >
      Ballerina
    </Link>{" "}
    and hosted in{" "}
    <Link
      href="https://console.choreo.dev/"
      target="_blank"
      color="secondary.main"
      sx={{ textDecoration: "none" }}
    >
      Choreo
    </Link>
    .{" "}
    <Box component="span" fontWeight="bold">
      This tool should not be used in a production environment.
    </Box>{" "}
    We do not store any of the data you pasted/uploaded to the tool. If you want
    to use these services in a production setting, please contact us. For more
    information, checkout our{" "}
    <Link
      href="https://github.com/ballerina-platform/module-ballerinax-financial.swiftmt-to-iso20022"
      target="_blank"
      color="secondary.main"
      sx={{ textDecoration: "none" }}
    >
      Git repository
    </Link>
    .
  </Typography>
);

export const MXMTGITHUBCONTENT: ReactElement = (
  <Typography
    variant="body1"
    align="justify"
    maxWidth="lg"
    color="text.secondary"
    lineHeight={{ xs: 1.7, md: 1.9 }}
  >
    This tool transforms MX messages to SWIFT MT format. Data transformation
    conditions are taken from the{" "}
    <Link
      href="https://www2.swift.com/mapping/#/"
      target="_blank"
      color="secondary.main"
      sx={{ textDecoration: "none" }}
    >
      official ISO 20022 mappings guide
    </Link>{" "}
    and based on the feedback received from the users. The service is written in{" "}
    <Link
      href="https://ballerina.io/use-cases/integration/"
      target="_blank"
      color="secondary.main"
      sx={{ textDecoration: "none" }}
    >
      Ballerina
    </Link>{" "}
    and hosted in{" "}
    <Link
      href="https://console.choreo.dev/"
      target="_blank"
      color="secondary.main"
      sx={{ textDecoration: "none" }}
    >
      Choreo
    </Link>
    .{" "}
    <Box component="span" fontWeight="bold">
      This tool should not be used in a production environment.
    </Box>{" "}
    We do not store any of the data you pasted/uploaded to the tool. If you want
    to use these services in a production setting, please contact us. For more
    information, checkout our{" "}
    <Link
      href="https://github.com/ballerina-platform/module-ballerinax-financial.iso20022-to-swiftmt"
      target="_blank"
      color="secondary.main"
      sx={{ textDecoration: "none" }}
    >
      Git repository
    </Link>
    .
  </Typography>
);
