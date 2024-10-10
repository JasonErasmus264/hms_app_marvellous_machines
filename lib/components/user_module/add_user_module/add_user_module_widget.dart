import '/auth/custom_auth/auth_util.dart';
import '/backend/api_requests/api_calls.dart';
import '/flutter_flow/flutter_flow_drop_down.dart';
import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/flutter_flow/form_field_controller.dart';
import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'add_user_module_model.dart';
export 'add_user_module_model.dart';

class AddUserModuleWidget extends StatefulWidget {
  const AddUserModuleWidget({super.key});

  @override
  State<AddUserModuleWidget> createState() => _AddUserModuleWidgetState();
}

class _AddUserModuleWidgetState extends State<AddUserModuleWidget> {
  late AddUserModuleModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => AddUserModuleModel());

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
      child: Padding(
        padding: const EdgeInsetsDirectional.fromSTEB(5.0, 0.0, 5.0, 0.0),
        child: Container(
          width: 1200.0,
          constraints: const BoxConstraints(
            maxWidth: 800.0,
          ),
          decoration: BoxDecoration(
            color: FlutterFlowTheme.of(context).secondaryBackground,
            boxShadow: const [
              BoxShadow(
                blurRadius: 4.0,
                color: Color(0x33000000),
                offset: Offset(
                  0.0,
                  2.0,
                ),
              )
            ],
            borderRadius: BorderRadius.circular(12.0),
            border: Border.all(
              color: FlutterFlowTheme.of(context).alternate,
            ),
          ),
          child: Padding(
            padding: const EdgeInsetsDirectional.fromSTEB(12.0, 8.0, 12.0, 8.0),
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.max,
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Padding(
                    padding:
                        const EdgeInsetsDirectional.fromSTEB(12.0, 8.0, 12.0, 0.0),
                    child: Row(
                      mainAxisSize: MainAxisSize.max,
                      children: [
                        Expanded(
                          child: Text(
                            'Add User to a Module',
                            style:
                                FlutterFlowTheme.of(context).bodyLarge.override(
                                      fontFamily: 'Manrope',
                                      fontSize: 23.0,
                                      letterSpacing: 0.0,
                                      fontWeight: FontWeight.bold,
                                    ),
                          ),
                        ),
                        FlutterFlowIconButton(
                          borderColor: Colors.transparent,
                          borderRadius: 20.0,
                          borderWidth: 1.0,
                          buttonSize: 40.0,
                          hoverColor:
                              FlutterFlowTheme.of(context).primaryBackground,
                          icon: Icon(
                            Icons.close_rounded,
                            color: FlutterFlowTheme.of(context).secondaryText,
                            size: 24.0,
                          ),
                          onPressed: () async {
                            context.safePop();
                          },
                        ),
                      ].divide(const SizedBox(width: 8.0)),
                    ),
                  ),
                  Divider(
                    height: 1.0,
                    thickness: 2.0,
                    color: FlutterFlowTheme.of(context).alternate,
                  ),
                  Form(
                    key: _model.formKey,
                    autovalidateMode: AutovalidateMode.disabled,
                    child: Column(
                      mainAxisSize: MainAxisSize.max,
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(10.0),
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
                                      color:
                                          FlutterFlowTheme.of(context).tertiary,
                                      size: 50.0,
                                    ),
                                  ),
                                );
                              }
                              final dropDownModuleGetModuleForDropdownResponse =
                                  snapshot.data!;

                              return FlutterFlowDropDown<int>(
                                controller:
                                    _model.dropDownModuleValueController ??=
                                        FormFieldController<int>(null),
                                options: List<int>.from(ModuleGroup
                                    .getModuleForDropdownCall
                                    .moduleID(
                                  dropDownModuleGetModuleForDropdownResponse
                                      .jsonBody,
                                )!),
                                optionLabels: ModuleGroup
                                    .getModuleForDropdownCall
                                    .moduleCode(
                                  dropDownModuleGetModuleForDropdownResponse
                                      .jsonBody,
                                )!,
                                onChanged: (val) => safeSetState(
                                    () => _model.dropDownModuleValue = val),
                                height: 56.0,
                                searchHintTextStyle:
                                    FlutterFlowTheme.of(context)
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
                                  color: FlutterFlowTheme.of(context)
                                      .secondaryText,
                                  size: 24.0,
                                ),
                                elevation: 2.0,
                                borderColor:
                                    FlutterFlowTheme.of(context).alternate,
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
                        if (_model.dropDownModuleValue != null)
                          Padding(
                            padding: const EdgeInsets.all(10.0),
                            child: FutureBuilder<ApiCallResponse>(
                              future: UserModuleGroup.getNotEnrolledCall.call(
                                moduleID:
                                    _model.dropDownModuleValue?.toString(),
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
                                        color: FlutterFlowTheme.of(context)
                                            .tertiary,
                                        size: 50.0,
                                      ),
                                    ),
                                  );
                                }
                                final dropDownUserGetNotEnrolledResponse =
                                    snapshot.data!;

                                return FlutterFlowDropDown<int>(
                                  controller:
                                      _model.dropDownUserValueController ??=
                                          FormFieldController<int>(null),
                                  options: List<int>.from(
                                      UserModuleGroup.getNotEnrolledCall.userID(
                                                    dropDownUserGetNotEnrolledResponse
                                                        .jsonBody,
                                                  ) !=
                                                  null &&
                                              (UserModuleGroup
                                                      .getNotEnrolledCall
                                                      .userID(
                                                dropDownUserGetNotEnrolledResponse
                                                    .jsonBody,
                                              ))!
                                                  .isNotEmpty
                                          ? UserModuleGroup.getNotEnrolledCall
                                              .userID(
                                              dropDownUserGetNotEnrolledResponse
                                                  .jsonBody,
                                            )!
                                          : ([0])),
                                  optionLabels: UserModuleGroup
                                                  .getNotEnrolledCall
                                                  .user(
                                                dropDownUserGetNotEnrolledResponse
                                                    .jsonBody,
                                              ) !=
                                              null &&
                                          (UserModuleGroup.getNotEnrolledCall
                                                  .user(
                                            dropDownUserGetNotEnrolledResponse
                                                .jsonBody,
                                          ))!
                                              .isNotEmpty
                                      ? UserModuleGroup.getNotEnrolledCall.user(
                                          dropDownUserGetNotEnrolledResponse
                                              .jsonBody,
                                        )!
                                      : (["No users to add"]),
                                  onChanged: (val) async {
                                    safeSetState(
                                        () => _model.dropDownUserValue = val);
                                    if (_model.dropDownUserValue == 0) {
                                      Navigator.pop(context);
                                    }
                                  },
                                  height: 56.0,
                                  searchHintTextStyle:
                                      FlutterFlowTheme.of(context)
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
                                  hintText: 'Please select a user...',
                                  searchHintText: 'Search for a user...',
                                  icon: Icon(
                                    Icons.keyboard_arrow_down_rounded,
                                    color: FlutterFlowTheme.of(context)
                                        .secondaryText,
                                    size: 24.0,
                                  ),
                                  elevation: 2.0,
                                  borderColor:
                                      FlutterFlowTheme.of(context).alternate,
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
                        if (_model.dropDownUserValue != null)
                          Padding(
                            padding: const EdgeInsetsDirectional.fromSTEB(
                                0.0, 24.0, 0.0, 16.0),
                            child: FFButtonWidget(
                              onPressed: () async {
                                if (_model.formKey.currentState == null ||
                                    !_model.formKey.currentState!.validate()) {
                                  return;
                                }
                                if (_model.dropDownModuleValue == null) {
                                  await showDialog(
                                    context: context,
                                    builder: (alertDialogContext) {
                                      return AlertDialog(
                                        title: const Text('Error'),
                                        content: const Text('Select a module'),
                                        actions: [
                                          TextButton(
                                            onPressed: () => Navigator.pop(
                                                alertDialogContext),
                                            child: const Text('Ok'),
                                          ),
                                        ],
                                      );
                                    },
                                  );
                                  return;
                                }
                                if (_model.dropDownUserValue == null) {
                                  await showDialog(
                                    context: context,
                                    builder: (alertDialogContext) {
                                      return AlertDialog(
                                        title: const Text('Error'),
                                        content: const Text('Select a user'),
                                        actions: [
                                          TextButton(
                                            onPressed: () => Navigator.pop(
                                                alertDialogContext),
                                            child: const Text('Ok'),
                                          ),
                                        ],
                                      );
                                    },
                                  );
                                  return;
                                }
                                _model.apiResult = await UserModuleGroup
                                    .addUserModuleCall
                                    .call(
                                  userID: _model.dropDownUserValue?.toString(),
                                  moduleID:
                                      _model.dropDownModuleValue?.toString(),
                                  token: currentAuthenticationToken,
                                );

                                if ((_model.apiResult?.succeeded ?? true)) {
                                  await showDialog(
                                    context: context,
                                    builder: (alertDialogContext) {
                                      return AlertDialog(
                                        title: const Text('Success'),
                                        content: Text(UserModuleGroup
                                            .addUserModuleCall
                                            .errorMessage(
                                          (_model.apiResult?.jsonBody ?? ''),
                                        )!),
                                        actions: [
                                          TextButton(
                                            onPressed: () => Navigator.pop(
                                                alertDialogContext),
                                            child: const Text('Ok'),
                                          ),
                                        ],
                                      );
                                    },
                                  );
                                } else {
                                  await showDialog(
                                    context: context,
                                    builder: (alertDialogContext) {
                                      return AlertDialog(
                                        title: const Text('Error'),
                                        content: Text(UserModuleGroup
                                            .addUserModuleCall
                                            .errorMessage(
                                          (_model.apiResult?.jsonBody ?? ''),
                                        )!),
                                        actions: [
                                          TextButton(
                                            onPressed: () => Navigator.pop(
                                                alertDialogContext),
                                            child: const Text('Ok'),
                                          ),
                                        ],
                                      );
                                    },
                                  );
                                }

                                safeSetState(() {});
                              },
                              text: 'Submit',
                              options: FFButtonOptions(
                                width: 400.0,
                                height: 55.0,
                                padding: const EdgeInsetsDirectional.fromSTEB(
                                    0.0, 0.0, 0.0, 0.0),
                                iconPadding: const EdgeInsetsDirectional.fromSTEB(
                                    0.0, 0.0, 0.0, 0.0),
                                color: FlutterFlowTheme.of(context).tertiary,
                                textStyle: FlutterFlowTheme.of(context)
                                    .titleMedium
                                    .override(
                                      fontFamily: 'Manrope',
                                      color: Colors.white,
                                      fontSize: 20.0,
                                      letterSpacing: 0.0,
                                      fontWeight: FontWeight.bold,
                                    ),
                                elevation: 2.0,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ].divide(const SizedBox(height: 4.0)),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
