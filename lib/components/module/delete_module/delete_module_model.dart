import '/backend/api_requests/api_calls.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/form_field_controller.dart';
import 'delete_module_widget.dart' show DeleteModuleWidget;
import 'package:flutter/material.dart';

class DeleteModuleModel extends FlutterFlowModel<DeleteModuleWidget> {
  ///  State fields for stateful widgets in this component.

  // State field(s) for DropDown widget.
  int? dropDownValue;
  FormFieldController<int>? dropDownValueController;
  // Stores action output result for [Backend Call - API (Delete Module)] action in DropDown widget.
  ApiCallResponse? delete;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {}
}
