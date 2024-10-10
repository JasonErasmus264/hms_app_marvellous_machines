import '/backend/api_requests/api_calls.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/form_field_controller.dart';
import 'delete_user_module_widget.dart' show DeleteUserModuleWidget;
import 'package:flutter/material.dart';

class DeleteUserModuleModel extends FlutterFlowModel<DeleteUserModuleWidget> {
  ///  State fields for stateful widgets in this component.

  final formKey = GlobalKey<FormState>();
  // State field(s) for DropDownModule widget.
  int? dropDownModuleValue;
  FormFieldController<int>? dropDownModuleValueController;
  // State field(s) for DropDownUser widget.
  int? dropDownUserValue;
  FormFieldController<int>? dropDownUserValueController;
  // Stores action output result for [Backend Call - API (Delete User Module)] action in Button widget.
  ApiCallResponse? apiResult;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {}
}
