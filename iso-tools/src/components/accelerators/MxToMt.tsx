import { HttpRequestConfig, useAuthContext } from "@asgardeo/auth-react";
import { Box, Container } from "@mui/material";
import DOMPurify from "dompurify";
import React, { useCallback, useContext, useState } from "react";
import { THROTTLED_OUT_PAGE_TITLE } from "../../configs/TextConstants";
import { MX_TO_MT_URL } from "../../configs/Constants";
// import LoginOverlay from "../authentication/LoginOverlay";
import { DarkModeContext } from "../context/DarkModeContext";
import ErrorDisplay from "../error/ErrorDisplay";
import ErrorOverlay from "../error/ErrorOverlay";
import BasicTabs from "../execution/BasicTabs";
import { CodeEditor } from "../execution/CodeEditor";
import { xml } from "@codemirror/lang-xml";

const Config = window.Config;
const unsupported_error = "Streamline your message conversions with our full-featured API. " +
  "This tool is a preview of our capabilities, and currently supports only selected message types: " +
  Config.supportedMXMsgTypes.join(", ") + ". " +
  "\nContact us to unlock full access and simplify your workflow.";


interface State {
  input: string;
  output: string;
  errorMessage: string;
  isError: boolean;
  isLoading: boolean;
  outputType: string;
  statusCode: string;
  showErrorOverlay: boolean;
  overlayErrorMessage: string;
}

export const MxToMt = () => {
  const [state, setState] = useState<State>({
    input: "",
    output: "",
    errorMessage: "",
    isError: false,
    isLoading: false,
    outputType: "json",
    statusCode: "500",
    showErrorOverlay: false,
    overlayErrorMessage: "",
  });

  const { state: authState, httpRequest } = useAuthContext();
  const { isAuthenticated = false } = authState;

  const [screenWidth, setScreenWidth] = React.useState<number>(
    window.innerWidth
  );
  const handleResize = (): void => setScreenWidth(window.innerWidth);
  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    input,
    output,
    errorMessage,
    isError,
    isLoading,
    outputType,
    statusCode,
    showErrorOverlay,
    overlayErrorMessage,
  } = state;

  const { darkMode, setDarkMode } = useContext(DarkModeContext);

  const handleInputChange = useCallback((value: string) => {
    setState((prevState) => ({
      ...prevState,
      input: value,
    }));
  }, []);

  const handleInputClear = () => {
    setState((prevState) => ({
      ...prevState,
      input: "",
    }));
  };

  const validateInput = () => {
    if (state.input !== "") {
      const cleanInput = DOMPurify.sanitize(state.input);
      setState((prevState) => ({
        ...prevState,
        input: cleanInput,
      }));
    }
  };

  const handleOutputClear = () => {
    setState((prevState) => ({
      ...prevState,
      output: "",
      isError: false,
    }));
  };

  const readFile = (fileInput?: string | ArrayBuffer | null) => {
    if (typeof fileInput == "string") {
      setState((prevState) => ({
        ...prevState,
        input: fileInput,
      }));
    }
  };

  const handleCloseErrorOverlay = () => {
    setState((prevState) => ({
      ...prevState,
      showErrorOverlay: false,
      overlayErrorMessage: "",
    }));
  };


