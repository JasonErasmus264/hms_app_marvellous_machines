import 'dart:convert';

import 'package:flutter/foundation.dart';

import '/flutter_flow/flutter_flow_util.dart';
import 'api_manager.dart';
import 'interceptors.dart';

export 'api_manager.dart' show ApiCallResponse;

const _kPrivateApiFunctionName = 'ffPrivateApiCall';

/// Start User Group Code

class UserGroup {
  static String getBaseUrl() => 'http://localhost:3000';
  static Map<String, String> headers = {};
  static GetUserCall getUserCall = GetUserCall();

  static final interceptors = [
    RefreshToken(),
  ];
}

class GetUserCall {
  Future<ApiCallResponse> call({
    String? token = '',
  }) async {
    final baseUrl = UserGroup.getBaseUrl();

    return FFApiInterceptor.makeApiCall(
      ApiCallOptions(
        callName: 'Get User',
        apiUrl: '$baseUrl/v1/users',
        callType: ApiCallType.GET,
        headers: {
          'Authorization': 'Bearer $token',
        },
        params: const {},
        returnBody: true,
        encodeBodyUtf8: false,
        decodeUtf8: false,
        cache: false,
        isStreamingApi: false,
        alwaysAllowBody: false,
      ),
      UserGroup.interceptors,
    );
  }

  String? username(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.user.username''',
      ));
  String? firstName(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.user.firstName''',
      ));
  String? lastName(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.user.lastName''',
      ));
  String? email(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.user.email''',
      ));
  String? userType(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.user.userType''',
      ));
  String? errorMessage(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.message''',
      ));
}

/// End User Group Code

/// Start Assignment Group Code

class AssignmentGroup {
  static String getBaseUrl() => 'http://localhost:3000';
  static Map<String, String> headers = {};
  static GetModuleCall getModuleCall = GetModuleCall();
  static GetAssignmentCall getAssignmentCall = GetAssignmentCall();

  static final interceptors = [
    RefreshToken(),
  ];
}

class GetModuleCall {
  Future<ApiCallResponse> call({
    String? token = '',
  }) async {
    final baseUrl = AssignmentGroup.getBaseUrl();

    return FFApiInterceptor.makeApiCall(
      ApiCallOptions(
        callName: 'GetModule',
        apiUrl: '$baseUrl/v1/module',
        callType: ApiCallType.GET,
        headers: {
          'Authorization': 'Bearer $token',
        },
        params: const {},
        returnBody: true,
        encodeBodyUtf8: false,
        decodeUtf8: false,
        cache: false,
        isStreamingApi: false,
        alwaysAllowBody: false,
      ),
      AssignmentGroup.interceptors,
    );
  }

