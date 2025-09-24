const Config = {
    APP_AUTH_CLIENT_ID: "gEZiH2v8dfmjwKTcHI4Ts9IEORoa",
    APP_AUTH_BASE_URL: "https://api.asgardeo.io/t/wso2ob",
    // APP_AUTH_REDIRECT_BASE_URL: "https://4a8a9ab6-235b-4ce4-85fc-96d9223c9bd1.e1-us-east-azure.choreoapps.dev",
    APP_AUTH_REDIRECT_BASE_URL: "http://localhost:3000",
    //  BACKEND_BASE_URL: "https://6755ee75-a57a-4518-8c81-d08d1d3fd10d-dev.e1-us-east-azure.choreoapis.dev/iso/backend-service/v1.0",
   BACKEND_BASE_URL: "http://localhost:9090/iso",

    // Enable/Disable features
    tools: {
        MT_TO_MX: true,
        MX_TO_MT: true,
        ISO8583: false,
        OPEN_BANKING_SANDBOX: true
    },
    supportedMXMsgTypes: ["pacs.008", "pacs.009"],
    supportedMTMsgTypes: ["MT103", "MT202", "MT940"]
}
