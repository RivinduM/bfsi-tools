import ballerina/http;
import ballerina/log;
import ballerinax/financial.iso20022ToSwiftmt as mxToMt;
import ballerinax/financial.swiftmtToIso20022 as mtToMx;
import ballerinax/financial.swift.mt as swiftmt;
import ballerina/lang.regexp;

// configurable string tokenUrl = ?;
// configurable string clientId = ?;
// configurable string clientSecret = ?;
// configurable string v2tofhirAPIUrl = ?;
// configurable string ccdatofhirAPIUrl = ?;

// http:ClientConfiguration config = {
//     auth: {
//         tokenUrl: tokenUrl,
//         clientId: clientId,
//         clientSecret: clientSecret
//     }
// };

// final http:Client v2tofhirClient = check new (v2tofhirAPIUrl, config);
// final http:Client ccdatofhirClient = check new (ccdatofhirAPIUrl, config);

// // Represents the subtype of http:Ok status code record.
// type BffResponse record {|
//     *http:Ok;
//     string mediaType;
//     json body;
// |};

// const FHIR_MIME_TYPE_JSON = "application/fhir+json";

// service / on new http:Listener(9080) {

//     # + return - a json
//     resource function post v2tofhir/transform(@http:Payload string hl7msg) returns BffResponse|error {
//         // Invoke the v2tofhir service
//         json result = check v2tofhirClient->/transform.post(hl7msg);
//         return {body: result, mediaType: FHIR_MIME_TYPE_JSON};
//     }
//     resource function post ccdatofhir/transform(@http:Payload xml clinicalDocument) returns BffResponse|error {
//         // Invoke the c-cda service: must have a xml payload
//         json result = check ccdatofhirClient->/transform.post(clinicalDocument);
//         return {body: result, mediaType: FHIR_MIME_TYPE_JSON};
//     }
// }

service / on new http:Listener(9081) {
     resource function post mt\-mx/transform(@http:Payload string swiftMessage) returns xml|error {
        // log:printError(string `Message received: ` + swiftMessage);
        regexp:RegExp mtRegex = re `^\{1:[^\}]+\}\{2:[^\}]+\}(\{3:[^\}]+\})?\}\{4:(\n.*)*(\{5:[^\}]+\})*`;
        if !mtRegex.isFullMatch(swiftMessage) {
            log:printError("Invalid MT message format");
            return error("Invalid MT message format");
        }

        xml|error transformedMsg = mtToMx:toIso20022Xml(swiftMessage);
        if transformedMsg is error {
            log:printError("Error while transforming MT message", err = transformedMsg.toBalString());
        }
        return transformedMsg;
    }

    resource function post mx\-mt/transform(@http:Payload xml iso20022Message) returns string|error {
        log:printError(string `Message received: ` + iso20022Message.toString());
        record {}|error isoRecord  = mxToMt:toSwiftMtMessage(iso20022Message);
        if isoRecord is error {
            log:printError("Error occurred while converting the ISO20022 message to SWIFT MT message.");
            return isoRecord;
        }

        string|error mtMsgId = (<record {}>(<record {}>(<record {}>isoRecord["block4"])["MT20"])["msgId"])["content"].ensureType();
        string msgId = "";
        if mtMsgId is error {
            log:printWarn(string `Error occurred while getting the message ID. Generating random ID.`, msgId = msgId);
        } else {
            msgId = mtMsgId;
        }

        log:printDebug("ISO20022 message converted to SWIFT MT message successfully.");
        string|error finMessage = swiftmt:toFinMessage(isoRecord);
        if finMessage is error {
            log:printError("Error occurred while getting the FIN message.");
        }
        return finMessage;
    }
}