  String? errorMessage(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.message''',
      ));
  List<int>? moduleID(dynamic response) => (getJsonField(
        response,
        r'''$.modules[:].moduleID''',
        true,
      ) as List?)
          ?.withoutNulls
          .map((x) => castToType<int>(x))
          .withoutNulls
          .toList();
  List<String>? moduleCode(dynamic response) => (getJsonField(
        response,
        r'''$.modules[:].moduleCode''',
        true,
      ) as List?)
          ?.withoutNulls
          .map((x) => castToType<String>(x))
          .withoutNulls
          .toList();
}

class GetAssignmentCall {
  Future<ApiCallResponse> call({
    String? token = '',
    int? moduleID,
  }) async {
    final baseUrl = AssignmentGroup.getBaseUrl();

    return FFApiInterceptor.makeApiCall(
      ApiCallOptions(
        callName: 'GetAssignment',
        apiUrl: '$baseUrl/v1/assignments/$moduleID',
        callType: ApiCallType.GET,
        headers: {
          'Authorization': 'Bearer $token',
        },
        params: const {},
        returnBody: true,
        encodeBodyUtf8: false,
        decodeUtf8: false,
        cache: false,
        isStreamingApi: false,
        alwaysAllowBody: false,
      ),
      AssignmentGroup.interceptors,
    );
  }

  List? assignments(dynamic response) => getJsonField(
        response,
        r'''$.assignments''',
        true,
      ) as List?;
}

/// End Assignment Group Code

/// Start Feedback Group Code

class FeedbackGroup {
  static String getBaseUrl({
    String? token = '',
  }) =>
      'http://localhost:3000';
  static Map<String, String> headers = {
    'Authorization': 'Bearer [token]',
  };
  static GetFeedbackCall getFeedbackCall = GetFeedbackCall();
  static DownloadMarksCall downloadMarksCall = DownloadMarksCall();

  static final interceptors = [
    RefreshToken(),
  ];
}

class GetFeedbackCall {
  Future<ApiCallResponse> call({
    int? moduleID,
    String? userID = '',
    String? token = '',
  }) async {
    final baseUrl = FeedbackGroup.getBaseUrl(
      token: token,
    );

    return FFApiInterceptor.makeApiCall(
      ApiCallOptions(
        callName: 'Get Feedback',
        apiUrl: '$baseUrl/v1/feedback/$moduleID/$userID',
        callType: ApiCallType.GET,
        headers: {
          'Authorization': 'Bearer $token',
        },
        params: const {},
        returnBody: true,
        encodeBodyUtf8: false,
        decodeUtf8: false,
        cache: false,
        isStreamingApi: false,
        alwaysAllowBody: false,
      ),
      FeedbackGroup.interceptors,
    );
  }

  List? feedback(dynamic response) => getJsonField(
        response,
        r'''$.feedback''',
        true,
      ) as List?;
}

class DownloadMarksCall {
  Future<ApiCallResponse> call({
    String? token = '',
  }) async {
    final baseUrl = FeedbackGroup.getBaseUrl(
      token: token,
    );

    return FFApiInterceptor.makeApiCall(
      ApiCallOptions(
        callName: 'Download Marks',
        apiUrl: '$baseUrl/v1/download-marks',
        callType: ApiCallType.GET,
        headers: {
          'Authorization': 'Bearer $token',
        },
        params: const {},
        returnBody: true,
        encodeBodyUtf8: false,
        decodeUtf8: false,
        cache: false,
        isStreamingApi: false,
        alwaysAllowBody: false,
      ),
      FeedbackGroup.interceptors,
    );
  }
}

/// End Feedback Group Code

/// Start Submission Group Code

class SubmissionGroup {
  static String getBaseUrl({
    String? token = '',
  }) =>
      'http://localhost:3000';
  static Map<String, String> headers = {
    'Authorization': 'Bearer [token]',
  };
  static GetSubmissionCall getSubmissionCall = GetSubmissionCall();
  static GetNotMarkedCall getNotMarkedCall = GetNotMarkedCall();
  static GetMarkedCall getMarkedCall = GetMarkedCall();

  static final interceptors = [
    RefreshToken(),
  ];
}

class GetSubmissionCall {
  Future<ApiCallResponse> call({
    String? assignmentID = '',
    String? token = '',
  }) async {
    final baseUrl = SubmissionGroup.getBaseUrl(
      token: token,
    );

    return FFApiInterceptor.makeApiCall(
      ApiCallOptions(
        callName: 'Get Submission',
        apiUrl: '$baseUrl/v1/assignment/$assignmentID/submissions',
        callType: ApiCallType.GET,
        headers: {
          'Authorization': 'Bearer $token',
        },
        params: const {},
        returnBody: true,
        encodeBodyUtf8: false,
        decodeUtf8: false,
        cache: false,
        isStreamingApi: false,
        alwaysAllowBody: false,
      ),
      SubmissionGroup.interceptors,
    );
  }

  List? submission(dynamic response) => getJsonField(
        response,
        r'''$.submission''',
        true,
      ) as List?;
}

class GetNotMarkedCall {
  Future<ApiCallResponse> call({
    String? assignmentID = '',
    String? token = '',
  }) async {
    final baseUrl = SubmissionGroup.getBaseUrl(
      token: token,
    );

    return FFApiInterceptor.makeApiCall(
      ApiCallOptions(
        callName: 'Get NotMarked',
        apiUrl: '$baseUrl/v1/submissions/not-marked/$assignmentID',
        callType: ApiCallType.GET,
        headers: {
          'Authorization': 'Bearer $token',
        },
        params: const {},
        returnBody: true,
        encodeBodyUtf8: false,
        decodeUtf8: false,
        cache: false,
        isStreamingApi: false,
        alwaysAllowBody: false,
      ),
      SubmissionGroup.interceptors,
    );
  }

  List? notMarkedSubmission(dynamic response) => getJsonField(
        response,
        r'''$.submission''',
        true,
      ) as List?;
}

class GetMarkedCall {
  Future<ApiCallResponse> call({
    String? assignmentID = '',
    String? token = '',
  }) async {
    final baseUrl = SubmissionGroup.getBaseUrl(
      token: token,
    );

    return FFApiInterceptor.makeApiCall(
      ApiCallOptions(
        callName: 'Get Marked',
        apiUrl: '$baseUrl/v1/submissions/marked/$assignmentID',
        callType: ApiCallType.GET,
        headers: {
          'Authorization': 'Bearer $token',
        },
        params: const {},
        returnBody: true,
        encodeBodyUtf8: false,
        decodeUtf8: false,
        cache: false,
        isStreamingApi: false,
        alwaysAllowBody: false,
      ),
      SubmissionGroup.interceptors,
    );
  }

  List? markedSubmission(dynamic response) => getJsonField(
        response,
        r'''$.submission''',
        true,
      ) as List?;
}

/// End Submission Group Code

/// Start Auth Group Code

class AuthGroup {
  static String getBaseUrl() => 'http://localhost:3000';
  static Map<String, String> headers = {};
  static LoginCall loginCall = LoginCall();
  static RefreshTokenCall refreshTokenCall = RefreshTokenCall();
  static LogoutCall logoutCall = LogoutCall();
  static ForgotPasswordCall forgotPasswordCall = ForgotPasswordCall();
  static VerifyResetCodeCall verifyResetCodeCall = VerifyResetCodeCall();
  static ResetPasswordCall resetPasswordCall = ResetPasswordCall();
}

class LoginCall {
  Future<ApiCallResponse> call({
    String? username = '',
    String? password = '',
  }) async {
    final baseUrl = AuthGroup.getBaseUrl();

    final ffApiRequestBody = '''
{
  "username": "$username",
  "password": "$password"
}''';
    return ApiManager.instance.makeApiCall(
      callName: 'Login',
      apiUrl: '$baseUrl/v1/login',
      callType: ApiCallType.POST,
      headers: {},
      params: {},
      body: ffApiRequestBody,
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
      isStreamingApi: false,
      alwaysAllowBody: false,
    );
  }

  String? errorMessage(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.message''',
      ));
  String? accessToken(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.accessToken''',
      ));
  String? userType(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.userType''',
      ));
  String? refreshToken(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.refreshToken''',
      ));
}

class RefreshTokenCall {
  Future<ApiCallResponse> call({
    String? refreshToken = '',
  }) async {
    final baseUrl = AuthGroup.getBaseUrl();

    return ApiManager.instance.makeApiCall(
      callName: 'Refresh Token',
      apiUrl: '$baseUrl/v1/refresh-token',
      callType: ApiCallType.POST,
      headers: {
        'Authorization': 'Bearer $refreshToken',
      },
      params: {},
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
      isStreamingApi: false,
      alwaysAllowBody: false,
    );
  }

  String? errorMessage(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.message''',
      ));
  String? accessToken(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.accessToken''',
      ));
  String? refreshToken(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.refreshToken''',
      ));
  String? userType(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.userType''',
      ));
}

class LogoutCall {
  Future<ApiCallResponse> call({
    String? token = '',
  }) async {
    final baseUrl = AuthGroup.getBaseUrl();

    return FFApiInterceptor.makeApiCall(
      ApiCallOptions(
        callName: 'Logout',
        apiUrl: '$baseUrl/v1/logout',
        callType: ApiCallType.POST,
        headers: {
          'Authorization': 'Bearer $token',
        },
        params: const {},
        bodyType: BodyType.JSON,
        returnBody: true,
        encodeBodyUtf8: false,
        decodeUtf8: false,
        cache: false,
        isStreamingApi: false,
        alwaysAllowBody: false,
      ),
      interceptors,
    );
  }

  static final interceptors = [
    RefreshToken(),
  ];
}

class ForgotPasswordCall {
  Future<ApiCallResponse> call({
    String? email = '',
  }) async {
    final baseUrl = AuthGroup.getBaseUrl();

    final ffApiRequestBody = '''
{
  "email": "$email"
}''';
    return ApiManager.instance.makeApiCall(
      callName: 'Forgot Password',
      apiUrl: '$baseUrl/v1/forgot-password',
      callType: ApiCallType.POST,
      headers: {},
      params: {},
      body: ffApiRequestBody,
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
      isStreamingApi: false,
      alwaysAllowBody: false,
    );
  }

  String? errorMessage(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.message''',
      ));
}

