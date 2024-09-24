import '/backend/api_requests/api_calls.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/form_field_controller.dart';
import 'update_user_widget.dart' show UpdateUserWidget;
import 'package:flutter/material.dart';

class UpdateUserModel extends FlutterFlowModel<UpdateUserWidget> {
  ///  State fields for stateful widgets in this page.

  final formKey = GlobalKey<FormState>();
  // State field(s) for DropDown widget.
  int? dropDownValue1;
  FormFieldController<int>? dropDownValueController1;
  // Stores action output result for [Backend Call - API (Get User Info)] action in DropDown widget.
  ApiCallResponse? getUserInfo;
  // State field(s) for txtFirstName widget.
  FocusNode? txtFirstNameFocusNode;
  TextEditingController? txtFirstNameTextController;
  String? Function(BuildContext, String?)? txtFirstNameTextControllerValidator;
  String? _txtFirstNameTextControllerValidator(
      BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return 'Enter your first name';
    }

    if (val.length > 45) {
      return 'Maximum characters reached';
    }

    return null;
  }

  // State field(s) for txtLastName widget.
  FocusNode? txtLastNameFocusNode;
  TextEditingController? txtLastNameTextController;
  String? Function(BuildContext, String?)? txtLastNameTextControllerValidator;
  String? _txtLastNameTextControllerValidator(
      BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return 'Enter your last name';
    }

    if (val.length > 45) {
      return 'Maximum characters reached';
    }

    return null;
  }

  // State field(s) for txtPhoneNum widget.
  FocusNode? txtPhoneNumFocusNode;
  TextEditingController? txtPhoneNumTextController;
  String? Function(BuildContext, String?)? txtPhoneNumTextControllerValidator;
  String? _txtPhoneNumTextControllerValidator(
      BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return 'Enter your phone number';
    }

    if (val.length < 10) {
      return 'Phone number too short';
    }
    if (val.length > 10) {
      return 'Phone number too long';
    }

    return null;
  }

  // State field(s) for DropDown widget.
  String? dropDownValue2;
  FormFieldController<String>? dropDownValueController2;
  // Stores action output result for [Backend Call - API (Update User Info)] action in Button widget.
  ApiCallResponse? updateUser;

  @override
  void initState(BuildContext context) {
    txtFirstNameTextControllerValidator = _txtFirstNameTextControllerValidator;
    txtLastNameTextControllerValidator = _txtLastNameTextControllerValidator;
    txtPhoneNumTextControllerValidator = _txtPhoneNumTextControllerValidator;
  }

  @override
  void dispose() {
    txtFirstNameFocusNode?.dispose();
    txtFirstNameTextController?.dispose();

    txtLastNameFocusNode?.dispose();
    txtLastNameTextController?.dispose();

    txtPhoneNumFocusNode?.dispose();
    txtPhoneNumTextController?.dispose();
  }
}
