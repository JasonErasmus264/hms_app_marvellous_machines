import '/auth/custom_auth/auth_util.dart';
import '/backend/api_requests/api_calls.dart';
import '/components/admin/admin_action_sheet/admin_action_sheet_widget.dart';
import '/components/notification/notification_widget.dart';
import '/components/profile/change_password/change_password_widget.dart';
import '/components/profile/edit_profile/edit_profile_widget.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/flutter_flow/custom_functions.dart' as functions;
import 'package:badges/badges.dart' as badges;
import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'home_model.dart';
export 'home_model.dart';

class HomeWidget extends StatefulWidget {
  const HomeWidget({super.key});

  @override
  State<HomeWidget> createState() => _HomeWidgetState();
}

class _HomeWidgetState extends State<HomeWidget> {
  late HomeModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => HomeModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<ApiCallResponse>(
      future: UserGroup.getUserCall.call(
        token: currentAuthenticationToken,
      ),
      builder: (context, snapshot) {
        // Customize what your widget looks like when it's loading.
        if (!snapshot.hasData) {
          return Scaffold(
            backgroundColor: FlutterFlowTheme.of(context).primaryBackground,
            body: Center(
              child: SizedBox(
                width: 50.0,
                height: 50.0,
                child: SpinKitFadingCube(
                  color: FlutterFlowTheme.of(context).tertiary,
                  size: 50.0,
                ),
              ),
            ),
          );
        }
        final homeGetUserResponse = snapshot.data!;

        return Scaffold(
          key: scaffoldKey,
          backgroundColor: FlutterFlowTheme.of(context).primaryBackground,
          body: SafeArea(
            top: true,
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.max,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsetsDirectional.fromSTEB(0.0, 2.0, 0.0, 0.0),
                    child: Container(
                      width: MediaQuery.sizeOf(context).width * 1.0,
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
                      ),
                      child: Padding(
                        padding: const EdgeInsetsDirectional.fromSTEB(
                            10.0, 20.0, 10.0, 20.0),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            if (currentUserData?.userType != 'Student')
                              Padding(
                                padding: const EdgeInsetsDirectional.fromSTEB(
                                    25.0, 0.0, 0.0, 0.0),
                                child: Row(
                                  mainAxisSize: MainAxisSize.max,
                                  mainAxisAlignment: MainAxisAlignment.start,
                                  children: [
                                    Padding(
                                      padding: const EdgeInsetsDirectional.fromSTEB(
                                          2.0, 0.0, 0.0, 0.0),
                                      child: badges.Badge(
                                        badgeContent: Text(
                                          UserGroup.getUserCall
                                              .notificationCount(
                                                homeGetUserResponse.jsonBody,
                                              )!
                                              .toString(),
                                          style: FlutterFlowTheme.of(context)
                                              .titleSmall
                                              .override(
                                                fontFamily: 'Manrope',
                                                color: Colors.white,
                                                fontSize: 11.0,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.bold,
                                              ),
                                        ),
                                        showBadge: UserGroup.getUserCall
                                                .notificationCount(
                                              homeGetUserResponse.jsonBody,
                                            ) !=
                                            0,
                                        shape: badges.BadgeShape.circle,
                                        badgeColor:
                                            FlutterFlowTheme.of(context).error,
                                        elevation: 4.0,
                                        padding: const EdgeInsetsDirectional.fromSTEB(
                                            8.0, 8.0, 8.0, 8.0),
                                        position: badges.BadgePosition.topEnd(),
                                        animationType:
                                            badges.BadgeAnimationType.scale,
                                        toAnimate: true,
                                        child: InkWell(
                                          splashColor: Colors.transparent,
                                          focusColor: Colors.transparent,
                                          hoverColor: Colors.transparent,
                                          highlightColor: Colors.transparent,
                                          onTap: () async {
                                            await showModalBottomSheet(
                                              isScrollControlled: true,
                                              backgroundColor:
                                                  Colors.transparent,
                                              enableDrag: false,
                                              context: context,
                                              builder: (context) {
                                                return Padding(
                                                  padding:
                                                      MediaQuery.viewInsetsOf(
                                                          context),
                                                  child: const NotificationWidget(),
                                                );
                                              },
                                            ).then(
                                                (value) => safeSetState(() {}));
                                          },
                                          child: Icon(
                                            Icons.notifications_rounded,
                                            color: FlutterFlowTheme.of(context)
                                                .secondaryText,
                                            size: 40.0,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            Padding(
                              padding: const EdgeInsetsDirectional.fromSTEB(
                                  16.0, 0.0, 16.0, 0.0),
                              child: Container(
                                width: 100.0,
                                height: 100.0,
                                decoration: const BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [
                                      Color(0xFF4B39EF),
                                      Color(0xFFEE6062)
                                    ],
                                    stops: [0.0, 1.0],
                                    begin: AlignmentDirectional(1.0, -1.0),
                                    end: AlignmentDirectional(-1.0, 1.0),
                                  ),
                                  shape: BoxShape.circle,
                                ),
                                child: Align(
                                  alignment: const AlignmentDirectional(0.0, 0.0),
                                  child: Padding(
                                    padding: const EdgeInsets.all(4.0),
                                    child: Container(
                                      width: 100.0,
                                      height: 100.0,
                                      decoration: BoxDecoration(
                                        color: FlutterFlowTheme.of(context)
                                            .secondaryBackground,
                                        shape: BoxShape.circle,
                                      ),
                                      child: Padding(
                                        padding: const EdgeInsets.all(4.0),
                                        child: ClipRRect(
                                          borderRadius:
                                              BorderRadius.circular(50.0),
                                          child: Image.network(
                                            'data:image/jpeg;base64,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',
                                            width: 100.0,
                                            height: 100.0,
                                            fit: BoxFit.cover,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsetsDirectional.fromSTEB(
                                  0.0, 10.0, 0.0, 10.0),
                              child: Text(
                                'Welcome back, ${UserGroup.getUserCall.firstName(
                                  homeGetUserResponse.jsonBody,
                                )} ${UserGroup.getUserCall.lastName(
                                  homeGetUserResponse.jsonBody,
                                )} (${UserGroup.getUserCall.username(
                                  homeGetUserResponse.jsonBody,
                                )})',
                                textAlign: TextAlign.center,
                                style: FlutterFlowTheme.of(context)
                                    .titleMedium
                                    .override(
                                      fontFamily: 'Manrope',
                                      color: FlutterFlowTheme.of(context)
                                          .primaryText,
                                      letterSpacing: 0.0,
                                      fontWeight: FontWeight.bold,
                                    ),
                              ),
                            ),
                            Text(
                              valueOrDefault<String>(
                                UserGroup.getUserCall.email(
                                  homeGetUserResponse.jsonBody,
                                ),
                                'email',
                              ),
                              style: FlutterFlowTheme.of(context)
                                  .titleSmall
                                  .override(
                                    fontFamily: 'Manrope',
                                    color: FlutterFlowTheme.of(context)
                                        .primaryText,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.bold,
                                  ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsetsDirectional.fromSTEB(0.0, 1.0, 0.0, 0.0),
                    child: Column(
                      mainAxisSize: MainAxisSize.max,
                      children: [
                        if (Theme.of(context).brightness == Brightness.light)
                          InkWell(
                            splashColor: Colors.transparent,
                            focusColor: Colors.transparent,
                            hoverColor: Colors.transparent,
                            highlightColor: Colors.transparent,
                            onTap: () async {
                              setDarkModeSetting(context, ThemeMode.dark);
                            },
                            child: Container(
                              width: MediaQuery.sizeOf(context).width * 1.0,
                              decoration: BoxDecoration(
                                color: FlutterFlowTheme.of(context)
                                    .secondaryBackground,
                              ),
                              child: Padding(
                                padding: const EdgeInsetsDirectional.fromSTEB(
                                    24.0, 12.0, 24.0, 12.0),
                                child: Row(
                                  mainAxisSize: MainAxisSize.max,
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceEvenly,
                                  children: [
                                    Text(
                                      'Switch to Dark Mode',
                                      style: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .override(
                                            fontFamily: 'Manrope',
                                            color: FlutterFlowTheme.of(context)
                                                .secondaryText,
                                            letterSpacing: 0.0,
                                            fontWeight: FontWeight.bold,
                                          ),
                                    ),
                                    Container(
                                      width: 80.0,
                                      height: 40.0,
                                      decoration: BoxDecoration(
                                        color: FlutterFlowTheme.of(context)
                                            .primaryBackground,
                                        borderRadius:
                                            BorderRadius.circular(20.0),
                                      ),
                                      child: Stack(
                                        alignment:
                                            const AlignmentDirectional(0.0, 0.0),
                                        children: [
                                          const Align(
                                            alignment:
                                                AlignmentDirectional(0.95, 0.0),
                                            child: Padding(
                                              padding: EdgeInsetsDirectional
                                                  .fromSTEB(0.0, 0.0, 8.0, 0.0),
                                              child: Icon(
                                                Icons.dark_mode,
                                                color: Color(0xFF182955),
                                                size: 24.0,
                                              ),
                                            ),
                                          ),
                                          Align(
                                            alignment: const AlignmentDirectional(
                                                -0.85, 0.0),
                                            child: Container(
                                              width: 36.0,
                                              height: 36.0,
                                              decoration: BoxDecoration(
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .secondaryBackground,
                                                boxShadow: const [
                                                  BoxShadow(
                                                    blurRadius: 4.0,
                                                    color: Color(0x430B0D0F),
                                                    offset: Offset(
                                                      0.0,
                                                      2.0,
                                                    ),
                                                  )
                                                ],
                                                borderRadius:
                                                    BorderRadius.circular(30.0),
                                                shape: BoxShape.rectangle,
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
                        if (Theme.of(context).brightness == Brightness.dark)
                          InkWell(
                            splashColor: Colors.transparent,
                            focusColor: Colors.transparent,
                            hoverColor: Colors.transparent,
                            highlightColor: Colors.transparent,
                            onTap: () async {
                              setDarkModeSetting(context, ThemeMode.light);
                            },
                            child: Container(
                              width: MediaQuery.sizeOf(context).width * 1.0,
                              decoration: BoxDecoration(
                                color: FlutterFlowTheme.of(context)
                                    .secondaryBackground,
                              ),
                              child: Padding(
                                padding: const EdgeInsetsDirectional.fromSTEB(
                                    24.0, 12.0, 24.0, 12.0),
                                child: Row(
                                  mainAxisSize: MainAxisSize.max,
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceEvenly,
                                  children: [
                                    Text(
                                      'Switch to Light Mode',
                                      style: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .override(
                                            fontFamily: 'Manrope',
                                            color: FlutterFlowTheme.of(context)
                                                .secondaryText,
                                            letterSpacing: 0.0,
                                            fontWeight: FontWeight.bold,
                                          ),
                                    ),
                                    Container(
                                      width: 80.0,
                                      height: 40.0,
                                      decoration: BoxDecoration(
                                        color: FlutterFlowTheme.of(context)
                                            .primaryBackground,
                                        borderRadius:
                                            BorderRadius.circular(20.0),
                                      ),
                                      child: Stack(
                                        alignment:
                                            const AlignmentDirectional(0.0, 0.0),
                                        children: [
                                          const Align(
                                            alignment:
                                                AlignmentDirectional(-0.9, 0.0),
                                            child: Padding(
                                              padding: EdgeInsetsDirectional
                                                  .fromSTEB(8.0, 2.0, 0.0, 0.0),
                                              child: Icon(
                                                Icons.wb_sunny_rounded,
                                                color: Color(0xFFFFCE00),
                                                size: 24.0,
                                              ),
                                            ),
                                          ),
                                          Align(
                                            alignment:
                                                const AlignmentDirectional(0.9, 0.0),
                                            child: Container(
                                              width: 36.0,
                                              height: 36.0,
                                              decoration: BoxDecoration(
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .secondaryBackground,
                                                boxShadow: const [
                                                  BoxShadow(
                                                    blurRadius: 4.0,
                                                    color: Color(0x430B0D0F),
                                                    offset: Offset(
                                                      0.0,
                                                      2.0,
                                                    ),
                                                  )
                                                ],
                                                borderRadius:
                                                    BorderRadius.circular(30.0),
                                                shape: BoxShape.rectangle,
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
                      ],
                    ),
                  ),
                  Container(
                    constraints: const BoxConstraints(
                      maxWidth: 1000.0,
                    ),
                    decoration: const BoxDecoration(),
                    child: Padding(
                      padding:
                          const EdgeInsetsDirectional.fromSTEB(20.0, 0.0, 20.0, 0.0),
                      child: Column(
                        mainAxisSize: MainAxisSize.max,
                        children: [
                          Align(
                            alignment: const AlignmentDirectional(-1.0, 0.0),
                            child: Padding(
                              padding: const EdgeInsetsDirectional.fromSTEB(
                                  0.0, 10.0, 0.0, 10.0),
                              child: Text(
                                'Account',
                                style: FlutterFlowTheme.of(context)
                                    .labelLarge
                                    .override(
                                      fontFamily: 'Manrope',
                                      fontSize: 16.0,
                                      letterSpacing: 0.0,
                                      fontWeight: FontWeight.bold,
                                    ),
                              ),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsetsDirectional.fromSTEB(
                                0.0, 5.0, 0.0, 5.0),
                            child: InkWell(
                              splashColor: Colors.transparent,
                              focusColor: Colors.transparent,
                              hoverColor: Colors.transparent,
                              highlightColor: Colors.transparent,
                              onTap: () async {
                                await showModalBottomSheet(
                                  isScrollControlled: true,
                                  backgroundColor: Colors.transparent,
                                  enableDrag: false,
                                  context: context,
                                  builder: (context) {
                                    return Padding(
                                      padding: MediaQuery.viewInsetsOf(context),
                                      child: EditProfileWidget(
                                        firstName:
                                            UserGroup.getUserCall.firstName(
                                          homeGetUserResponse.jsonBody,
                                        ),
                                        lastName:
                                            UserGroup.getUserCall.lastName(
                                          homeGetUserResponse.jsonBody,
                                        ),
                                        phoneNum:
                                            UserGroup.getUserCall.phoneNum(
                                          homeGetUserResponse.jsonBody,
                                        ),
                                        email: UserGroup.getUserCall.email(
                                          homeGetUserResponse.jsonBody,
                                        ),
                                        createdAt:
                                            UserGroup.getUserCall.createdAt(
                                          homeGetUserResponse.jsonBody,
                                        ),
                                        profilePicture:
                                            functions.convertImagePath(UserGroup
                                                .getUserCall
                                                .profilePicture(
                                          homeGetUserResponse.jsonBody,
                                        )),
                                      ),
                                    );
                                  },
                                ).then((value) => safeSetState(() {}));
                              },
                              child: Container(
                                width: double.infinity,
                                height: 60.0,
                                decoration: BoxDecoration(
                                  color: FlutterFlowTheme.of(context)
                                      .secondaryBackground,
                                  boxShadow: const [
                                    BoxShadow(
                                      blurRadius: 5.0,
                                      color: Color(0x3416202A),
                                      offset: Offset(
                                        0.0,
                                        2.0,
                                      ),
                                    )
                                  ],
                                  borderRadius: BorderRadius.circular(12.0),
                                  shape: BoxShape.rectangle,
                                ),
                                child: Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.max,
                                    children: [
                                      Icon(
                                        Icons.person,
                                        color: FlutterFlowTheme.of(context)
                                            .secondaryText,
                                        size: 28.0,
                                      ),
                                      Padding(
                                        padding: const EdgeInsetsDirectional.fromSTEB(
                                            12.0, 0.0, 0.0, 0.0),
                                        child: Text(
                                          'Edit Profile',
                                          style: FlutterFlowTheme.of(context)
                                              .labelMedium
                                              .override(
                                                fontFamily: 'Manrope',
                                                fontSize: 16.0,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.bold,
                                              ),
                                        ),
                                      ),
                                      Expanded(
                                        child: Align(
                                          alignment:
                                              const AlignmentDirectional(1.0, 0.0),
                                          child: Padding(
                                            padding:
                                                const EdgeInsetsDirectional.fromSTEB(
                                                    0.0, 0.0, 15.0, 0.0),
                                            child: Icon(
                                              Icons.arrow_forward_ios,
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .secondaryText,
                                              size: 18.0,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsetsDirectional.fromSTEB(
                                0.0, 5.0, 0.0, 5.0),
                            child: InkWell(
                              splashColor: Colors.transparent,
                              focusColor: Colors.transparent,
                              hoverColor: Colors.transparent,
                              highlightColor: Colors.transparent,
                              onTap: () async {
                                await showModalBottomSheet(
                                  isScrollControlled: true,
                                  backgroundColor: Colors.transparent,
                                  enableDrag: false,
                                  useSafeArea: true,
                                  context: context,
                                  builder: (context) {
                                    return Padding(
                                      padding: MediaQuery.viewInsetsOf(context),
                                      child: const ChangePasswordWidget(),
                                    );
                                  },
                                ).then((value) => safeSetState(() {}));
                              },
                              child: Container(
                                width: double.infinity,
                                height: 60.0,
                                decoration: BoxDecoration(
                                  color: FlutterFlowTheme.of(context)
                                      .secondaryBackground,
                                  boxShadow: const [
                                    BoxShadow(
                                      blurRadius: 5.0,
                                      color: Color(0x3416202A),
                                      offset: Offset(
                                        0.0,
                                        2.0,
                                      ),
                                    )
                                  ],
                                  borderRadius: BorderRadius.circular(12.0),
                                  shape: BoxShape.rectangle,
                                ),
                                child: Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.max,
                                    children: [
                                      Icon(
                                        Icons.password_rounded,
                                        color: FlutterFlowTheme.of(context)
                                            .secondaryText,
                                        size: 28.0,
                                      ),
                                      Padding(
                                        padding: const EdgeInsetsDirectional.fromSTEB(
                                            12.0, 0.0, 0.0, 0.0),
                                        child: Text(
                                          'Change Password',
                                          style: FlutterFlowTheme.of(context)
                                              .labelMedium
                                              .override(
                                                fontFamily: 'Manrope',
                                                fontSize: 16.0,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.bold,
                                              ),
                                        ),
                                      ),
                                      Expanded(
                                        child: Align(
                                          alignment:
                                              const AlignmentDirectional(1.0, 0.0),
                                          child: Padding(
                                            padding:
                                                const EdgeInsetsDirectional.fromSTEB(
                                                    0.0, 0.0, 15.0, 0.0),
                                            child: Icon(
                                              Icons.arrow_forward_ios,
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .secondaryText,
                                              size: 18.0,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ),
                          Align(
                            alignment: const AlignmentDirectional(-1.0, 0.0),
                            child: Padding(
                              padding: const EdgeInsetsDirectional.fromSTEB(
                                  0.0, 10.0, 0.0, 10.0),
                              child: Text(
                                'Options',
                                style: FlutterFlowTheme.of(context)
                                    .labelLarge
                                    .override(
                                      fontFamily: 'Manrope',
                                      fontSize: 16.0,
                                      letterSpacing: 0.0,
                                      fontWeight: FontWeight.bold,
                                    ),
                              ),
                            ),
                          ),
                          if (currentUserData?.userType == 'Admin')
                            Padding(
                              padding: const EdgeInsetsDirectional.fromSTEB(
                                  0.0, 5.0, 0.0, 5.0),
                              child: InkWell(
                                splashColor: Colors.transparent,
                                focusColor: Colors.transparent,
                                hoverColor: Colors.transparent,
                                highlightColor: Colors.transparent,
                                onTap: () async {
                                  await showModalBottomSheet(
                                    isScrollControlled: true,
                                    backgroundColor: Colors.transparent,
                                    useSafeArea: true,
                                    context: context,
                                    builder: (context) {
                                      return Padding(
                                        padding:
                                            MediaQuery.viewInsetsOf(context),
                                        child: const SizedBox(
                                          height: 700.0,
                                          child: AdminActionSheetWidget(),
                                        ),
                                      );
                                    },
                                  ).then((value) => safeSetState(() {}));
                                },
                                child: Container(
                                  width: double.infinity,
                                  height: 60.0,
                                  decoration: BoxDecoration(
                                    color: FlutterFlowTheme.of(context)
                                        .secondaryBackground,
                                    boxShadow: const [
                                      BoxShadow(
                                        blurRadius: 5.0,
                                        color: Color(0x3416202A),
                                        offset: Offset(
                                          0.0,
                                          2.0,
                                        ),
                                      )
                                    ],
                                    borderRadius: BorderRadius.circular(12.0),
                                    shape: BoxShape.rectangle,
                                  ),
                                  child: Padding(
                                    padding: const EdgeInsets.all(8.0),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.max,
                                      children: [
                                        Icon(
                                          Icons.admin_panel_settings_rounded,
                                          color: FlutterFlowTheme.of(context)
                                              .secondaryText,
                                          size: 28.0,
                                        ),
                                        Padding(
                                          padding:
                                              const EdgeInsetsDirectional.fromSTEB(
                                                  12.0, 0.0, 0.0, 0.0),
                                          child: Text(
                                            'Admin',
                                            style: FlutterFlowTheme.of(context)
                                                .labelMedium
                                                .override(
                                                  fontFamily: 'Manrope',
                                                  fontSize: 16.0,
                                                  letterSpacing: 0.0,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                          ),
                                        ),
                                        Expanded(
                                          child: Align(
                                            alignment:
                                                const AlignmentDirectional(1.0, 0.0),
                                            child: Padding(
                                              padding: const EdgeInsetsDirectional
                                                  .fromSTEB(
                                                      0.0, 0.0, 15.0, 0.0),
                                              child: Icon(
                                                Icons.arrow_forward_ios,
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .secondaryText,
                                                size: 18.0,
                                              ),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          Padding(
                            padding: const EdgeInsetsDirectional.fromSTEB(
                                0.0, 5.0, 0.0, 5.0),
                            child: InkWell(
                              splashColor: Colors.transparent,
                              focusColor: Colors.transparent,
                              hoverColor: Colors.transparent,
                              highlightColor: Colors.transparent,
                              onTap: () async {
                                context.pushNamed('assignment');
                              },
                              child: Container(
                                width: double.infinity,
                                height: 60.0,
                                decoration: BoxDecoration(
                                  color: FlutterFlowTheme.of(context)
                                      .secondaryBackground,
                                  boxShadow: const [
                                    BoxShadow(
                                      blurRadius: 5.0,
                                      color: Color(0x3416202A),
                                      offset: Offset(
                                        0.0,
                                        2.0,
                                      ),
                                    )
                                  ],
                                  borderRadius: BorderRadius.circular(12.0),
                                  shape: BoxShape.rectangle,
                                ),
                                child: Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.max,
                                    children: [
                                      Icon(
                                        Icons.assignment_rounded,
                                        color: FlutterFlowTheme.of(context)
                                            .secondaryText,
                                        size: 28.0,
                                      ),
                                      Padding(
                                        padding: const EdgeInsetsDirectional.fromSTEB(
                                            12.0, 0.0, 0.0, 0.0),
                                        child: Text(
                                          'Assignments',
                                          style: FlutterFlowTheme.of(context)
                                              .labelMedium
                                              .override(
                                                fontFamily: 'Manrope',
                                                fontSize: 16.0,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.bold,
                                              ),
                                        ),
                                      ),
                                      Expanded(
                                        child: Align(
                                          alignment:
                                              const AlignmentDirectional(1.0, 0.0),
                                          child: Padding(
                                            padding:
                                                const EdgeInsetsDirectional.fromSTEB(
                                                    0.0, 0.0, 15.0, 0.0),
                                            child: Icon(
                                              Icons.arrow_forward_ios,
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .secondaryText,
                                              size: 18.0,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ),
                          if (currentUserData?.userType != 'Lecturer')
                            Padding(
                              padding: const EdgeInsetsDirectional.fromSTEB(
                                  0.0, 5.0, 0.0, 5.0),
                              child: InkWell(
                                splashColor: Colors.transparent,
                                focusColor: Colors.transparent,
                                hoverColor: Colors.transparent,
                                highlightColor: Colors.transparent,
                                onTap: () async {
                                  context.pushNamed('gradebook');
                                },
                                child: Container(
                                  width: double.infinity,
                                  height: 60.0,
                                  decoration: BoxDecoration(
                                    color: FlutterFlowTheme.of(context)
                                        .secondaryBackground,
                                    boxShadow: const [
                                      BoxShadow(
                                        blurRadius: 5.0,
                                        color: Color(0x3416202A),
                                        offset: Offset(
                                          0.0,
                                          2.0,
                                        ),
                                      )
                                    ],
                                    borderRadius: BorderRadius.circular(12.0),
                                    shape: BoxShape.rectangle,
                                  ),
                                  child: Padding(
                                    padding: const EdgeInsets.all(8.0),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.max,
                                      children: [
                                        Icon(
                                          Icons.grade_rounded,
                                          color: FlutterFlowTheme.of(context)
                                              .secondaryText,
                                          size: 28.0,
                                        ),
                                        Padding(
                                          padding:
                                              const EdgeInsetsDirectional.fromSTEB(
                                                  12.0, 0.0, 0.0, 0.0),
                                          child: Text(
                                            'Gradebook',
                                            style: FlutterFlowTheme.of(context)
                                                .labelMedium
                                                .override(
                                                  fontFamily: 'Manrope',
                                                  fontSize: 16.0,
                                                  letterSpacing: 0.0,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                          ),
                                        ),
                                        Expanded(
                                          child: Align(
                                            alignment:
                                                const AlignmentDirectional(1.0, 0.0),
                                            child: Padding(
                                              padding: const EdgeInsetsDirectional
                                                  .fromSTEB(
                                                      0.0, 0.0, 15.0, 0.0),
                                              child: Icon(
                                                Icons.arrow_forward_ios,
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .secondaryText,
                                                size: 18.0,
                                              ),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          Padding(
                            padding: const EdgeInsetsDirectional.fromSTEB(
                                0.0, 10.0, 0.0, 20.0),
                            child: Row(
                              mainAxisSize: MainAxisSize.max,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                FFButtonWidget(
                                  onPressed: () async {
                                    Function() navigate = () {};
                                    _model.apiResult =
                                        await AuthGroup.logoutCall.call(
                                      token: currentAuthenticationToken,
                                    );

                                    if ((_model.apiResult?.succeeded ?? true)) {
                                      GoRouter.of(context).prepareAuthEvent();
                                      await authManager.signOut();
                                      GoRouter.of(context)
                                          .clearRedirectLocation();

                                      navigate = () => context.goNamedAuth(
                                          'login', context.mounted);
                                    } else {
                                      await showDialog(
                                        context: context,
                                        builder: (alertDialogContext) {
                                          return AlertDialog(
                                            title: const Text('Error'),
                                            content: Text(AuthGroup.logoutCall
                                                .errorMessage(
                                              (_model.apiResult?.jsonBody ??
                                                  ''),
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

                                    navigate();

                                    safeSetState(() {});
                                  },
                                  text: 'Logout',
                                  options: FFButtonOptions(
                                    width: 100.0,
                                    height: 42.0,
                                    padding: const EdgeInsetsDirectional.fromSTEB(
                                        0.0, 0.0, 0.0, 0.0),
                                    iconPadding: const EdgeInsetsDirectional.fromSTEB(
                                        0.0, 0.0, 0.0, 0.0),
                                    color: FlutterFlowTheme.of(context)
                                        .secondaryBackground,
                                    textStyle: FlutterFlowTheme.of(context)
                                        .bodySmall
                                        .override(
                                          fontFamily: 'Lexend Deca',
                                          color: FlutterFlowTheme.of(context)
                                              .primaryText,
                                          fontSize: 16.0,
                                          letterSpacing: 0.0,
                                          fontWeight: FontWeight.normal,
                                        ),
                                    elevation: 1.0,
                                    borderSide: const BorderSide(
                                      color: Colors.transparent,
                                      width: 1.0,
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
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
