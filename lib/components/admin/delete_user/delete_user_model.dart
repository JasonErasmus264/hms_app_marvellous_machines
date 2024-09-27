import '/backend/api_requests/api_calls.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/form_field_controller.dart';
import 'delete_user_widget.dart' show DeleteUserWidget;
import 'package:flutter/material.dart';

class DeleteUserModel extends FlutterFlowModel<DeleteUserWidget> {
  ///  State fields for stateful widgets in this component.

  // State field(s) for DropDown widget.
  int? dropDownValue;
  FormFieldController<int>? dropDownValueController;
  // Stores action output result for [Backend Call - API (Delete)] action in DropDown widget.
  ApiCallResponse? delete;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {}
}
