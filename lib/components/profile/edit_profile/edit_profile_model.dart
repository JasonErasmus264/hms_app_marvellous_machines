import '/backend/api_requests/api_calls.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'edit_profile_widget.dart' show EditProfileWidget;
import 'package:flutter/material.dart';

class EditProfileModel extends FlutterFlowModel<EditProfileWidget> {
  ///  State fields for stateful widgets in this component.

  final formKey = GlobalKey<FormState>();
  bool isDataUploading = false;
  FFUploadedFile uploadedLocalFile =
      FFUploadedFile(bytes: Uint8List.fromList([]));

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

  // Stores action output result for [Backend Call - API (Update User)] action in Button widget.
  ApiCallResponse? apiResult;

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
