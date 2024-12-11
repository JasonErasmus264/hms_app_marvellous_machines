import '/auth/custom_auth/auth_util.dart';
import '/backend/api_requests/api_calls.dart';
import '/components/assignment/add_assignment/add_assignment_widget.dart';
import '/components/assignment/assignment_detailed_view/assignment_detailed_view_widget.dart';
import '/components/empty_lists/empty_assignments_list/empty_assignments_list_widget.dart';
import '/flutter_flow/flutter_flow_drop_down.dart';
import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/flutter_flow/form_field_controller.dart';
import '/flutter_flow/custom_functions.dart' as functions;
import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'assignment_model.dart';
export 'assignment_model.dart';

class AssignmentWidget extends StatefulWidget {
  const AssignmentWidget({super.key});

  @override
  State<AssignmentWidget> createState() => _AssignmentWidgetState();
}

class _AssignmentWidgetState extends State<AssignmentWidget> {
  late AssignmentModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => AssignmentModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        FocusScope.of(context).unfocus();
        FocusManager.instance.primaryFocus?.unfocus();
      },
      child: Scaffold(
        key: scaffoldKey,
        backgroundColor: FlutterFlowTheme.of(context).primaryBackground,
        appBar: AppBar(
          backgroundColor: FlutterFlowTheme.of(context).tertiary,
          automaticallyImplyLeading: false,
          leading: FlutterFlowIconButton(
            borderColor: Colors.transparent,
            borderRadius: 30.0,
            borderWidth: 1.0,
            buttonSize: 60.0,
            icon: const Icon(
              Icons.arrow_back_rounded,
              color: Colors.white,
              size: 30.0,
            ),
            onPressed: () async {
              context.pop();
            },
          ),
          title: Text(
            'Assignments',
            style: FlutterFlowTheme.of(context).headlineMedium.override(
                  fontFamily: 'Urbanist',
                  color: Colors.white,
                  fontSize: 22.0,
                  letterSpacing: 0.0,
                  fontWeight: FontWeight.bold,
                ),
          ),
          actions: const [],
          centerTitle: true,
          elevation: 2.0,
        ),
        body: SafeArea(
          top: true,
          child: Align(
            alignment: const AlignmentDirectional(0.0, 0.0),
            child: Container(
              constraints: const BoxConstraints(
                maxWidth: 800.0,
              ),
              decoration: const BoxDecoration(),
              child: Column(
                mainAxisSize: MainAxisSize.max,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Container(
                    constraints: const BoxConstraints(
                      maxWidth: 500.0,
                    ),
                    decoration: const BoxDecoration(),
                    child: Padding(
                      padding: const EdgeInsetsDirectional.fromSTEB(
                          10.0, 10.0, 10.0, 10.0),
                      child: FutureBuilder<ApiCallResponse>(
                        future: ModuleGroup.getModuleForDropdownCall.call(
                          token: currentAuthenticationToken,
                        ),
                        builder: (context, snapshot) {
                          // Customize what your widget looks like when it's loading.
                          if (!snapshot.hasData) {
                            return Center(
                              child: SizedBox(
                                width: 50.0,
                                height: 50.0,
                                child: SpinKitFadingCube(
                                  color: FlutterFlowTheme.of(context).tertiary,
                                  size: 50.0,
                                ),
                              ),
                            );
                          }
                          final dropDownGetModuleForDropdownResponse =
                              snapshot.data!;

                          return FlutterFlowDropDown<int>(
                            controller: _model.dropDownValueController ??=
                                FormFieldController<int>(null),
                            options: List<int>.from(ModuleGroup
                                            .getModuleForDropdownCall
                                            .moduleID(
                                          dropDownGetModuleForDropdownResponse
                                              .jsonBody,
                                        ) !=
                                        null &&
                                    (ModuleGroup.getModuleForDropdownCall
                                            .moduleID(
                                      dropDownGetModuleForDropdownResponse
                                          .jsonBody,
                                    ))!
                                        .isNotEmpty
                                ? ModuleGroup.getModuleForDropdownCall.moduleID(
                                    dropDownGetModuleForDropdownResponse
                                        .jsonBody,
                                  )!
                                : ([0])),
                            optionLabels:
                                ModuleGroup.getModuleForDropdownCall.moduleCode(
                                              dropDownGetModuleForDropdownResponse
                                                  .jsonBody,
                                            ) !=
                                            null &&
                                        (ModuleGroup.getModuleForDropdownCall
                                                .moduleCode(
                                          dropDownGetModuleForDropdownResponse
                                              .jsonBody,
                                        ))!
                                            .isNotEmpty
                                    ? ModuleGroup.getModuleForDropdownCall
                                        .moduleCode(
                                        dropDownGetModuleForDropdownResponse
                                            .jsonBody,
                                      )!
                                    : ([
                                        "You have not been enrolled in any modules yet"
                                      ]),
                            onChanged: (val) async {
                              safeSetState(() => _model.dropDownValue = val);
                              if (_model.dropDownValue == 0) {
                                context.safePop();
                              }
                            },
                            height: 56.0,
                            searchHintTextStyle: FlutterFlowTheme.of(context)
                                .labelMedium
                                .override(
                                  fontFamily: 'Manrope',
                                  letterSpacing: 0.0,
                                ),
                            searchTextStyle: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Manrope',
                                  letterSpacing: 0.0,
                                ),
                            textStyle: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Manrope',
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.bold,
                                ),
                            hintText: 'Please select a module...',
                            searchHintText: 'Search for a module...',
                            icon: Icon(
                              Icons.keyboard_arrow_down_rounded,
                              color: FlutterFlowTheme.of(context).secondaryText,
                              size: 24.0,
                            ),
                            elevation: 2.0,
                            borderColor: FlutterFlowTheme.of(context).alternate,
                            borderWidth: 2.0,
                            borderRadius: 8.0,
                            margin: const EdgeInsetsDirectional.fromSTEB(
                                16.0, 4.0, 16.0, 4.0),
                            hidesUnderline: true,
                            isOverButton: true,
                            isSearchable: true,
                            isMultiSelect: false,
                          );
                        },
                      ),
                    ),
                  ),
                  if (_model.dropDownValue != null)
                    Expanded(
                      child: Column(
                        mainAxisSize: MainAxisSize.max,
                        children: [
                          if (currentUserData?.userType != 'Student')
                            Padding(
                              padding: const EdgeInsetsDirectional.fromSTEB(
                                  0.0, 10.0, 0.0, 10.0),
                              child: FFButtonWidget(
                                onPressed: () async {
                                  await showModalBottomSheet(
                                    isScrollControlled: true,
                                    backgroundColor: Colors.transparent,
                                    enableDrag: false,
                                    useSafeArea: true,
                                    context: context,
                                    builder: (context) {
                                      return GestureDetector(
                                        onTap: () {
                                          FocusScope.of(context).unfocus();
                                          FocusManager.instance.primaryFocus
                                              ?.unfocus();
                                        },
                                        child: Padding(
                                          padding:
                                              MediaQuery.viewInsetsOf(context),
                                          child: AddAssignmentWidget(
                                            moduleID: _model.dropDownValue
                                                ?.toString(),
                                          ),
                                        ),
                                      );
                                    },
                                  ).then((value) => safeSetState(() {}));
                                },
                                text: 'Add Assignment',
                                icon: const Icon(
                                  Icons.add_circle,
                                  size: 22.0,
                                ),
                                options: FFButtonOptions(
                                  width: 300.0,
                                  height: 40.0,
                                  padding: const EdgeInsetsDirectional.fromSTEB(
                                      30.0, 0.0, 30.0, 0.0),
                                  iconPadding: const EdgeInsetsDirectional.fromSTEB(
                                      0.0, 0.0, 0.0, 0.0),
                                  color: FlutterFlowTheme.of(context).tertiary,
                                  textStyle: FlutterFlowTheme.of(context)
                                      .titleSmall
                                      .override(
                                        fontFamily: 'Manrope',
                                        color: Colors.white,
                                        fontSize: 17.0,
                                        letterSpacing: 0.0,
                                        fontWeight: FontWeight.bold,
                                      ),
                                  elevation: 3.0,
                                  borderSide: const BorderSide(
                                    color: Colors.transparent,
                                    width: 1.0,
                                  ),
                                  borderRadius: BorderRadius.circular(8.0),
                                ),
                              ),
                            ),
                          Expanded(
                            child: Padding(
                              padding: const EdgeInsetsDirectional.fromSTEB(
                                  10.0, 10.0, 10.0, 0.0),
                              child: FutureBuilder<ApiCallResponse>(
                                future: AssignmentGroup.getAssignmentCall.call(
                                  token: currentAuthenticationToken,
                                  moduleID: _model.dropDownValue,
                                ),
                                builder: (context, snapshot) {
                                  // Customize what your widget looks like when it's loading.
                                  if (!snapshot.hasData) {
                                    return Center(
                                      child: SizedBox(
                                        width: 50.0,
                                        height: 50.0,
                                        child: SpinKitFadingCube(
                                          color: FlutterFlowTheme.of(context)
                                              .tertiary,
                                          size: 50.0,
                                        ),
                                      ),
                                    );
                                  }
                                  final listViewGetAssignmentResponse =
                                      snapshot.data!;

                                  return Builder(
                                    builder: (context) {
                                      final assignment =
                                          AssignmentGroup.getAssignmentCall
                                                  .assignments(
                                                    listViewGetAssignmentResponse
                                                        .jsonBody,
                                                  )
                                                  ?.toList() ??
                                              [];
                                      if (assignment.isEmpty) {
                                        return const Center(
                                          child: EmptyAssignmentsListWidget(),
                                        );
                                      }

                                      return ListView.builder(
                                        padding: EdgeInsets.zero,
                                        scrollDirection: Axis.vertical,
                                        itemCount: assignment.length,
                                        itemBuilder:
                                            (context, assignmentIndex) {
                                          final assignmentItem =
                                              assignment[assignmentIndex];
                                          return Visibility(
                                            visible: currentUserData
                                                        ?.userType !=
                                                    'Student'
                                                ? true
                                                : functions.isAssignmentOpen(
                                                    getJsonField(
                                                      assignmentItem,
                                                      r'''$.assignOpenDate''',
                                                    ).toString(),
                                                    getJsonField(
                                                      assignmentItem,
                                                      r'''$.assignDueDate''',
                                                    ).toString()),
                                            child: Padding(
                                              padding: const EdgeInsetsDirectional
                                                  .fromSTEB(
                                                      0.0, 0.0, 0.0, 10.0),
                                              child: Card(
                                                clipBehavior:
                                                    Clip.antiAliasWithSaveLayer,
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .alternate,
                                                elevation: 4.0,
                                                shape: RoundedRectangleBorder(
                                                  borderRadius:
                                                      BorderRadius.circular(
                                                          8.0),
                                                ),
                                                child: Padding(
                                                  padding: const EdgeInsetsDirectional
                                                      .fromSTEB(10.0, 10.0,
                                                          10.0, 10.0),
                                                  child: Column(
                                                    mainAxisSize:
                                                        MainAxisSize.max,
                                                    crossAxisAlignment:
                                                        CrossAxisAlignment
                                                            .start,
                                                    children: [
                                                      Text(
                                                        getJsonField(
                                                          assignmentItem,
                                                          r'''$.assignName''',
                                                        ).toString(),
                                                        style:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .titleMedium
                                                                .override(
                                                                  fontFamily:
                                                                      'Manrope',
                                                                  color: FlutterFlowTheme.of(
                                                                          context)
                                                                      .primaryText,
                                                                  letterSpacing:
                                                                      0.0,
                                                                  fontWeight:
                                                                      FontWeight
                                                                          .bold,
                                                                ),
                                                      ),
                                                      Text(
                                                        'Open Date: ${getJsonField(
                                                          assignmentItem,
                                                          r'''$.assignOpenDate''',
                                                        ).toString()}',
                                                        style:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .bodyMedium
                                                                .override(
                                                                  fontFamily:
                                                                      'Manrope',
                                                                  color: FlutterFlowTheme.of(
                                                                          context)
                                                                      .secondaryText,
                                                                  letterSpacing:
                                                                      0.0,
                                                                  fontWeight:
                                                                      FontWeight
                                                                          .bold,
                                                                ),
                                                      ),
                                                      Padding(
                                                        padding:
                                                            const EdgeInsetsDirectional
                                                                .fromSTEB(
                                                                    0.0,
                                                                    0.0,
                                                                    8.0,
                                                                    0.0),
                                                        child: Text(
                                                          'Due Date: ${getJsonField(
                                                            assignmentItem,
                                                            r'''$.assignDueDate''',
                                                          ).toString()}',
                                                          style: FlutterFlowTheme
                                                                  .of(context)
                                                              .bodySmall
                                                              .override(
                                                                fontFamily:
                                                                    'Manrope',
                                                                color: FlutterFlowTheme.of(
                                                                        context)
                                                                    .error,
                                                                fontSize: 14.0,
                                                                letterSpacing:
                                                                    0.0,
                                                                fontWeight:
                                                                    FontWeight
                                                                        .bold,
                                                              ),
                                                        ),
                                                      ),
                                                      Padding(
                                                        padding:
                                                            const EdgeInsetsDirectional
                                                                .fromSTEB(
                                                                    0.0,
                                                                    10.0,
                                                                    0.0,
                                                                    0.0),
                                                        child: FFButtonWidget(
                                                          onPressed: () async {
                                                            await showModalBottomSheet(
                                                              isScrollControlled:
                                                                  true,
                                                              backgroundColor:
                                                                  Colors
                                                                      .transparent,
                                                              enableDrag: false,
                                                              useSafeArea: true,
                                                              context: context,
                                                              builder:
                                                                  (context) {
                                                                return GestureDetector(
                                                                  onTap: () {
                                                                    FocusScope.of(
                                                                            context)
                                                                        .unfocus();
                                                                    FocusManager
                                                                        .instance
                                                                        .primaryFocus
                                                                        ?.unfocus();
                                                                  },
                                                                  child:
                                                                      Padding(
                                                                    padding: MediaQuery
                                                                        .viewInsetsOf(
                                                                            context),
                                                                    child:
                                                                        AssignmentDetailedViewWidget(
                                                                      assignName:
                                                                          getJsonField(
                                                                        assignmentItem,
                                                                        r'''$.assignName''',
                                                                      ).toString(),
                                                                      assignID:
                                                                          getJsonField(
                                                                        assignmentItem,
                                                                        r'''$.assignmentID''',
                                                                      ).toString(),
                                                                      assignDesc:
                                                                          getJsonField(
                                                                        assignmentItem,
                                                                        r'''$.assignDesc''',
                                                                      ).toString(),
                                                                      assignTotalMarks:
                                                                          getJsonField(
                                                                        assignmentItem,
                                                                        r'''$.assignTotalMarks''',
                                                                      ).toString(),
                                                                      assignOpenDate:
                                                                          getJsonField(
                                                                        assignmentItem,
                                                                        r'''$.assignOpenDate''',
                                                                      ).toString(),
                                                                      assignDueDate:
                                                                          getJsonField(
                                                                        assignmentItem,
                                                                        r'''$.assignDueDate''',
                                                                      ).toString(),
                                                                      hasSubmitted:
                                                                          getJsonField(
                                                                        assignmentItem,
                                                                        r'''$.hasSubmitted''',
                                                                      ).toString(),
                                                                    ),
                                                                  ),
                                                                );
                                                              },
                                                            ).then((value) =>
                                                                safeSetState(
                                                                    () {}));
                                                          },
                                                          text: functions
                                                              .hasSubmittedText(
                                                                  getJsonField(
                                                            assignmentItem,
                                                            r'''$.hasSubmitted''',
                                                          ).toString()),
                                                          options:
                                                              FFButtonOptions(
                                                            width:
                                                                double.infinity,
                                                            height: 41.0,
                                                            padding:
                                                                const EdgeInsetsDirectional
                                                                    .fromSTEB(
                                                                        0.0,
                                                                        0.0,
                                                                        0.0,
                                                                        0.0),
                                                            iconPadding:
                                                                const EdgeInsetsDirectional
                                                                    .fromSTEB(
                                                                        0.0,
                                                                        0.0,
                                                                        0.0,
                                                                        0.0),
                                                            color: FlutterFlowTheme
                                                                    .of(context)
                                                                .tertiary,
                                                            textStyle:
                                                                FlutterFlowTheme.of(
                                                                        context)
                                                                    .titleSmall
                                                                    .override(
                                                                      fontFamily:
                                                                          'Manrope',
                                                                      color: Colors
                                                                          .white,
                                                                      fontSize:
                                                                          18.0,
                                                                      letterSpacing:
                                                                          0.0,
                                                                      fontWeight:
                                                                          FontWeight
                                                                              .bold,
                                                                    ),
                                                            elevation: 2.0,
                                                            borderRadius:
                                                                BorderRadius
                                                                    .circular(
                                                                        24.0),
                                                          ),
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                ),
                                              ),
                                            ),
                                          );
                                        },
                                      );
                                    },
                                  );
                                },
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
