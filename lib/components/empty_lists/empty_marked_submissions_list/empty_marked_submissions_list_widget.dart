import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'empty_marked_submissions_list_model.dart';
export 'empty_marked_submissions_list_model.dart';

class EmptyMarkedSubmissionsListWidget extends StatefulWidget {
  const EmptyMarkedSubmissionsListWidget({super.key});

  @override
  State<EmptyMarkedSubmissionsListWidget> createState() =>
      _EmptyMarkedSubmissionsListWidgetState();
}

class _EmptyMarkedSubmissionsListWidgetState
    extends State<EmptyMarkedSubmissionsListWidget> {
  late EmptyMarkedSubmissionsListModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => EmptyMarkedSubmissionsListModel());

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
              'No Submissions Marked',
              textAlign: TextAlign.center,
              style: FlutterFlowTheme.of(context).headlineMedium.override(
                    fontFamily: 'Urbanist',
                    letterSpacing: 0.0,
                  ),
            ),
          ),
          Padding(
            padding: const EdgeInsetsDirectional.fromSTEB(0.0, 4.0, 0.0, 0.0),
            child: Text(
              'It seems that you don\'t have any submissions marked.',
              textAlign: TextAlign.center,
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
