import '/backend/api_requests/api_calls.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'add_assignment_widget.dart' show AddAssignmentWidget;
import 'package:flutter/material.dart';

class AddAssignmentModel extends FlutterFlowModel<AddAssignmentWidget> {
  ///  State fields for stateful widgets in this component.

  final formKey = GlobalKey<FormState>();
  // State field(s) for txtTitle widget.
  FocusNode? txtTitleFocusNode;
  TextEditingController? txtTitleTextController;
  String? Function(BuildContext, String?)? txtTitleTextControllerValidator;
  String? _txtTitleTextControllerValidator(BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return 'Enter a title';
    }

    return null;
  }

  // State field(s) for txtDescription widget.
  FocusNode? txtDescriptionFocusNode;
  TextEditingController? txtDescriptionTextController;
  String? Function(BuildContext, String?)?
      txtDescriptionTextControllerValidator;
  String? _txtDescriptionTextControllerValidator(
      BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return 'Enter a description';
    }

    return null;
  }

  // State field(s) for txtTotalMarks widget.
  FocusNode? txtTotalMarksFocusNode;
  TextEditingController? txtTotalMarksTextController;
  String? Function(BuildContext, String?)? txtTotalMarksTextControllerValidator;
  String? _txtTotalMarksTextControllerValidator(
      BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return 'Enter the total marks';
    }

    return null;
  }

  DateTime? datePicked1;
  DateTime? datePicked2;
  // Stores action output result for [Backend Call - API (Add Assignment)] action in Button widget.
  ApiCallResponse? apiResult;

  @override
  void initState(BuildContext context) {
    txtTitleTextControllerValidator = _txtTitleTextControllerValidator;
    txtDescriptionTextControllerValidator =
        _txtDescriptionTextControllerValidator;
    txtTotalMarksTextControllerValidator =
        _txtTotalMarksTextControllerValidator;
  }

  @override
  void dispose() {
    txtTitleFocusNode?.dispose();
    txtTitleTextController?.dispose();

    txtDescriptionFocusNode?.dispose();
    txtDescriptionTextController?.dispose();

    txtTotalMarksFocusNode?.dispose();
    txtTotalMarksTextController?.dispose();
  }
}