class VerifyResetCodeCall {
  Future<ApiCallResponse> call({
    String? email = '',
    String? resetCode = '',
  }) async {
    final baseUrl = AuthGroup.getBaseUrl();

    final ffApiRequestBody = '''
{
  "email": "$email",
  "resetCode": "$resetCode"
}''';
    return ApiManager.instance.makeApiCall(
      callName: 'Verify Reset Code',
      apiUrl: '$baseUrl/v1/verify-reset-code',
      callType: ApiCallType.POST,
      headers: {},
      params: {},
      body: ffApiRequestBody,
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
      isStreamingApi: false,
      alwaysAllowBody: false,
    );
  }

  String? errorMessage(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.message''',
      ));
}

class ResetPasswordCall {
  Future<ApiCallResponse> call({
    String? email = '',
    String? newPassword = '',
  }) async {
    final baseUrl = AuthGroup.getBaseUrl();

    final ffApiRequestBody = '''
{
  "email": "$email",
  "newPassword": "$newPassword"
}''';
    return ApiManager.instance.makeApiCall(
      callName: 'Reset Password',
      apiUrl: '$baseUrl/v1/reset-password',
      callType: ApiCallType.POST,
      headers: {},
      params: {},
      body: ffApiRequestBody,
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
      isStreamingApi: false,
      alwaysAllowBody: false,
    );
  }

  String? errorMessage(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.message''',
      ));
}

