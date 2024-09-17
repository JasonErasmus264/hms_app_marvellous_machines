import '/flutter_flow/flutter_flow_util.dart';
import 'enter_pin_widget.dart' show EnterPinWidget;
import 'package:flutter/material.dart';

class EnterPinModel extends FlutterFlowModel<EnterPinWidget> {
  ///  State fields for stateful widgets in this component.

  // State field(s) for PinCode widget.
  TextEditingController? pinCodeController;
  String? Function(BuildContext, String?)? pinCodeControllerValidator;

  @override
  void initState(BuildContext context) {
    pinCodeController = TextEditingController();
  }

  @override
  void dispose() {
    pinCodeController?.dispose();
  }
}
