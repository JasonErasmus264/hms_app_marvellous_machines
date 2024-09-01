import '/flutter_flow/flutter_flow_util.dart';
import 'add_assignment_widget.dart' show AddAssignmentWidget;
import 'package:flutter/material.dart';

class AddAssignmentModel extends FlutterFlowModel<AddAssignmentWidget> {
  ///  State fields for stateful widgets in this page.

  final unfocusNode = FocusNode();
  // State field(s) for TextField widget.
  FocusNode? textFieldFocusNode1;
  TextEditingController? textController1;
  String? Function(BuildContext, String?)? textController1Validator;
  // State field(s) for TextField widget.
  FocusNode? textFieldFocusNode2;
  TextEditingController? textController2;
  String? Function(BuildContext, String?)? textController2Validator;
  // State field(s) for txtFirstName widget.
  FocusNode? txtFirstNameFocusNode;
  TextEditingController? txtFirstNameTextController;
  String? Function(BuildContext, String?)? txtFirstNameTextControllerValidator;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {
    textFieldFocusNode1?.dispose();
    textController1?.dispose();

    textFieldFocusNode2?.dispose();
    textController2?.dispose();

    txtFirstNameFocusNode?.dispose();
    txtFirstNameTextController?.dispose();
  }
}
