import '/backend/api_requests/api_calls.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/form_field_controller.dart';
import 'edit_module_widget.dart' show EditModuleWidget;
import 'package:flutter/material.dart';

class EditModuleModel extends FlutterFlowModel<EditModuleWidget> {
  ///  State fields for stateful widgets in this component.

  final formKey = GlobalKey<FormState>();
  // State field(s) for DropDown widget.
  int? dropDownValue;
  FormFieldController<int>? dropDownValueController;
  // Stores action output result for [Backend Call - API (Get Module)] action in DropDown widget.
  ApiCallResponse? getModule;
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

  // Stores action output result for [Backend Call - API (Update Module)] action in Button widget.
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
