import '/backend/api_requests/api_calls.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'add_module_widget.dart' show AddModuleWidget;
import 'package:flutter/material.dart';

class AddModuleModel extends FlutterFlowModel<AddModuleWidget> {
  ///  State fields for stateful widgets in this component.

  final formKey = GlobalKey<FormState>();
  // State field(s) for txtCode widget.
  FocusNode? txtCodeFocusNode;
  TextEditingController? txtCodeTextController;
  String? Function(BuildContext, String?)? txtCodeTextControllerValidator;
  String? _txtCodeTextControllerValidator(BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return 'Enter the module code';
    }

    return null;
  }

  // State field(s) for txtName widget.
  FocusNode? txtNameFocusNode;
  TextEditingController? txtNameTextController;
  String? Function(BuildContext, String?)? txtNameTextControllerValidator;
  String? _txtNameTextControllerValidator(BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return 'Enter the module name';
    }

    return null;
  }

  // Stores action output result for [Backend Call - API (Add Module)] action in Button widget.
  ApiCallResponse? apiResult;

  @override
  void initState(BuildContext context) {
    txtCodeTextControllerValidator = _txtCodeTextControllerValidator;
    txtNameTextControllerValidator = _txtNameTextControllerValidator;
  }

  @override
  void dispose() {
    txtCodeFocusNode?.dispose();
    txtCodeTextController?.dispose();

    txtNameFocusNode?.dispose();
    txtNameTextController?.dispose();
  }
}