/// End Auth Group Code

/// Start VideoCompression Group Code

class VideoCompressionGroup {
  static String getBaseUrl() => 'http://localhost:3000/api';
  static Map<String, String> headers = {};
  static PostVideoCall postVideoCall = PostVideoCall();
}

class PostVideoCall {
  Future<ApiCallResponse> call({
    FFUploadedFile? video,
    String? token = '',
  }) async {
    final baseUrl = VideoCompressionGroup.getBaseUrl();

    return ApiManager.instance.makeApiCall(
      callName: 'PostVideo',
      apiUrl: '$baseUrl/v1/video-upload',
      callType: ApiCallType.POST,
      headers: {
        'Authorization': 'Bearer $token',
      },
      params: {
        'video': video,
        'token': token,
      },
      bodyType: BodyType.MULTIPART,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
      isStreamingApi: false,
      alwaysAllowBody: false,
    );
  }

  String? errorMessage(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.message''',
      ));
}

/// End VideoCompression Group Code

/// Start Admin Group Code

class AdminGroup {
  static String getBaseUrl({
    String? token = '',
  }) =>
      'http://localhost:3000';
  static Map<String, String> headers = {
    'Authorization': 'Bearer [token]',
  };
}

/// End Admin Group Code

class ApiPagingParams {
  int nextPageNumber = 0;
  int numItems = 0;
  dynamic lastResponse;

  ApiPagingParams({
    required this.nextPageNumber,
    required this.numItems,
    required this.lastResponse,
  });

  @override
  String toString() =>
      'PagingParams(nextPageNumber: $nextPageNumber, numItems: $numItems, lastResponse: $lastResponse,)';
}

String _toEncodable(dynamic item) {
  return item;
}

String _serializeList(List? list) {
  list ??= <String>[];
  try {
    return json.encode(list, toEncodable: _toEncodable);
  } catch (_) {
    if (kDebugMode) {
      print("List serialization failed. Returning empty list.");
    }
    return '[]';
  }
}

String _serializeJson(dynamic jsonVar, [bool isList = false]) {
  jsonVar ??= (isList ? [] : {});
  try {
    return json.encode(jsonVar, toEncodable: _toEncodable);
  } catch (_) {
    if (kDebugMode) {
      print("Json serialization failed. Returning empty json.");
    }
    return isList ? '[]' : '{}';
  }
}
