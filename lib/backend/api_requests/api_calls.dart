import 'dart:convert';

import 'package:flutter/foundation.dart';

import '/flutter_flow/flutter_flow_util.dart';
import 'api_manager.dart';

export 'api_manager.dart' show ApiCallResponse;

const _kPrivateApiFunctionName = 'ffPrivateApiCall';

/// Start User Group Code

class UserGroup {
  static String getBaseUrl() => 'http://192.168.3.66:3000';
  static Map<String, String> headers = {};
  static AddUserCall addUserCall = AddUserCall();
  static GetUserCall getUserCall = GetUserCall();
}

class AddUserCall {
  Future<ApiCallResponse> call({
    String? firstName = '',
    String? lastName = '',
    String? phoneNum = '',
    String? userType = '',
    String? token = '',
  }) async {
    final baseUrl = UserGroup.getBaseUrl();

    final ffApiRequestBody = '''
{
  "firstName": "$firstName",
  "lastName": "$lastName",
  "phoneNum": "$phoneNum",
  "userType": "$userType"
}''';
    return ApiManager.instance.makeApiCall(
      callName: 'Add User',
      apiUrl: '$baseUrl/api/v1/addUser',
      callType: ApiCallType.POST,
      headers: {
        'Authorization': 'Bearer $token',
      },
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

class GetUserCall {
  Future<ApiCallResponse> call({
    String? token = '',
  }) async {
    final baseUrl = UserGroup.getBaseUrl();

    return ApiManager.instance.makeApiCall(
      callName: 'Get User',
      apiUrl: '$baseUrl/api/v1/user',
      callType: ApiCallType.GET,
      headers: {
        'Authorization': 'Bearer $token',
      },
      params: {},
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
      isStreamingApi: false,
      alwaysAllowBody: false,
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
  static String getBaseUrl() => 'http://192.168.3.66:3000';
  static Map<String, String> headers = {};
  static GetModuleCall getModuleCall = GetModuleCall();
  static GetAssignmentCall getAssignmentCall = GetAssignmentCall();
}

class GetModuleCall {
  Future<ApiCallResponse> call({
    String? token = '',
  }) async {
    final baseUrl = AssignmentGroup.getBaseUrl();

    return ApiManager.instance.makeApiCall(
      callName: 'GetModule',
      apiUrl: '$baseUrl/api/v1/module',
      callType: ApiCallType.GET,
      headers: {
        'Authorization': 'Bearer $token',
      },
      params: {},
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

    return ApiManager.instance.makeApiCall(
      callName: 'GetAssignment',
      apiUrl: '$baseUrl/api/v1/assignments/$moduleID',
      callType: ApiCallType.GET,
      headers: {
        'Authorization': 'Bearer $token',
      },
      params: {},
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
      isStreamingApi: false,
      alwaysAllowBody: false,
    );
  }

  int? assignID(dynamic response) => castToType<int>(getJsonField(
        response,
        r'''$.assignment.assignmentID''',
      ));
  int? userID(dynamic response) => castToType<int>(getJsonField(
        response,
        r'''$.assignment.userID''',
      ));
  int? moduleID(dynamic response) => castToType<int>(getJsonField(
        response,
        r'''$.assignment.moduleID''',
      ));
  String? name(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.assignment.assignName''',
      ));
  String? description(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.assignment.assignDesc''',
      ));
  String? dueDate(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.assignment.assignDueDate''',
      ));
  String? createdAt(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.assignment.assignCreatedAt''',
      ));
  String? updatedAt(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.assignment.assignUpdatedAt''',
      ));
  List? assignment(dynamic response) => getJsonField(
        response,
        r'''$.assignment''',
        true,
      ) as List?;
}

/// End Assignment Group Code

class LoginCall {
  static Future<ApiCallResponse> call({
    String? username = '',
    String? password = '',
  }) async {
    final ffApiRequestBody = '''
{
  "username": "$username",
  "password": "$password"
}''';
    return ApiManager.instance.makeApiCall(
      callName: 'Login',
      apiUrl: 'http://192.168.3.66:3000/api/v1/login',
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

  static String? accessToken(dynamic response) =>
      castToType<String>(getJsonField(
        response,
        r'''$.accessToken''',
      ));
  static String? refreshToken(dynamic response) =>
      castToType<String>(getJsonField(
        response,
        r'''$.refreshToken''',
      ));
  static int? userID(dynamic response) => castToType<int>(getJsonField(
        response,
        r'''$.userID''',
      ));
  static String? userType(dynamic response) => castToType<String>(getJsonField(
        response,
        r'''$.userType''',
      ));
  static String? errorMessage(dynamic response) =>
      castToType<String>(getJsonField(
        response,
        r'''$.message''',
      ));
}

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
