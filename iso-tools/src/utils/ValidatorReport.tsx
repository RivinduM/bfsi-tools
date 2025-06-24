import { FHIR_VALIDATION_URL } from "../configs/Constants";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "./vfs_fontes_local"; // local import
(pdfMake as any).vfs = pdfFonts.default;

/*
 * Converts an image (local or remote) to a base64 encoded Data URL.

 * The function creates a new Image object and sets its `src` attribute to the provided URL.
 * When the image is fully loaded, it's drawn onto a canvas element with the same dimensions as the image.
 * The `toDataURL` method is then called on the canvas to create a base64 encoded PNG Data URL.
 * If the image fails to load, the Promise is rejected with the error.
 */
export const getDataUrlFromImage = (url: string) => {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.setAttribute("crossOrigin", "anonymous");

    img.onload = () => {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      var ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
      }

      var dataURL = canvas.toDataURL("image/png");

      resolve(dataURL);
    };

    img.onerror = (error) => {
      reject(error);
    };

    img.src = url;
  });
};

//Function to create and download the pdf
export const downloadPdf = async (
  inputString: String,   //User entered input (JSON string)
  errorLines: string[],  //List of errors
  errorNumbers: number[] //List of line numbers where errors are present
) => {
const Config = window.Config;
const redirectBaseUrl = Config.BFF_BASE_URL;

  var docDefinition: any = {
    header: {
      image: await getDataUrlFromImage("pdf-icon.png"),
      width: 80,
      alignment: "right",
      margin: [0, 8, 4, 0],
    },
    //Header background Styling
    background: (currentPage: number) => {
      if (currentPage === 1) {
        return {
          canvas: [
            {
              type: "rect",
              x: 0,
              y: 0,
              w: 600,
              h: 90,
              color: "#f0f0f0",
            },
          ],
        };
      } else {
        return {}; // No background for other pages
      }
    },
    
    content: [
      { text: "FHIR Validator - Report", style: "header", id: "header" },
      {
        text: "Go to validator",
        link: redirectBaseUrl + FHIR_VALIDATION_URL,
        style: "externalLink",
      },
      {
        table: {
          headerRows: 1,
          widths: [150, "*"],
          body: [
            [
              { text: "Status", bold: true },
              { text: "Failed", alignment: "right", color: "red", bold: true },
            ],
            [
              { text: "Detailed errors", bold: true },
              {
                text: "View Error Details",
                linkToDestination: "errorsTitle",
                style: "localLink",
              },
            ],
          ],
        },
        margin: [0, 40, 0, 20],
      },
      { text: "Input", style: "inputTitle" },
    ],
    // Define styles here
    styles: {
      index: {
        fontSize: 12,
        color: "#5E5F62",
        bold: true
      },
      line: {
        fontSize: 12,
        color: "#5E5F62"
      },
      highlight: {
        background: "#ff6c6c"
      },
      header: {
        alignment: "center",
        color: "#00A79D",
        fontSize: 20,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      localLink: {
        color: "#007BFF",
        fontSize: 12,
        decoration: "underline",
        italics: true,
        alignment: "right"
      },
      externalLink: {
        color: "#007BFF",
        fontSize: 10,
        decoration: "underline",
        italics: true
      },
      errorsTitle: {
        color: "#00A79D",
        fontSize: 16,
        margin: [0, 50, 0, 15],
        bold: true
      },
      inputTitle: {
        color: "#00A79D",
        fontSize: 16,
        margin: [0, 0, 0, 10],
        bold: true
      },
      dateTime:{
        color: "#5E5F62",
        margin: [0, 60, 0, 0],
        fontSize: 9
      }
    },
  };

  //Converts the input string to required format
  let jsonString = JSON.stringify(inputString, null, 2);
  let unescapedString = JSON.parse(jsonString);
  const jsonArr = unescapedString.split("\n");

  //Add each line of the input string to the pdf with the error highlighiting
  jsonArr.forEach((line: string, index: number) => {
    docDefinition.content.push({
      text: [
        { text: `${index + 1}`, style: "index" },
        { text: `  ` },
        {
          text: ` ${line}`,
          style: errorNumbers.includes(index) ? [`highlight`] : [`line`],
        },
      ],
    });
  });

  docDefinition.content.push({
    text: "Errors",
    id: "errorsTitle",
    style: "errorsTitle",
  });

  //Add each error to the pdf
  errorLines.forEach((error: String, index: number) => {
    docDefinition.content.push({
      text: `${index + 1}.   ${error}`,
      style: "line",
    });
  });

  //Add a link to go back to the top of the pdf
  docDefinition.content.push({
    text: "Back to top",
    linkToDestination: "header",
    style: "localLink",
  });

  //Add the generated date/time to the pdf
  docDefinition.content.push({
    text: "Generated on: " + getCurrentDateTime(),
    style: "dateTime",
  });

  pdfMake.createPdf(docDefinition).download("fhirtools-validator-report");
};

//Function to get the current date and time
const getCurrentDateTime = (): String => {
  let currentDate = new Date();
  let desiredFormat = currentDate.toLocaleString("en-US", {
    weekday: "short", 
    year: "numeric", 
    month: "short",
    day: "numeric", 
    hour: "2-digit", 
    minute: "2-digit", 
    second: "2-digit",
  });

  return desiredFormat;
};