const handleSubmit = async () => {
  const data = input;

  try {
    const Config = window.Config;
    const res = await fetch(`${Config.BACKEND_BASE_URL}${MX_TO_MT_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
        'Accept': 'text/plain',
      },
      body: data,
    });
    if (!res.ok) {
      // Try to parse error as JSON and show only the message
      const errorText = await res.text();
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) {
          const fullErrorMessage = "Error while transforming ISO 20022 message: " + errorJson.message;
          
          // Check if it's the specific error message we want to show in overlay
          if (errorJson.message === "Invalid ISO 20022 message format" || errorJson.message === "Unsupported MX message type") {
            setState((prevState) => ({
              ...prevState,
              showErrorOverlay: true,
              overlayErrorMessage: unsupported_error,
              isLoading: false,
            }));
          } else {
            setState((prevState) => ({
              ...prevState,
              output: fullErrorMessage,
              isLoading: false,
            }));
          }
        } else {
          setState((prevState) => ({
            ...prevState,
            output: 'Unknown error',
            isLoading: false,
          }));
        }
      } catch {
       setState((prevState) => ({
            ...prevState,
            output: 'Unknown error',
            isLoading: false,
          }));
      }
      return;
    }
    const result = await res.text(); // Use .text() if response is plain text
    console.log(result);
    setState((prevState) => ({
        ...prevState,
        output: result,
        isLoading: false,
      }));
  } catch (error) {
    alert('Network error');
  }
};

  const callBackend = () => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
      output: "",
      isError: false,
      errorMessage: "",
    }));

    validateInput();
    const Config = window.Config;
    const requestConfig: HttpRequestConfig = {
      url: Config.BACKEND_BASE_URL + MX_TO_MT_URL,
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "text/plain"
      },
      data: input,
    };
    
    httpRequest(requestConfig)
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          output: JSON.stringify(res.data, null, 2),
          isLoading: false,
        }));
      })
      .catch((error) => {
        console.error("Error calling backend:", error);
        setState((prevState) => ({
          ...prevState,
          statusCode: error.response.status,
          output: JSON.stringify(error.response.data, null, 2),
          errorMessage: error.response.data,
          isError: true,
          isLoading: false,
        }));
      });


  };

  const inputEditor = (
    <CodeEditor
      title="MX(ISO 20022) Message"
      value={input}
      // readOnly={!isAuthenticated}
      onChange={handleInputChange}
      darkMode={darkMode}
      onClear={handleInputClear}
      onExecute={handleSubmit}
      placeholder="Paste or upload a ISO 20022 message here..."
      fileType="xml"
      uploadEnabled
      readFile={readFile}
      clearEnabled
      width="100%"
      height="calc(100vh - 197px)"
      id="comp-mt-to-mx-input-editor"
      aria-label="ISO 20022 Resource Editor"
      // isDisabled={!isAuthenticated}
      executeButtonToolTipText="Perform transformation"
      acceptFileTypes=".xml"
    />
  );

  const outputEditor = (
    <CodeEditor
      title="SWIFT MT Message"
      value={output}
      readOnly
      darkMode={darkMode}
      onClear={handleOutputClear}
      placeholder={
        isLoading ? "Loading..." : "SWIFT MT Message will be displayed here..."
      }
      extensions={[xml()]}
      downloadEnabled
      fileType="txt"
      downloadName="mx-to-mt-output"
      clearEnabled
      width="100%"
      height="calc(100vh - 197px)"
      id="comp-mx-to-mt-output-editor"
      aria-label="MX Resource Editor"
      // isDisabled={!isAuthenticated}
      isLoading={isLoading}
    />
  );

  return (
    <Container
      id="mx-to-mt-container"
      maxWidth={false}
      sx={{ display: "flex", flexDirection: "column", height: 1, mt: 0 }}
    >
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
        }}
        marginTop={5}
      >
        {screenWidth < 900 && (
          <>
            <BasicTabs
              inputEditor={inputEditor}
              outputEditor={outputEditor}
              isInterectable={isAuthenticated}
              statusCode={statusCode}
              isError={isError}
              errorMessage={errorMessage}
            ></BasicTabs>
          </>
        )}
        {screenWidth >= 900 && (
          <>
            {/* {!isAuthenticated && <LoginOverlay />} */}
            {/* {!authState.isAuthenticated && <button onClick={ () => signIn() }>Login</button>} */}
            <Box
              sx={{
                pr: 1,
                pb: 1,
                width: "50%",
              }}
              id="box-mx-to-mt-resource-box"
              aria-label="MX to MT Resource Box"
            >
              {inputEditor}
            </Box>
            <Box
              sx={{
                pl: 1,
                pb: 1,
                width: "50%",
              }}
              id="box-mx-to-mt-resource-box"
              aria-label="MT MX Resource Box"
            >
              <>
                {isError && (
                  <ErrorDisplay
                    statusCode={statusCode}
                    message={
                      statusCode == "429"
                        ? THROTTLED_OUT_PAGE_TITLE
                        : errorMessage
                    }
                  />
                )}
                {outputEditor}
              </>
            </Box>
          </>
        )}
      </Box>
      
      <ErrorOverlay
        message={overlayErrorMessage}
        onClose={handleCloseErrorOverlay}
        isVisible={showErrorOverlay}
      />
    </Container>
  );
};
