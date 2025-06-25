import ballerina/http;
import ballerina/log;
import ballerinax/financial.iso20022ToSwiftmt as mxToMt;
import ballerinax/financial.swiftmtToIso20022 as mtToMx;
import ballerinax/financial.swift.mt as swiftmt;
import ballerina/lang.regexp;

# A service representing a network-accessible API
# bound to port `9090`.
service /iso on new http:Listener(9090) {

    # A resource for generating greetings
    # + name - name as a string or nil
    # + return - string name with hello message or error
    resource function get greeting(string? name) returns string|error {
        // Send a response back to the caller.
        if name is () {
            return error("name should not be empty!");
        }
        return string `Hello, ${name}`;
    }

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
        log:printError("MT message transformed to ISO20022 successfully.");
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
