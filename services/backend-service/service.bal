import ballerina/http;
import ballerina/log;
import ballerinax/financial.iso20022ToSwiftmt as mxToMt;
import ballerinax/financial.swiftmtToIso20022 as mtToMx;
import ballerinax/financial.swift.mt as swiftmt;
import ballerina/lang.regexp;

configurable string[] supportedMTMsgTypes = [];
configurable string[] supportedMXMsgTypes = [];
configurable string[] allowOrigins = [];

# A service representing a network-accessible API
# bound to port `9090`.
@http:ServiceConfig {
    cors: {
        allowOrigins: allowOrigins
    }
}
service /iso on new http:Listener(9090) {

    resource function post mt\-mx/transform(@http:Payload string swiftMessage) returns xml|error {
        // log:printError(string `Message received: ` + swiftMessage);
        regexp:RegExp mtRegex = re `^\{1:[^\}]+\}(\{2:[^\}]+\})?(\{3:[^\}]+\}\})?(\{4:\n)?(.*\n)*-\}(\{5:[^\}]+\}\})?(\{S:.*\})*`;
        if !mtRegex.isFullMatch(swiftMessage.trim()) {
            log:printError("Invalid MT message format");
            return error("Invalid MT message format");
        }

        record {}|error parsedMsg = swiftmt:parse(swiftMessage);
        if parsedMsg is record{} && parsedMsg["block2"] is record {} {
            record {} block2 = <record {}>parsedMsg["block2"];
            string msgType = block2["messageType"] is string ? block2["messageType"].toString() : "";
            if supportedMTMsgTypes.indexOf(msgType) == () {
                string errMsg = "Unsupported MT message type";
                log:printError(errMsg, msgType = msgType);
                return error(errMsg);
            }
        }
        
        xml|error transformedMsg = mtToMx:toIso20022Xml(swiftMessage);
        if transformedMsg is error {
            log:printError("Error while transforming MT message", err = transformedMsg.toBalString());
        }
        log:printInfo("MT message transformed to ISO20022 successfully.");
        return transformedMsg;
    }

    resource function post mx\-mt/transform(@http:Payload xml iso20022Message) returns string|error {
        log:printInfo(string `Message received: ` + iso20022Message.toString());

        boolean isSupported = false;
        foreach string msgType in supportedMXMsgTypes {
            if iso20022Message.toBalString().includes("xsd:" + msgType) {
                isSupported = true;
                break;
            }
        }
        if !isSupported {
            string errMsg = "Unsupported MX message type";
            log:printError(errMsg);
            return error(errMsg);
        }

        record {}|error isoRecord  = mxToMt:toSwiftMtMessage(iso20022Message);
        if isoRecord is error {
            log:printError("Error occurred while converting the ISO20022 message to SWIFT MT message.");
            return isoRecord;
        }

        log:printDebug("ISO20022 message converted to SWIFT MT message successfully.");
        string|error finMessage = swiftmt:toFinMessage(isoRecord);
        if finMessage is error {
            log:printError("Error occurred while getting the FIN message.");
        }
        return finMessage;
    }
}
