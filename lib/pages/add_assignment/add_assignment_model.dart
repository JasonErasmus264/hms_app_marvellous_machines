import '/flutter_flow/flutter_flow_util.dart';
import 'add_assignment_widget.dart' show AddAssignmentWidget;
import 'package:flutter/material.dart';

class AddAssignmentModel extends FlutterFlowModel<AddAssignmentWidget> {
  ///  State fields for stateful widgets in this page.

  final formKey = GlobalKey<FormState>();
  // State field(s) for txtTitle widget.
  FocusNode? txtTitleFocusNode;
  TextEditingController? txtTitleTextController;
  String? Function(BuildContext, String?)? txtTitleTextControllerValidator;
  // State field(s) for txtDescription widget.
  FocusNode? txtDescriptionFocusNode;
  TextEditingController? txtDescriptionTextController;
  String? Function(BuildContext, String?)?
      txtDescriptionTextControllerValidator;
  DateTime? datePicked1;
  DateTime? datePicked2;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {
    txtTitleFocusNode?.dispose();
    txtTitleTextController?.dispose();

    txtDescriptionFocusNode?.dispose();
    txtDescriptionTextController?.dispose();
  }
}
