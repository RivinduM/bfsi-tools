import { HttpRequestConfig, useAuthContext } from "@asgardeo/auth-react";
import { Box, Container } from "@mui/material";
import DOMPurify from "dompurify";
import React, { useCallback, useContext, useState } from "react";
import { THROTTLED_OUT_PAGE_TITLE } from "../../configs/TextConstants";
import { MT_TO_MX_URL } from "../../configs/Constants";
// import LoginOverlay from "../authentication/LoginOverlay";
import { DarkModeContext } from "../context/DarkModeContext";
import ErrorDisplay from "../error/ErrorDisplay";
import BasicTabs from "../execution/BasicTabs";
import { CodeEditor } from "../execution/CodeEditor";
import { xml } from "@codemirror/lang-xml";


interface State {
  input: string;
  output: string;
  errorMessage: string;
  isError: boolean;
  isLoading: boolean;
  outputType: string;
  statusCode: string;
}

export const MtToMx = () => {
  const [state, setState] = useState<State>({
    input: "",
    output: "",
    errorMessage: "",
    isError: false,
    isLoading: false,
    outputType: "json",
    statusCode: "500",
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


const handleSubmit = async () => {
  const data = input;

  try {
    const Config = window.Config;
    const res = await fetch(`${Config.BACKEND_BASE_URL}${MT_TO_MX_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Accept': 'application/xml',
      },
      body: data,
    });
    if (!res.ok) {
      // Try to parse error as JSON and show only the message
      const errorText = await res.text();
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) {
          setState((prevState) => ({
            ...prevState,
            output: "Error while transforming MT message: " + errorJson.message,
            isLoading: false,
          }));
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
      url: Config.BACKEND_BASE_URL + MT_TO_MX_URL,
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
      title="MT Message"
      value={input}
      // readOnly={!isAuthenticated}
      onChange={handleInputChange}
      darkMode={darkMode}
      onClear={handleInputClear}
      onExecute={handleSubmit}
      placeholder="Paste or upload a SWIFT MT message here..."
      fileType="txt"
      uploadEnabled
      readFile={readFile}
      clearEnabled
      width="100%"
      height="calc(100vh - 197px)"
      id="comp-mt-to-mx-input-editor"
      aria-label="MT Resource Editor"
      // isDisabled={!isAuthenticated}
      executeButtonToolTipText="Perform transformation"
      acceptFileTypes=".txt"
    />
  );

  // Simple XML pretty-print function
function formatXml(xml: string) {
  const PADDING = '  '; // set desired indent size
  const reg = /(>)(<)(\/*)/g;
  let pad = 0;
  return xml
    .replace(reg, '$1\r\n$2$3')
    .split('\r\n')
    .map((node) => {
      let indent = '';
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = PADDING.repeat(pad);
      } else if (node.match(/^<\/\w/)) {
        pad = pad > 0 ? pad - 1 : 0;
        indent = PADDING.repeat(pad);
      } else if (node.match(/^<\w([^>]*[^/])?>.*$/)) {
        indent = PADDING.repeat(pad);
        pad += 1;
      } else {
        indent = PADDING.repeat(pad);
      }
      return indent + node;
    })
    .join('\n');
}

  const outputEditor = (
    <CodeEditor
      title="MX Message (ISO 20022)"
      value={formatXml(output)}
      readOnly
      darkMode={darkMode}
      onClear={handleOutputClear}
      placeholder={
        isLoading ? "Loading..." : "ISO 20022(MX) Message will be displayed here..."
      }
      extensions={[xml()]}
      downloadEnabled
      fileType="xml"
      downloadName="mt-to-mx-output"
      clearEnabled
      width="100%"
      height="calc(100vh - 197px)"
      id="comp-mt-to-mx-output-editor"
      aria-label="MT Resource Editor"
      // isDisabled={!isAuthenticated}
      isLoading={isLoading}
    />
  );

  return (
    <Container
      id="mt-to-mx-container"
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
              id="box-mt-mx-resource-box"
              aria-label="MT MX Resource Box"
            >
              {inputEditor}
            </Box>
            <Box
              sx={{
                pl: 1,
                pb: 1,
                width: "50%",
              }}
              id="box-mt-mx-resource-box"
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
    </Container>
  );
};
