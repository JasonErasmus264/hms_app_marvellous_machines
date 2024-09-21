import '/backend/api_requests/api_calls.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'enter_pin_widget.dart' show EnterPinWidget;
import 'package:flutter/material.dart';

class EnterPinModel extends FlutterFlowModel<EnterPinWidget> {
  ///  State fields for stateful widgets in this component.

  // State field(s) for ResetCode widget.
  TextEditingController? resetCode;
  String? Function(BuildContext, String?)? resetCodeValidator;
  // Stores action output result for [Backend Call - API (Verify Reset Code)] action in Button widget.
  ApiCallResponse? apiResult;

  @override
  void initState(BuildContext context) {
    resetCode = TextEditingController();
  }

  @override
  void dispose() {
    resetCode?.dispose();
  }
}
