import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'empty_assignments_list_model.dart';
export 'empty_assignments_list_model.dart';

class EmptyAssignmentsListWidget extends StatefulWidget {
  const EmptyAssignmentsListWidget({super.key});

  @override
  State<EmptyAssignmentsListWidget> createState() =>
      _EmptyAssignmentsListWidgetState();
}

class _EmptyAssignmentsListWidgetState
    extends State<EmptyAssignmentsListWidget> {
  late EmptyAssignmentsListModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => EmptyAssignmentsListModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: const AlignmentDirectional(0.0, 0.0),
      child: Column(
        mainAxisSize: MainAxisSize.max,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.signal_cellular_no_sim_outlined,
            color: FlutterFlowTheme.of(context).secondaryText,
            size: 72.0,
          ),
          Padding(
            padding: const EdgeInsetsDirectional.fromSTEB(0.0, 16.0, 0.0, 0.0),
            child: Text(
              'No Assignments',
              style: FlutterFlowTheme.of(context).headlineMedium.override(
                    fontFamily: 'Urbanist',
                    letterSpacing: 0.0,
                  ),
            ),
          ),
          Padding(
            padding: const EdgeInsetsDirectional.fromSTEB(0.0, 4.0, 0.0, 0.0),
            child: Text(
              'It seems that you don\'t have any assignments.',
              style: FlutterFlowTheme.of(context).labelMedium.override(
                    fontFamily: 'Manrope',
                    letterSpacing: 0.0,
                  ),
            ),
          ),
        ],
      ),
    );
  }
}
