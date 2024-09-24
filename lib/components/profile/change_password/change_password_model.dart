import '/backend/api_requests/api_calls.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'change_password_widget.dart' show ChangePasswordWidget;
import 'package:flutter/material.dart';

class ChangePasswordModel extends FlutterFlowModel<ChangePasswordWidget> {
  ///  State fields for stateful widgets in this component.

  final formKey = GlobalKey<FormState>();
  // State field(s) for txtUsername widget.
  FocusNode? txtUsernameFocusNode;
  TextEditingController? txtUsernameTextController;
  String? Function(BuildContext, String?)? txtUsernameTextControllerValidator;
  String? _txtUsernameTextControllerValidator(
      BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return 'Enter your username';
    }

    if (val.length < 6) {
      return 'Minimum characters reached';
    }
    if (val.length > 6) {
      return 'Maximum characters reached';
    }

    return null;
  }

  // State field(s) for txtCurrentPass widget.
  FocusNode? txtCurrentPassFocusNode;
  TextEditingController? txtCurrentPassTextController;
  late bool txtCurrentPassVisibility;
  String? Function(BuildContext, String?)?
      txtCurrentPassTextControllerValidator;
  String? _txtCurrentPassTextControllerValidator(
      BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return 'Enter your current password';
    }

    return null;
  }

  // State field(s) for txtNewPass widget.
  FocusNode? txtNewPassFocusNode;
  TextEditingController? txtNewPassTextController;
  late bool txtNewPassVisibility;
  String? Function(BuildContext, String?)? txtNewPassTextControllerValidator;
  String? _txtNewPassTextControllerValidator(
      BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return 'Enter your new password';
    }

    return null;
  }

  // State field(s) for txtConfirmPass widget.
  FocusNode? txtConfirmPassFocusNode;
  TextEditingController? txtConfirmPassTextController;
  late bool txtConfirmPassVisibility;
  String? Function(BuildContext, String?)?
      txtConfirmPassTextControllerValidator;
  String? _txtConfirmPassTextControllerValidator(
      BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return 'Enter the new password again here';
    }

    return null;
  }

  // Stores action output result for [Backend Call - API (Update Password)] action in Button widget.
  ApiCallResponse? updatePass;

  @override
  void initState(BuildContext context) {
    txtUsernameTextControllerValidator = _txtUsernameTextControllerValidator;
    txtCurrentPassVisibility = false;
    txtCurrentPassTextControllerValidator =
        _txtCurrentPassTextControllerValidator;
    txtNewPassVisibility = false;
    txtNewPassTextControllerValidator = _txtNewPassTextControllerValidator;
    txtConfirmPassVisibility = false;
    txtConfirmPassTextControllerValidator =
        _txtConfirmPassTextControllerValidator;
  }

  @override
  void dispose() {
    txtUsernameFocusNode?.dispose();
    txtUsernameTextController?.dispose();

    txtCurrentPassFocusNode?.dispose();
    txtCurrentPassTextController?.dispose();

    txtNewPassFocusNode?.dispose();
    txtNewPassTextController?.dispose();

    txtConfirmPassFocusNode?.dispose();
    txtConfirmPassTextController?.dispose();
  }
}
